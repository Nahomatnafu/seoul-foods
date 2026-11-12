export type Product = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  category: string;
  categoryId: string;
  categoryNames: string[];
  barcode: string;
  image: string | null;
  imageCaption?: string;
};
export const formatPrice = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
