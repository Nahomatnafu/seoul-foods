import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddButton } from "@/components/add-button";
import { ProductCard } from "@/components/product-card";
import { formatPrice, productImage, products } from "@/lib/products";

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const related = products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 3);

  return (
    <main className="product-page section">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/shop">Shop</Link><span>/</span><span>{product.category}</span><span>/</span><strong>{product.name}</strong></nav>
      <section className="product-detail">
        <div className={`detail-visual accent-${product.accent}`}><Image className="detail-photo" src={productImage(product.slug)} alt={`Photo representing ${product.name}`} fill sizes="(max-width: 980px) 100vw, 54vw" priority /><span className="detail-origin">{product.origin}</span><span className="detail-word">{product.category}</span></div>
        <div className="detail-copy">
          {product.tag && <p className="eyebrow">{product.tag}</p>}
          <h1>{product.name}</h1>
          <p className="detail-price">{formatPrice(product.price)}</p>
          <p className="detail-description">{product.description}</p>
          <dl className="detail-list"><div><dt>Origin</dt><dd>{product.origin}</dd></div><div><dt>Size</dt><dd>{product.size}</dd></div>{product.spicy && <div><dt>Heat</dt><dd>{"●".repeat(product.spicy)}{"○".repeat(5 - product.spicy)}</dd></div>}</dl>
          <AddButton product={product} className="button button-red detail-add" label="Add to pickup bag" />
          <p className="detail-note">Demo inventory • Availability and price may change • Pay in store</p>
        </div>
      </section>
      {related.length > 0 && <section className="related"><div className="section-heading row-heading"><h2>More from this aisle</h2><Link className="text-link" href="/shop">Keep browsing →</Link></div><div className="product-grid related-grid">{related.map((item, index) => <ProductCard product={item} index={index} key={item.slug} />)}</div></section>}
    </main>
  );
}
