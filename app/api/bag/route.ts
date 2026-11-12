import { getStorefront, snapshotDate } from '@/lib/products';

export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > 20000) return Response.json({ error: 'Bag too large.' }, { status: 413 });
  let body: unknown;
  try { body = JSON.parse(text); } catch { return Response.json({ error: 'Invalid bag.' }, { status: 400 }); }
  if (!body || typeof body !== 'object' || !('items' in body) || !Array.isArray(body.items) || body.items.length > 100) return Response.json({ error: 'Invalid bag.' }, { status: 400 });
  const quantities = new Map<string, number>();
  for (const row of body.items) {
    if (!row || typeof row.id !== 'string' || !Number.isSafeInteger(row.quantity) || row.quantity < 1 || row.quantity > 99) return Response.json({ error: 'Invalid item quantity.' }, { status: 400 });
    quantities.set(row.id, Math.min(99, (quantities.get(row.id) || 0) + row.quantity));
  }
  const { catalog, products } = await getStorefront();
  // Resolve names and cents on the server. Client-supplied prices are ignored.
  const items = products.filter(p => quantities.has(p.id)).map(p => ({ ...p, quantity: quantities.get(p.id)! }));
  return Response.json({ items, subtotalCents: items.reduce((sum, p) => sum + p.priceCents * p.quantity, 0), snapshotDate: catalog.updatedAt?.slice(0, 10) ?? snapshotDate, demoOnly: true }, { headers: { 'Cache-Control': 'no-store' } });
}
