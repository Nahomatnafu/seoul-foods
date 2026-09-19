"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/products";

const times = ["11:00 AM", "12:30 PM", "2:00 PM", "3:30 PM", "5:00 PM", "6:30 PM", "8:00 PM"];

export default function PickupPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  if (submitted) return <main className="confirmation-page"><div className="confirmation-card"><span>✓</span><p className="eyebrow">DEMO REQUEST READY</p><h1>See you at Seoul Foods.</h1><p>Your pickup request has been staged for the demo. No order was sent and no payment was processed.</p><button className="button button-blue" onClick={() => { clearCart(); setSubmitted(false); }}>Start another bag</button></div></main>;

  return (
    <main className="pickup-page section">
      <div className="page-title"><p className="eyebrow">PICKUP BAG</p><h1>One quick stop.<br />All the good stuff.</h1><p>Choose your items and a convenient time. You&apos;ll pay in store when you arrive.</p></div>
      {items.length === 0 ? <div className="empty-bag"><span>🛍️</span><h2>Your pickup bag is empty.</h2><p>Take a lap through the shelves and add whatever catches your eye.</p><Link className="button button-red" href="/shop">Browse products →</Link></div> :
      <div className="pickup-layout">
        <section className="bag-list" aria-label="Pickup bag items">
          <div className="bag-heading"><h2>Your picks</h2><span>{items.reduce((sum, item) => sum + item.quantity, 0)} items</span></div>
          {items.map((item) => <article className="bag-item" key={item.slug}><div className={`bag-thumb accent-${item.accent}`}>{item.emoji}</div><div className="bag-name"><Link href={`/product/${item.slug}`}>{item.name}</Link><span>{item.origin} • {item.size}</span><button onClick={() => removeItem(item.slug)}>Remove</button></div><div className="quantity-control"><button onClick={() => updateQuantity(item.slug, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`}>−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.slug, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`}>+</button></div><strong>{formatPrice(item.price * item.quantity)}</strong></article>)}
        </section>
        <form className="pickup-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
          <div className="form-heading"><span>02</span><div><p className="eyebrow">WHEN SHOULD WE EXPECT YOU?</p><h2>Pick a time.</h2></div></div>
          <label>Pickup date<input required type="date" value={date} min={new Date().toISOString().split("T")[0]} onChange={(event) => setDate(event.target.value)} /></label>
          <fieldset><legend>Pickup time</legend><div className="time-grid">{times.map((slot) => <label className={time === slot ? "selected" : ""} key={slot}><input required type="radio" name="time" value={slot} checked={time === slot} onChange={() => setTime(slot)} />{slot}</label>)}</div></fieldset>
          <div className="contact-grid"><label>First name<input required placeholder="Your name" /></label><label>Phone<input required type="tel" placeholder="(507) 555-0123" /></label></div>
          <label>Pickup note <span>optional</span><textarea placeholder="Anything we should know?" rows={3} /></label>
          <div className="order-total"><span>Estimated subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
          <button className="button button-red submit-button" type="submit">Request pickup • Pay in store</button>
          <p className="form-disclaimer">Frontend demo only. This form does not send an order or collect payment.</p>
        </form>
      </div>}
    </main>
  );
}
