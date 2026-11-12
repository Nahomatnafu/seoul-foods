import { readCatalogPhoto } from '@/lib/catalog-store';

export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const photo = await readCatalogPhoto(filename);
  if (!photo) return new Response(null, { status: 404 });
  return new Response(photo, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
