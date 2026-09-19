import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Visit", description: "Find Seoul Foods in North Mankato, Minnesota. See hours, directions, and store information." };

const hours = [
  ["Monday", "10 AM – 9 PM"], ["Tuesday", "10 AM – 9 PM"], ["Wednesday", "10 AM – 9 PM"],
  ["Thursday", "10 AM – 9 PM"], ["Friday", "10 AM – 9 PM"], ["Saturday", "10 AM – 9 PM"], ["Sunday", "1 PM – 9 PM"],
];

export default function VisitPage() {
  return (
    <main className="visit-page">
      <section className="page-hero visit-hero"><div><p className="eyebrow light">COME SAY HI</p><h1>Your new favorite<br />grocery run.</h1><p>Right in lower North Mankato. Come browse, ask questions and leave with something you&apos;ve never tried.</p></div><div className="visit-seoul">서울<span>FOODS</span></div></section>
      <section className="section visit-grid">
        <div className="visit-card address-card"><span className="card-number">01</span><p className="eyebrow">FIND US</p><h2>410 Belgrade Ave<br />North Mankato, MN</h2><p>Next to Hunan Garden, with easy parking right outside.</p><a className="button button-blue" href="https://maps.google.com/?q=410+Belgrade+Ave+North+Mankato+MN+56003" target="_blank" rel="noreferrer">Open in Maps ↗</a></div>
        <div className="visit-card hours-card"><span className="card-number">02</span><p className="eyebrow">STORE HOURS</p><div className="hours-list">{hours.map(([day, time]) => <div key={day}><span>{day}</span><strong>{time}</strong></div>)}</div></div>
        <div className="visit-card contact-card"><span className="card-number">03</span><p className="eyebrow">QUESTIONS?</p><h2>Looking for something specific?</h2><p>Call or email the store and ask. Product requests from the community help shape what lands on the shelves.</p><div className="contact-links"><a className="phone-link" href="tel:+15077205306">(507) 720-5306</a><a href="mailto:mankatoseoulfoods@gmail.com">mankatoseoulfoods@gmail.com</a><a href="https://www.instagram.com/katoseoulfoods" target="_blank" rel="noreferrer">Instagram: @katoseoulfoods ↗</a></div></div>
      </section>
      <section className="section story-section"><div><p className="eyebrow">WHY SEOUL FOODS</p><h2>Closer than the Cities.<br />More personal than a big box.</h2></div><div><p>Seoul Foods started with a simple problem: finding the groceries you grew up with shouldn&apos;t require an all-day drive. Today the shelves reach across Korea and a growing mix of Asian communities, guided by what local shoppers actually ask for.</p><p>This is a grocery store—not a restaurant. Come for ingredients, freezer staples, late-night noodles, nostalgic snacks and the fun of discovering something new.</p><Link className="text-link" href="/shop">See what&apos;s on the demo shelves →</Link></div></section>
    </main>
  );
}
