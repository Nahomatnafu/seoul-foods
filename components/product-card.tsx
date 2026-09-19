import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice, productImage } from "@/lib/products";
import { AddButton } from "./add-button";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <article className="product-card">
      <Link href={`/product/${product.slug}`} className={`product-visual accent-${product.accent}`} aria-label={`View ${product.name}`}>
        <Image className="product-photo" src={productImage(product.category)} alt={`Sample photo from the ${product.category.toLowerCase()} aisle`} fill sizes="(max-width: 720px) 50vw, (max-width: 980px) 50vw, 25vw" />
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <span className="product-photo-label">{product.category}</span>
      </Link>
      <div className="product-info">
        <div className="product-meta"><span>{product.origin}</span><span>{product.category}</span></div>
        <Link href={`/product/${product.slug}`}><h3>{product.name}</h3></Link>
        <div className="product-row"><strong>{formatPrice(product.price)}</strong><AddButton product={product} /></div>
      </div>
    </article>
  );
}
