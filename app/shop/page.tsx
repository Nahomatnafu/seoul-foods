import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopCatalog } from "./shop-catalog";

export const metadata: Metadata = { title: "Shop", description: "Browse sample Asian snacks, drinks, noodles, frozen foods, and pantry staples at Seoul Foods." };

export default function ShopPage() {
  return <Suspense fallback={<main className="page-loading">Loading the shelves…</main>}><ShopCatalog /></Suspense>;
}
