import type { Metadata } from 'next';
import sources from '@/lib/product-image-sources.json';

export const metadata: Metadata = { title: 'Product photo credits' };
export default function CreditsPage() {
  return (
    <main className="section credits-page">
      <p className="eyebrow">PRODUCT PHOTOGRAPHY</p>
      <h1>Photo credits</h1>
      <p>Package photos come from Open Food Facts contributors and product listings. Photos with unverified reuse terms are included for preview review. Packaging may change.</p>
      <ul>
        {sources.map(source => (
          <li key={source.id}>
            <strong>{source.inventoryName}</strong><br />
            <a href={source.sourceUrl} target="_blank" rel="noreferrer">Product source</a> · <a href={source.imageUrl} target="_blank" rel="noreferrer">Source photograph</a><br />
            <span>{source.contributor} · {source.licenseUrl ? <a href={source.licenseUrl}>{source.license}</a> : source.license}</span><br />
            <span>{source.alterations}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
