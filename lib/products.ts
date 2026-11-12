import 'server-only';
import { cache } from 'react';
import { loadCatalog } from './catalog-store';
import type { Product } from './product-types';

export const snapshotDate = '2026-10-29';
export const snapshotLabel = 'October 29, 2026';

export const getStorefront = cache(async () => {
  const catalog = await loadCatalog();
  const categories = new Map(catalog.categories.map(category => [category.id, category.name]));
  const products = catalog.items.map(({ id, slug, name, priceCents, barcode, image, imageCaption, categoryIds }): Product => {
    const categoryNames = categoryIds.flatMap(id => categories.get(id) ?? []);
    return {
      id, slug, name, priceCents, barcode, image, imageCaption,
      categoryId: categoryIds[0] ?? '',
      category: categoryNames[0] ?? 'Uncategorized',
      categoryNames,
    };
  }).sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)));
  const featured = new Set(catalog.categories.flatMap(({ id }) => products.find(product => product.categoryId === id && product.image) ?? []));
  for (const product of products) {
    if (featured.size >= 8) break;
    if (product.image) featured.add(product);
  }
  return { catalog, products, featuredProducts: [...featured].slice(0, 8) };
});

export async function queryCatalog(query = '', category = '', page = 1) {
  const { catalog, products } = await getStorefront();
  const validCategory = catalog.categories.find(item => item.id === category || item.name.toLowerCase() === category.toLowerCase())?.id ?? '';
  const tokens = query.normalize('NFKC').toLowerCase().trim().split(/\s+/).filter(Boolean);
  const memberships = new Map(catalog.items.map(item => [item.id, item.categoryIds]));
  const matches = products.filter(product => {
    if (validCategory && !memberships.get(product.id)?.includes(validCategory)) return false;
    const searchable = [product.name, ...product.categoryNames, product.barcode].join(' ').normalize('NFKC').toLowerCase();
    return tokens.every(token => searchable.includes(token));
  });
  const pages = Math.max(1, Math.ceil(matches.length / 24));
  const currentPage = Math.max(1, Math.min(Number.isSafeInteger(page) ? page : 1, pages));
  return { items: matches.slice((currentPage - 1) * 24, currentPage * 24), total: matches.length, pages, page: currentPage, category: validCategory };
}
