import Image from 'next/image';
import type { Product } from '@/lib/product-types';

export function ProductVisual({ product, compact = false }: { product: Product; compact?: boolean }) {
  if (product.image) return <Image className="inventory-photo" src={product.image} alt={product.name} fill sizes={compact ? '76px' : '(max-width: 720px) 50vw, 25vw'} />;
  return <div className={`photo-pending ${compact ? 'compact' : ''}`} aria-label={`Product photo pending for ${product.name}`}>
    <span className="shelf-kicker">SEOUL FOODS</span><strong>{compact ? product.category : product.name}</strong><span className="shelf-code">{product.barcode}</span>{!compact && <span className="photo-status">Product photo coming soon</span>}
  </div>;
}
