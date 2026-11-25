import { useState } from 'react';
import { Plus } from 'lucide-react';
import { formatPrice, getProductsForModel } from '../data/products';
import MobileQuickAddSheet from './MobileQuickAddSheet';

export default function MobileLookStrip({ activeModel }) {
  const [quickAddProduct, setQuickAddProduct] = useState(null);
  const products = getProductsForModel(activeModel.id);

  return (
    <section
      aria-label="Mobile look products"
      className="w-full px-5 pb-6 pt-2 lg:hidden"
    >
      {/* Header Row: Look Label + Piece Count */}
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-normal tracking-[0.02em] text-[#111111]">
          {activeModel.label}
        </h2>
        <span className="text-[10px] font-medium tracking-[0.18em] text-[#666666] uppercase tabular-nums">
          {products.length} {products.length === 1 ? 'Piece' : 'Pieces'}
        </span>
      </div>

      {/* Horizontal Scrollable Product Cards */}
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {products.map((product, idx) => (
          <div
            key={`${activeModel.id}-${product.id}`}
            className="flex w-[80vw] max-w-[320px] shrink-0 items-center justify-between gap-3 rounded-[10px] border border-black/[0.06] bg-white p-2.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              {/* Thumbnail with numbered pin */}
              <div className="relative flex h-16 w-14 shrink-0 items-center justify-center rounded-[6px] bg-[#f4f2ef] p-1.5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-black/10 bg-white text-[9px] font-medium text-[#111111] tabular-nums">
                  {idx + 1}
                </span>
              </div>

              {/* Name & Price */}
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-[#111111]">
                  {product.name}
                </p>
                <p className="mt-0.5 text-xs text-[#666666] tabular-nums">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>

            {/* + Quick Add Button */}
            <button
              type="button"
              onClick={() => setQuickAddProduct(product)}
              aria-label={`Select options for ${product.name}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#111111] transition-colors hover:bg-black/5 active:scale-95"
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Sheet Modal */}
      <MobileQuickAddSheet
        product={quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
      />
    </section>
  );
}
