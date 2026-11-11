"use client";
import Link from 'next/link';
import { useCart } from '@/components/cart-provider';
import { formatPrice } from '@/lib/product-types';
import { ProductVisual } from '@/components/product-visual';

export default function PickupPage() {
  const { items, subtotal, loading, error, updateQuantity, removeItem } = useCart();
  return <main className="pickup-page section"><div className="page-title"><p className="eyebrow">YOUR GROCERY LIST</p><h1>Plan your next<br />store run.</h1><p>Save a few finds for your visit. This demo bag does not reserve stock, send an order, or take payment.</p></div>
    {error && <p className="bag-error" role="alert">{error} Reload the page to try again.</p>}
    {loading && <p className="snapshot-note" role="status">Refreshing your bag from the inventory snapshot…</p>}
    {!items.length && !loading ? <div className="empty-bag"><span className="empty-bag-label">LET&apos;S FILL THE LIST</span><h2>Your demo bag is empty.</h2><p>Browse the store&apos;s groceries and save something for your next stop.</p><Link className="button button-red" href="/shop">Browse groceries →</Link></div> :
    items.length > 0 && <div className="pickup-layout"><section className="bag-list" aria-label="Grocery bag items"><div className="bag-heading"><h2>Your finds</h2><span>{items.reduce((sum, p) => sum + p.quantity, 0)} items</span></div>{items.map(item => <article className="bag-item" key={item.id}><div className="bag-thumb inventory-visual"><ProductVisual product={item} compact /></div><div className="bag-name"><Link href={`/product/${item.slug}`}>{item.name}</Link><span>{item.category} · {formatPrice(item.priceCents)} each</span><button onClick={() => removeItem(item.id)}>Remove</button></div><div className="quantity-control"><button disabled={loading} onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`}>−</button><span>{item.quantity}</span><button disabled={loading || item.quantity >= 99} onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`}>+</button></div><strong>{formatPrice(item.priceCents * item.quantity)}</strong></article>)}</section><aside className="pickup-form"><p className="eyebrow">A LITTLE PLANNING, A GOOD GROCERY RUN</p><h2>See you in store.</h2><p>410 Belgrade Ave<br />North Mankato, MN 56003</p><div className="order-total"><span>Estimated subtotal</span><strong>{loading || error ? 'Refreshing…' : formatPrice(subtotal)}</strong></div><p>Based on the October 29, 2026 inventory export. Taxes are not included. Current prices and stock need confirmation.</p><a className="button button-blue" href="tel:+15077205306">Call the store</a><Link className="text-link" href="/shop">Keep browsing →</Link><p className="form-disclaimer">Pickup scheduling can be added after the store approves the process. No pickup is booked in this draft.</p></aside></div>}
  </main>;
}
