"use client";

import { useState } from "react";
import type { Product } from "@/lib/product-types";
import { useCart } from "./cart-provider";

export function AddButton({ product, className = "add-button", label = "Add" }: { product: Product; className?: string; label?: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return <button className={className} onClick={() => { addItem(product.id); setAdded(true); window.setTimeout(() => setAdded(false), 1200); }} aria-label={`Add ${product.name} to demo bag`}>
    {added ? "Added ✓" : label}
  </button>;
}
