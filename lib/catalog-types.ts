import type { Product } from './product-types';

export type Category = { id: string; name: string };

export type CatalogItem = Omit<Product, 'category' | 'categoryId' | 'categoryNames'> & {
  categoryIds: string[];
  cloverItemId: string | null;
};

export type Catalog = {
  revision: number;
  updatedAt: string | null;
  categories: Category[];
  items: CatalogItem[];
};

export const categoryHref = (id: string) => '/shop?' + new URLSearchParams({ category: id });
