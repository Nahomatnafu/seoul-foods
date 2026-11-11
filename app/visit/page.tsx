import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Visit", description: "Find Seoul Foods in North Mankato, Minnesota. See hours, directions, and store information." };

export default function VisitPage() {
  return (
    <main className="visit-page">
      <section className="page-hero visit-hero"><div><p className="eyebrow light">COME SAY HI</p><h1>Your new favorite<br />grocery run.</h1><p>Right in lower North Mankato. Come browse, ask questions and leave with something you&apos;ve never tried.</p></div><div className="visit-seoul">서울<span>FOODS</span></div></section>
      <section className="section visit-grid">
        <div className="visit-card address-card"><span className="card-number">01</span><p className="eyebrow">FIND US</p><h2>410 Belgrade Ave<br />North Mankato, MN</h2><p>Your local stop for Asian groceries, snacks, and drinks.</p><a className="button button-blue" href="https://maps.google.com/?q=410+Belgrade+Ave+North+Mankato+MN+56003" target="_blank" rel="noreferrer">Open in Maps ↗</a></div>
        <div className="visit-card hours-card"><span className="card-number">02</span><p className="eyebrow">PLAN YOUR VISIT</p><h2>Come browse<br />the aisles.</h2><p>Call to confirm today&apos;s opening hours and availability before making a special trip.</p><a className="text-link" href="tel:+15077205306">(507) 720-5306</a></div>
        <div className="visit-card contact-card"><span className="card-number">03</span><p className="eyebrow">QUESTIONS?</p><h2>Looking for something specific?</h2><p>Call or email the store and ask. Product requests from the community help shape what lands on the shelves.</p><div className="contact-links"><a className="phone-link" href="tel:+15077205306">(507) 720-5306</a><a href="mailto:mankatoseoulfoods@gmail.com">mankatoseoulfoods@gmail.com</a><a href="https://www.instagram.com/katoseoulfoods" target="_blank" rel="noreferrer">Instagram: @katoseoulfoods ↗</a></div></div>
      </section>
      <section className="section story-section"><div><p className="eyebrow">YOUR NEIGHBORHOOD ASIAN CONVENIENCE STORE</p><h2>A snack stop.<br />A pantry restock.</h2></div><div><p>Browse packaged snacks, drinks, instant noodles, frozen groceries, and pantry staples for home cooking.</p><p>Explore 100 products from the store&apos;s inventory in this draft, then stop by to see what&apos;s on the shelves today.</p><Link className="text-link" href="/shop">Browse groceries →</Link></div></section>
    </main>
  );
}
