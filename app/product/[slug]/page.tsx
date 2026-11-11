import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddButton } from '@/components/add-button';
import { ProductCard } from '@/components/product-card';
import { ProductVisual } from '@/components/product-visual';
import { formatPrice } from '@/lib/product-types';
import { products, snapshotLabel } from '@/lib/products';

export function generateStaticParams() { return products.map(product => ({ slug: product.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  return product ? { title: product.name, description: `${product.name} in the Seoul Foods grocery inventory.` } : {};
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  if (!product) notFound();
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
  return <main className="product-page section"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/shop">Groceries</Link><span>/</span><Link href={`/shop?category=${product.category}`}>{product.category}</Link><span>/</span><strong>{product.name}</strong></nav>
    <section className="product-detail"><div className="detail-visual inventory-visual"><ProductVisual product={product} /></div><div className="detail-copy"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="detail-price">{formatPrice(product.priceCents)}</p><p>From the Seoul Foods inventory snapshot dated {snapshotLabel}. Visit the store or call to confirm today&apos;s availability and price.</p><dl className="detail-list"><div><dt>Product code</dt><dd>{product.barcode}</dd></div><div><dt>Shopping</dt><dd>In store</dd></div></dl><AddButton product={product} className="button button-red detail-add" label="Add to demo bag" /><p className="detail-note">Preview your grocery list. No order or payment is sent.</p><a className="text-link" href="tel:+15077205306">Ask the store: (507) 720-5306</a></div></section>
    {related.length > 0 && <section className="related"><div className="section-heading row-heading"><h2>More from this aisle</h2><Link className="text-link" href={`/shop?category=${product.category}`}>Browse the aisle →</Link></div><div className="product-grid related-grid">{related.map(p => <ProductCard product={p} key={p.id} />)}</div></section>}
  </main>;
}
