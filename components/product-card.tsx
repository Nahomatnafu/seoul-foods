import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { AddButton } from "./add-button";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <article className="product-card">
      <Link href={`/product/${product.slug}`} className={`product-visual accent-${product.accent}`} aria-label={`View ${product.name}`}>
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <span className="product-emoji" style={{ transform: `rotate(${index % 2 ? 5 : -4}deg)` }}>{product.emoji}</span>
        <span className="product-orbit" />
      </Link>
      <div className="product-info">
        <div className="product-meta"><span>{product.origin}</span><span>{product.category}</span></div>
        <Link href={`/product/${product.slug}`}><h3>{product.name}</h3></Link>
        <div className="product-row"><strong>{formatPrice(product.price)}</strong><AddButton product={product} /></div>
      </div>
    </article>
  );
}
