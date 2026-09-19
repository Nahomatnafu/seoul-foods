import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { featuredProducts } from "@/lib/products";

const categoryTiles = [
  { label: "Noodles", text: "Slurp-worthy staples", image: "/category-noodles.avif", alt: "A colorful bowl of ramen", className: "tile-red", category: "Noodles" },
  { label: "Cold drinks", text: "Fizzy, fruity, creamy", image: "/category-drinks.avif", alt: "Cold drinks stocked in a market refrigerator", className: "tile-blue", category: "Drinks" },
  { label: "Snack aisle", text: "Crunchy, chewy, spicy", image: "/category-snacks.avif", alt: "A market display filled with packaged Asian snacks", className: "tile-yellow", category: "Snacks" },
  { label: "Freezer finds", text: "Dumplings to ice bars", image: "/category-frozen.avif", alt: "Freshly prepared dumplings", className: "tile-pink", category: "Frozen" },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <Image className="hero-image" src="/hero-snacks.png" alt="Colorful assortment of Asian convenience-store snacks and drinks" fill sizes="100vw" priority />
        <div className="hero-copy">
          <p className="eyebrow light">YOUR NEXT SNACK OBSESSION IS HERE</p>
          <h1>Big flavor.<br /><span>Zero road trip.</span></h1>
          <p className="hero-lead">Asian snacks, drinks, noodles and pantry favorites—right here in North Mankato.</p>
          <div className="hero-actions"><Link className="button button-white" href="/shop">Shop the shelves <span>↗</span></Link><Link className="text-link light" href="/visit">Plan your visit →</Link></div>
        </div>
        <div className="hero-sticker"><strong>OPEN</strong><span>7 DAYS</span></div>
      </section>

      <section className="marquee" aria-label="Store highlights"><div>RAMEN RUNS ✦ FROZEN FINDS ✦ SWEET TREATS ✦ PANTRY STAPLES ✦ COLD DRINKS ✦ RAMEN RUNS ✦ FROZEN FINDS ✦</div></section>

      <section className="section category-section">
        <div className="section-heading split-heading"><div><p className="eyebrow">START WITH A CRAVING</p><h2>What are you<br />in the mood for?</h2></div><p>Familiar favorites, hard-to-find ingredients, and something new every time you stop in.</p></div>
        <div className="category-grid">
          {categoryTiles.map((tile) => <Link href={`/shop?category=${tile.category}`} className={`category-tile ${tile.className}`} key={tile.label}><Image className="category-photo" src={tile.image} alt={tile.alt} fill sizes="(max-width: 720px) 50vw, (max-width: 980px) 50vw, 25vw" /><span className="category-content"><small>{tile.text}</small><strong>{tile.label}</strong></span><b aria-hidden="true">↗</b></Link>)}
        </div>
      </section>

      <section className="section featured-section">
        <div className="section-heading row-heading"><div><p className="eyebrow">ON EVERYONE&apos;S LIST</p><h2>Current cravings</h2></div><Link className="text-link" href="/shop">See everything →</Link></div>
        <div className="product-grid home-products">{featuredProducts.map((product, index) => <ProductCard product={product} index={index} key={product.slug} />)}</div>
      </section>

      <section className="pickup-callout">
        <div className="pickup-number">01</div><div><p className="eyebrow light">PICKUP, SIMPLIFIED</p><h2>Build your snack run<br />before you leave campus.</h2></div><div><p>Add your favorites, choose a time, and pay when you pick up. No delivery fees. No checkout surprises.</p><Link className="button button-white" href="/shop">Start a pickup bag →</Link></div>
      </section>

      <section className="section neighborhood-section">
        <div className="neighborhood-card"><p className="eyebrow">IN THE NEIGHBORHOOD</p><h2>Your local shortcut<br />to flavors from home.</h2><p>Seoul Foods brings Korean favorites and a growing mix of Japanese, Vietnamese, Filipino, Thai and Chinese groceries to southern Minnesota.</p><Link className="button button-dark" href="/visit">Come find us →</Link></div>
        <div className="neighborhood-graphic"><span className="big-korean">서울</span><div className="yin-yang"><span /></div><p>North Mankato<br />Minnesota</p></div>
      </section>
    </main>
  );
}
