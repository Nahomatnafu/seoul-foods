"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "./cart-provider";

export function AddButton({ product, className = "add-button", label = "Add" }: { product: Product; className?: string; label?: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return <button className={className} onClick={() => { addItem(product); setAdded(true); window.setTimeout(() => setAdded(false), 1200); }} aria-label={`Add ${product.name} to pickup bag`}>
    {added ? "Added ✓" : label}
  </button>;
}
