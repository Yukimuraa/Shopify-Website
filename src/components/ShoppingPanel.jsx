import { ShoppingBag } from 'lucide-react';
import { formatPrice, getProductsForModel } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductRow from './ProductRow';

export default function ShoppingPanel({ activeModel }) {
  const { totalItems, totalPrice, openBag } = useCart();
  const products = getProductsForModel(activeModel.id);
  const lookTotal = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <aside
      aria-label="In this look shopping panel"
      className="hidden flex-col border-t border-black/[0.07] bg-[#f7f5f2] lg:sticky lg:top-16 lg:flex lg:h-[calc(100dvh-4rem)] lg:border-t-0 lg:border-l"
    >
      {/* Panel Header */}
      <div className="flex items-baseline justify-between border-b border-black/[0.06] px-6 py-5 sm:px-8">
        <div>
          <p className="text-[10px] font-medium tracking-[0.22em] text-[#777777] uppercase">
            In This Look
          </p>
          <h2 className="font-editorial mt-0.5 text-2xl font-normal tracking-[0.04em] text-[#111111]">
            {activeModel.label}
          </h2>
        </div>

        <span className="text-[10px] tracking-[0.2em] text-[#777777] uppercase tabular-nums">
          {products.length > 0 ? `${products.length} Pieces` : 'Preview'}
        </span>
      </div>

      {/* Product List with smooth key transition on model change */}
      <div className="flex-1 overflow-y-auto px-6 py-3 sm:px-8">
        {products.length > 0 ? (
          <div
            key={activeModel.id}
            className="animate-[fadeIn_280ms_ease-out]"
          >
            {products.map((product) => (
              <ProductRow
                key={`${activeModel.id}-${product.id}`}
                product={product}
                lookKey={activeModel.id}
              />
            ))}
          </div>
        ) : (
          <div
            key={activeModel.id}
            className="flex h-full min-h-[220px] flex-col items-start justify-center py-10 animate-[fadeIn_280ms_ease-out]"
          >
            <p className="text-[10px] tracking-[0.22em] text-[#888888] uppercase">
              {activeModel.label} — Archive
            </p>
            <p className="font-editorial mt-2 text-xl italic text-[#333333]">
              Products will be added later.
            </p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-[#777777]">
              Explore Looks 01–04 in the carousel to shop individual outerwear and denim pieces from the TEMPUS collection.
            </p>
          </div>
        )}
      </div>

      {/* Panel Footer: Look Total & Bag Summary */}
      <div className="border-t border-black/[0.07] px-6 py-4 sm:px-8">
        {products.length > 0 && (
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="tracking-[0.16em] text-[#666666] uppercase">
              Complete Look Total
            </span>
            <span className="font-medium text-[#111111] tabular-nums">
              {formatPrice(lookTotal)}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={openBag}
          className="flex h-10 w-full items-center justify-between border border-[#111111] px-4 text-[11px] font-medium tracking-[0.2em] text-[#111111] uppercase transition-colors duration-200 hover:bg-[#111111] hover:text-[#f7f5f2] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
        >
          <span className="flex items-center gap-2">
            <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.4} />
            <span>Shopping Bag ({totalItems})</span>
          </span>
          <span className="tabular-nums">{formatPrice(totalPrice)}</span>
        </button>
      </div>
    </aside>
  );
}
