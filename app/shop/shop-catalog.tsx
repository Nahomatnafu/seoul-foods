"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/products";

export function ShopCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [category, setCategory] = useState(categories.includes(initialCategory) ? initialCategory : "All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    return matchesCategory && `${product.name} ${product.origin} ${product.category}`.toLowerCase().includes(query.toLowerCase());
  }), [category, query]);

  return (
    <main className="shop-page">
      <section className="page-hero shop-hero"><p className="eyebrow light">THE GOOD STUFF</p><h1>Shop the shelves.</h1><p>Sample products and prices for this frontend demo. Real inventory will be connected after approval.</p></section>
      <section className="section catalog-section">
        <div className="catalog-tools">
          <div className="category-tabs" role="group" aria-label="Filter products by category">{categories.map((item) => <button className={category === item ? "selected" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
          <label className="search-box"><span>Search</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ramen, mochi, Korea…" /></label>
        </div>
        <div className="catalog-summary"><strong>{filtered.length} finds</strong><span>Pickup only • Pay in store</span></div>
        {filtered.length ? <div className="product-grid">{filtered.map((product, index) => <ProductCard key={product.slug} product={product} index={index} />)}</div> : <div className="empty-state"><span>🍙</span><h2>No snacks found</h2><p>Try a different category or search term.</p><button onClick={() => { setCategory("All"); setQuery(""); }}>Clear filters</button></div>}
      </section>
    </main>
  );
}
