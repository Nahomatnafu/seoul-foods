import type { Metadata } from 'next';
import sources from '@/lib/product-image-sources.json';

export const metadata: Metadata = { title: 'Product photo credits' };
export default function CreditsPage() {
  return <main className="section credits-page"><p className="eyebrow">PRODUCT PHOTOGRAPHY</p><h1>Photo credits</h1><p>Package photographs are provided by Open Food Facts contributors under <a className="text-link" href="https://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-ShareAlike 3.0</a>. Images are displayed proportionally; the downloaded files have not been altered. Packaging may change.</p><p>Store product names and prices come from the Seoul Foods inventory export. Open Food Facts is used for photographs and photo attribution, not store pricing or availability.</p><ul>{sources.map(source => <li key={source.id}><strong>{source.inventoryName}</strong><br /><a href={source.sourceUrl} target="_blank" rel="noreferrer">Open Food Facts product record</a> · <a href={source.imageUrl} target="_blank" rel="noreferrer">Source photograph</a><br /><span>Photo: {source.contributor} · {source.license}</span></li>)}</ul></main>;
}
