import 'server-only';
import inventory from './catalog-data.json';
import type { Product } from './product-types';

export const products: Product[] = [...inventory].sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)));
export const categories = ['All', 'Snacks', 'Sweets', 'Drinks', 'Noodles', 'Frozen', 'Pantry', 'Refrigerated'];
export const snapshotLabel = 'October 29, 2026';
export const featuredProducts = [...categories.slice(1).flatMap(category => products.filter(p => p.category === category && p.image).slice(0, 1)), ...products.filter(p => p.category === 'Noodles' && p.image).slice(0, 1)].slice(0, 8);

export function queryCatalog(query = '', category = 'All', page = 1) {
  const tokens = query.normalize('NFKC').toLowerCase().trim().split(/\s+/).filter(Boolean);
  const matches = products.filter(p => (category === 'All' || p.category === category) && tokens.every(token => `${p.name} ${p.category} ${p.barcode}`.normalize('NFKC').toLowerCase().includes(token)));
  const pages = Math.max(1, Math.ceil(matches.length / 24));
  const currentPage = Math.max(1, Math.min(Number.isSafeInteger(page) ? page : 1, pages));
  return { items: matches.slice((currentPage - 1) * 24, currentPage * 24), total: matches.length, pages, page: currentPage };
}
