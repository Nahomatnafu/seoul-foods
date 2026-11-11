import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { categories, products, queryCatalog, snapshotLabel } from '@/lib/products';

export const metadata: Metadata = { title: 'Browse groceries', description: 'Browse real Seoul Foods inventory: Asian snacks, drinks, noodles, frozen groceries, and pantry staples.' };

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const q = (typeof params.q === 'string' ? params.q : '').slice(0, 150);
  const category = typeof params.category === 'string' && categories.includes(params.category) ? params.category : 'All';
  const result = queryCatalog(q, category, Number(params.page || 1));
  const href = (cat: string, page = 1) => `/shop?${new URLSearchParams({ ...(cat !== 'All' ? { category: cat } : {}), ...(q ? { q } : {}), ...(page > 1 ? { page: String(page) } : {}) })}`;
  return <main className="shop-page">
    <section className="page-hero shop-hero"><p className="eyebrow light">YOUR NEIGHBORHOOD ASIAN CONVENIENCE STORE</p><h1>Good finds.<br />Every aisle.</h1><p>{products.length} real products from the Seoul Foods inventory. Snacks for the study break, groceries for home, and something new to try.</p></section>
    <section className="section catalog-section">
      <div className="catalog-tools"><nav className="category-tabs" aria-label="Grocery categories">{categories.map(cat => <Link key={cat} href={href(cat)} className={cat === category ? 'selected' : ''} aria-current={cat === category ? 'page' : undefined}>{cat}</Link>)}</nav>
        <form className="search-box" action="/shop"><label htmlFor="catalog-query">Find a product</label><div className="search-controls"><input id="catalog-query" type="search" name="q" defaultValue={q} placeholder="Nongshim, Pocky, mango…" /><button type="submit">Search</button></div>{category !== 'All' && <input type="hidden" name="category" value={category} />}</form></div>
      <div className="catalog-summary"><strong>{result.total} {result.total === 1 ? 'product' : 'products'}{q ? ` matching “${q}”` : ''}</strong><span>Inventory snapshot · {snapshotLabel}</span></div>
      <p className="snapshot-note">Prices are from the store&apos;s exported inventory. Call to confirm current price and stock. This draft does not place orders.</p>
      {result.items.length ? <><div className="product-grid">{result.items.map(product => <ProductCard product={product} key={product.id} />)}</div><nav className="pagination" aria-label="Product pages">{result.page > 1 && <Link className="button button-white" href={href(category, result.page - 1)}>Previous</Link>}<span>Page {result.page} of {result.pages}</span>{result.page < result.pages && <Link className="button button-blue" href={href(category, result.page + 1)}>Next</Link>}</nav></> : <div className="empty-state"><h2>No products found</h2><p>Try another product name, barcode, or category.</p><Link className="text-link" href="/shop">Clear filters</Link></div>}
    </section>
  </main>;
}
