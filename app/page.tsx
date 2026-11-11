import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { featuredProducts } from "@/lib/products";

const categoryTiles = [
  { label: "Noodles", text: "Packets, cups & pantry staples", image: "", alt: "", className: "tile-red grocery-tile", category: "Noodles" },
  { label: "Cold drinks", text: "Fizzy, fruity, creamy", image: "/category-drinks.avif", alt: "Cold drinks stocked in a market refrigerator", className: "tile-blue", category: "Drinks" },
  { label: "Snack aisle", text: "Crunchy, chewy, spicy", image: "/category-snacks.avif", alt: "A market display filled with packaged Asian snacks", className: "tile-yellow", category: "Snacks" },
  { label: "Freezer finds", text: "Frozen groceries for home", image: "", alt: "", className: "tile-pink grocery-tile", category: "Frozen" },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <Image className="hero-image" src="/hero-snacks.png" alt="Colorful assortment of Asian convenience-store snacks and drinks" fill sizes="100vw" priority />
        <div className="hero-copy">
          <p className="eyebrow light">NORTH MANKATO&apos;S ASIAN CONVENIENCE STORE</p>
          <h1>Your next<br /><span>grocery stop.</span></h1>
          <p className="hero-lead">Asian snacks, drinks, noodles and pantry favorites—right here in North Mankato.</p>
          <div className="hero-actions"><Link className="button button-white" href="/shop">Shop the shelves <span>↗</span></Link><Link className="text-link light" href="/visit">Plan your visit →</Link></div>
        </div>
        <div className="hero-sticker"><strong>SHOP</strong><span>LOCAL</span></div>
      </section>

      <section className="marquee" aria-label="Store highlights"><div>RAMEN RUNS ✦ FROZEN FINDS ✦ SWEET TREATS ✦ PANTRY STAPLES ✦ COLD DRINKS ✦ RAMEN RUNS ✦ FROZEN FINDS ✦</div></section>

      <section className="section category-section">
        <div className="section-heading split-heading"><div><p className="eyebrow">START WITH A CRAVING</p><h2>What are you<br />in the mood for?</h2></div><p>Familiar favorites, hard-to-find ingredients, and something new every time you stop in.</p></div>
        <div className="category-grid">
          {categoryTiles.map((tile) => <Link href={`/shop?category=${tile.category}`} className={`category-tile ${tile.className}`} key={tile.label}>{tile.image ? <Image className="category-photo" src={tile.image} alt={tile.alt} fill sizes="(max-width: 980px) 50vw, 25vw" /> : <span className="aisle-type" aria-hidden="true">{tile.category === 'Noodles' ? 'RAMEN\nUDON\nMORE' : 'STOCK\nYOUR\nFREEZER'}</span>}<span className="category-content"><small>{tile.text}</small><strong>{tile.label}</strong></span><b aria-hidden="true">↗</b></Link>)}
        </div>
      </section>

      <section className="section featured-section">
        <div className="section-heading row-heading"><div><p className="eyebrow">FROM THE STORE&apos;S INVENTORY</p><h2>A few grocery finds</h2></div><Link className="text-link" href="/shop">Browse all 100 →</Link></div>
        <p className="snapshot-note">Real products and exported prices. October 29, 2026 snapshot · Confirm current stock in store.</p>
        <div className="product-grid home-products">{featuredProducts.map((product, index) => <ProductCard product={product} index={index} key={product.slug} />)}</div>
      </section>

      <section className="pickup-callout">
        <div className="pickup-number">01</div><div><p className="eyebrow light">YOUR NEXT STORE RUN</p><h2>Study break snacks.<br />Groceries for home.</h2></div><div><p>Build a list of things to look for before you leave campus. Browse the aisles and shop in store.</p><Link className="button button-white" href="/shop">Explore the groceries →</Link></div>
      </section>

      <section className="section neighborhood-section">
        <div className="neighborhood-card"><p className="eyebrow">IN THE NEIGHBORHOOD</p><h2>Your local shortcut<br />to flavors from home.</h2><p>An Asian convenience store in North Mankato. Stop in for packaged snacks, cold drinks, noodles, frozen groceries, and pantry ingredients for your kitchen.</p><Link className="button button-dark" href="/visit">Come find us →</Link></div>
        <div className="neighborhood-graphic"><span className="big-korean">서울</span><div className="yin-yang"><span /></div><p>North Mankato<br />Minnesota</p></div>
      </section>
    </main>
  );
}
