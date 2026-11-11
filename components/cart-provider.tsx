"use client";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '@/lib/product-types';

export type CartItem = Product & { quantity: number };
type Selection = { id: string; quantity: number };
type BagValue = { items: CartItem[]; count: number; subtotal: number; loading: boolean; error: string; addItem: (id: string) => void; removeItem: (id: string) => void; updateQuantity: (id: string, quantity: number) => void; clearCart: () => void };
const CartContext = createContext<BagValue | null>(null);
const storageKey = 'seoul-foods-grocery-bag-v2';

function readSelections(): Selection[] {
  if (typeof window === 'undefined') return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(value)) return [];
    return value.slice(0, 100).filter((p): p is Selection => p && typeof p.id === 'string' && Number.isInteger(p.quantity) && p.quantity > 0 && p.quantity <= 99).map(p => ({ id: p.id, quantity: p.quantity }));
  } catch { return []; }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [selections, setSelections] = useState<Selection[]>(readSelections);
  const [items, setItems] = useState<CartItem[]>([]);
  const [state, setState] = useState({ loading: true, error: '' });
  useEffect(() => {
    const controller = new AbortController();
    try { window.localStorage.setItem(storageKey, JSON.stringify(selections)); } catch { /* The bag still works when browser storage is unavailable. */ }
    fetch('/api/bag', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: selections }), signal: controller.signal })
      .then(async res => { if (!res.ok) throw new Error('Could not refresh your grocery bag.'); return res.json(); })
      .then(data => { setItems(data.items); setState({ loading: false, error: '' }); })
      .catch(err => { if (!controller.signal.aborted) setState({ loading: false, error: err instanceof Error ? err.message : 'Please reload to refresh your bag.' }); });
    return () => controller.abort();
  }, [selections]);

  const value = useMemo<BagValue>(() => ({
    items, count: items.reduce((sum, p) => sum + p.quantity, 0),
    subtotal: items.reduce((sum, p) => sum + p.priceCents * p.quantity, 0),
    loading: state.loading, error: state.error,
    addItem: id => { setState({ loading: true, error: '' }); setSelections(current => { const existing = current.find(p => p.id === id); return existing ? current.map(p => p.id === id ? { id, quantity: Math.min(99, p.quantity + 1) } : p) : [...current, { id, quantity: 1 }]; }); },
    removeItem: id => { setState({ loading: true, error: '' }); setSelections(current => current.filter(p => p.id !== id)); },
    updateQuantity: (id, quantity) => { if (!Number.isFinite(quantity)) return; setState({ loading: true, error: '' }); setSelections(current => quantity < 1 ? current.filter(p => p.id !== id) : current.map(p => p.id === id ? { id, quantity: Math.min(99, Math.floor(quantity)) } : p)); },
    clearCart: () => { setState({ loading: true, error: '' }); setSelections([]); },
  }), [items, state]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error('useCart must be used inside CartProvider'); return context; }
