import 'server-only';
import { randomUUID } from 'node:crypto';
import { mkdir, open, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import inventory from './catalog-data.json';
import type { Catalog } from './catalog-types';

const seed: Catalog = {
  revision: 0,
  updatedAt: null,
  categories: ['Snacks', 'Sweets', 'Drinks', 'Noodles', 'Frozen', 'Pantry', 'Refrigerated'].map(name => ({
    id: name.toLowerCase(),
    name,
  })),
  items: inventory.map(({ category, ...item }) => ({
    ...item,
    categoryIds: [category.toLowerCase()],
    cloverItemId: item.id,
  })),
};

const localDirectory = process.env.SEOUL_CATALOG_DIR || path.join(process.cwd(), '.catalog-local');
const localCatalog = path.join(localDirectory, 'catalog.json');
const catalogRecord = '/rest/v1/storefront_catalog?id=eq.main';
const photoBucket = '/storage/v1/object/catalog-photos/';

function supabaseRequest(endpoint: string, options: RequestInit = {}) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('Supabase catalog storage is unavailable.');
  const headers = new Headers(options.headers);
  headers.set('apikey', key);
  return fetch(url.replace(/\/$/, '') + endpoint, {
    ...options,
    headers,
    cache: 'no-store',
    signal: AbortSignal.timeout(12_000),
  });
}

export function catalogStorage() {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) return 'supabase';
  return process.env.VERCEL ? 'read-only' : 'local';
}

export class CatalogConflict extends Error {}

function missingFile(error: unknown) {
  return (error as NodeJS.ErrnoException).code === 'ENOENT';
}

async function readCatalog() {
  switch (catalogStorage()) {
    case 'supabase': {
      const response = await supabaseRequest(catalogRecord + '&select=data');
      if (!response.ok) throw new Error('Unable to read the Supabase catalog.');
      const [row] = await response.json() as { data: Catalog | null }[];
      if (!row) throw new Error('The Supabase catalog migration has not been applied.');
      return row.data ?? seed;
    }
    case 'local':
      try {
        return JSON.parse(await readFile(localCatalog, 'utf8')) as Catalog;
      } catch (error) {
        if (!missingFile(error)) throw error;
        return seed;
      }
    default:
      return seed;
  }
}

export const loadCatalog = readCatalog;

export async function updateCatalog(revision: number, change: (draft: Catalog) => Promise<void>) {
  const storage = catalogStorage();
  if (storage === 'read-only') throw new Error('Catalog storage is unavailable.');
  const lockPath = localCatalog + '.lock';
  let lock;
  if (storage === 'local') {
    await mkdir(localDirectory, { recursive: true });
    lock = await open(lockPath, 'wx').catch(error => {
      if (error.code === 'EEXIST') throw new CatalogConflict();
      throw error;
    });
  }

  try {
    const catalog = await readCatalog();
    if (catalog.revision !== revision) throw new CatalogConflict();
    const draft = structuredClone(catalog);
    await change(draft);
    draft.revision++;
    draft.updatedAt = new Date().toISOString();
    const contents = JSON.stringify(draft);
    if (storage === 'supabase') {
      const response = await supabaseRequest(catalogRecord + '&revision=eq.' + revision + '&select=revision', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
        body: JSON.stringify({ revision: draft.revision, data: draft }),
      });
      if (!response.ok) throw new Error('Unable to save the Supabase catalog.');
      if ((await response.json()).length === 0) throw new CatalogConflict();
    } else {
      const temp = localCatalog + '.' + randomUUID() + '.tmp';
      try {
        await writeFile(temp, contents, 'utf8');
        await rename(temp, localCatalog);
      } finally {
        await unlink(temp).catch(() => {});
      }
    }
    return draft;
  } finally {
    if (lock) {
      await lock.close();
      await unlink(lockPath);
    }
  }
}

export async function saveCatalogPhoto(bytes: Buffer) {
  const filename = randomUUID() + '.webp';
  if (catalogStorage() === 'supabase') {
    const response = await supabaseRequest(photoBucket + filename, {
      method: 'POST',
      headers: { 'Content-Type': 'image/webp', 'x-upsert': 'false' },
      body: new Uint8Array(bytes),
    });
    if (!response.ok) throw new Error('Unable to upload the product photo.');
  } else {
    const directory = path.join(localDirectory, 'photos');
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, filename), bytes, { flag: 'wx' });
  }
  return '/api/catalog-photo/' + filename;
}

export async function readCatalogPhoto(filename: string): Promise<BodyInit | null> {
  if (!/^[a-f0-9-]{36}\.webp$/.test(filename)) return null;
  switch (catalogStorage()) {
    case 'supabase': {
      const response = await supabaseRequest('/storage/v1/object/authenticated/catalog-photos/' + filename);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error('Unable to read the product photo.');
      return response.body;
    }
    case 'local':
      try {
        return new Uint8Array(await readFile(path.join(localDirectory, 'photos', filename)));
      } catch (error) {
        if (!missingFile(error)) throw error;
        return null;
      }
    default:
      return null;
  }
}
