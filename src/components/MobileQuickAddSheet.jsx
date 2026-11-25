import { useEffect, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';

export default function MobileQuickAddSheet({ product, onClose }) {
  const { addItem, triggerFlyToBag } = useCart();

  const colors = product?.colors || [];
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || null);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'S');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) return;
    setSelectedColor(product.colors?.[0]?.name || null);
    setSelectedSize(product.sizes?.[0] || 'S');
    setQuantity(1);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const handleAdd = (e) => {
    addItem(product, selectedSize, quantity, selectedColor);
    triggerFlyToBag(e.currentTarget, product.image);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={`Select options for ${product.name}`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/35 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div className="relative z-10 w-full rounded-t-[20px] bg-white px-5 pt-3 pb-7 text-[#111111] shadow-xl animate-[fadeIn_220ms_ease-out]">
        {/* Drag Handle */}
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-black/15" aria-hidden="true" />

        {/* Product Header */}
        <div className="flex items-start justify-between gap-3 border-b border-black/[0.06] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-16 w-14 shrink-0 items-center justify-center rounded-[6px] bg-[#f4f2ef] p-1.5">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#111111]">
                {product.name}
              </h3>
              <p className="mt-0.5 text-sm text-[#444444] tabular-nums">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close quick add"
            className="flex h-8 w-8 items-center justify-center text-[#555555] hover:text-[#111111]"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* 2 Color Swatches */}
        {colors.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-[#666666]">
              Color:{' '}
              <span className="font-medium text-[#111111]">{selectedColor}</span>
            </p>
            <div className="mt-2.5 flex items-center gap-2.5">
              {colors.map((color) => {
                const isSelected = selectedColor === color.name;
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    aria-label={`Color ${color.name}`}
                    aria-pressed={isSelected}
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                      isSelected
                        ? 'ring-1 ring-[#111111] ring-offset-2'
                        : 'ring-1 ring-black/15'
                    }`}
                  >
                    <span
                      className="h-5.5 w-5.5 rounded-full"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Size Selector */}
        <div className="mt-5">
          <p className="text-xs text-[#666666]">Size</p>
          <div className="mt-2.5 flex items-center gap-2">
            {product.sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={isSelected}
                  className={`flex h-9 min-w-[46px] flex-1 items-center justify-center rounded-full text-xs font-medium tracking-[0.08em] transition-colors ${
                    isSelected
                      ? 'bg-[#111111] text-white'
                      : 'border border-black/15 bg-white text-[#111111]'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity Selector (+ / -) & Add to Bag */}
        <div className="mt-5 flex items-center gap-3">
          <div
            className="flex h-11 items-center rounded-full border border-black/15 px-1"
            aria-label="Quantity"
          >
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="flex h-9 w-9 items-center justify-center text-[#111111] disabled:opacity-30"
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
            <span className="w-6 text-center text-xs font-medium tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              className="flex h-9 w-9 items-center justify-center text-[#111111]"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex h-11 flex-1 items-center justify-center rounded-full bg-[#111111] text-[11px] font-medium tracking-[0.2em] text-white uppercase transition-colors active:scale-[0.99]"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}
