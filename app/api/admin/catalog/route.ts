import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { isAdminSignedIn } from '@/lib/admin-session';
import { CatalogConflict, catalogStorage, saveCatalogPhoto, updateCatalog } from '@/lib/catalog-store';

class InvalidEdit extends Error {}

const maxPhotoBytes = 3 * 1024 * 1024;
const textField = (form: FormData, key: string) => String(form.get(key) ?? '').trim();
const normalizeName = (name: string) => name.normalize('NFKC').toLowerCase();
const slugify = (name: string) => name.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function preparePhoto(photo: File) {
  if (photo.size > maxPhotoBytes) throw new InvalidEdit('Choose an image under 3 MB.');
  try {
    const image = sharp(Buffer.from(await photo.arrayBuffer()), { limitInputPixels: 30_000_000 });
    const { format } = await image.metadata();
    if (!format || !['jpeg', 'png', 'webp'].includes(format)) throw new Error('Unsupported image');
    return await image.rotate().resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 88 }).toBuffer();
  } catch {
    throw new InvalidEdit('Choose a valid JPG, PNG, or WebP image.');
  }
}

export async function POST(request: Request) {
  const fail = (error: string, status: number) => Response.json({ error }, { status });
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  const protocol = process.env.VERCEL ? 'https:' : new URL(request.url).protocol;
  if (!origin || !host || origin !== `${protocol}//${host}`) {
    return fail('Open the dashboard directly to make edits.', 403);
  }
  if (!await isAdminSignedIn()) return fail('Sign in again to save changes.', 401);
  if (catalogStorage() === 'read-only') return fail('Catalog storage is unavailable.', 503);
  if (Number(request.headers.get('content-length')) > maxPhotoBytes + 100_000) {
    return fail('Choose an image under 3 MB.', 413);
  }

  try {
    const form = await request.formData();
    const operation = textField(form, 'operation');
    const id = textField(form, 'id');
    const name = textField(form, 'name').replace(/\s+/g, ' ');
    const revisionText = textField(form, 'revision');
    const revision = Number(revisionText);
    if (!/^\d+$/.test(revisionText) || !Number.isSafeInteger(revision)) throw new InvalidEdit('Reload the dashboard and try again.');

    const catalog = await updateCatalog(revision, async draft => {
      if (operation === 'delete-category') {
        if (!draft.categories.some(category => category.id === id)) throw new InvalidEdit('Category not found.');
        draft.categories = draft.categories.filter(category => category.id !== id);
        for (const item of draft.items) item.categoryIds = item.categoryIds.filter(categoryId => categoryId !== id);
        return;
      }

      if (operation === 'save-category') {
        if (!name || name.length > 60) throw new InvalidEdit('Enter a category name of 1–60 characters.');
        const normalized = normalizeName(name);
        if (['all', 'uncategorized'].includes(normalized) || draft.categories.some(category => category.id !== id && normalizeName(category.name) === normalized)) {
          throw new InvalidEdit('Choose a different category name.');
        }
        if (!id) draft.categories.push({ id: randomUUID(), name });
        else {
          const category = draft.categories.find(category => category.id === id);
          if (!category) throw new InvalidEdit('Category not found.');
          category.name = name;
        }
        return;
      }

      if (operation !== 'save-product') throw new InvalidEdit('Choose an edit to save.');
      if (!name || name.length > 140) throw new InvalidEdit('Enter a product name of 1–140 characters.');
      const price = textField(form, 'price');
      if (!/^\d{1,6}(\.\d{1,2})?$/.test(price)) throw new InvalidEdit('Enter a price in dollars with up to two decimal places.');
      const [dollars, cents = ''] = price.split('.');
      const priceCents = Number(dollars) * 100 + Number(cents.padEnd(2, '0'));
      const barcode = textField(form, 'barcode');
      if (barcode && !/^\d{8,14}$/.test(barcode)) throw new InvalidEdit('Enter an 8–14 digit barcode or leave it blank.');
      const categoryIds = Array.from(new Set(form.getAll('categories').map(String)));
      if (categoryIds.some(categoryId => !draft.categories.some(category => category.id === categoryId))) {
        throw new InvalidEdit('Choose categories that still exist.');
      }
      const existing = draft.items.find(item => item.id === id);
      if (id && !existing) throw new InvalidEdit('Product not found.');
      const photo = form.get('photo');
      const replacement = photo instanceof File && photo.size > 0 ? await preparePhoto(photo) : null;
      const image = replacement ? await saveCatalogPhoto(replacement) : existing?.image ?? null;
      const imageCaption = replacement ? undefined : existing?.imageCaption;

      if (existing) {
        Object.assign(existing, { name, priceCents, barcode, categoryIds, image, imageCaption });
      } else {
        const newId = randomUUID();
        const slug = (slugify(name).slice(0, 90) || 'product') + '--' + newId;
        draft.items.push({ id: newId, slug, name, priceCents, barcode, categoryIds, image, cloverItemId: null });
      }
    });
    return Response.json({ catalog }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof InvalidEdit) return fail(error.message, 400);
    if (error instanceof CatalogConflict) return fail('Someone else saved changes. Reload the dashboard before saving again.', 409);
    console.error('Catalog edit failed', error);
    return fail('Could not save your changes. Try again.', 500);
  }
}
