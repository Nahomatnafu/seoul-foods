import Link from 'next/link';
import type { Product } from '@/lib/product-types';
import { formatPrice } from '@/lib/product-types';
import { ProductVisual } from './product-visual';
import { AddButton } from './add-button';

export function ProductCard({ product }: { product: Product; index?: number }) {
  return <article className="product-card">
    <Link href={`/product/${product.slug}`} className="product-visual inventory-visual" aria-label={`View ${product.name}`}><ProductVisual product={product} /></Link>
    <div className="product-info"><div className="product-meta"><span>{product.categoryNames.join(' · ') || product.category}</span></div><Link href={`/product/${product.slug}`}><h3>{product.name}</h3></Link><div className="product-row"><strong>{formatPrice(product.priceCents)}</strong><AddButton product={product} /></div></div>
  </article>;
}
