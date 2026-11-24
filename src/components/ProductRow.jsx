import { useEffect, useRef, useState } from 'react';
import { Minus, Plus, Check } from 'lucide-react';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductRow({ product, lookKey }) {
  const { addItem, triggerFlyToBag } = useCart();
  const imgRef = useRef(null);

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Reset local selection state cleanly when switching looks
  useEffect(() => {
    setSelectedSize(null);
    setQuantity(1);
    setSizeError(false);
    setJustAdded(false);
  }, [lookKey, product.id]);

  const handleAddToBag = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addItem(product, selectedSize, quantity);
    triggerFlyToBag(imgRef.current, product.image);
    setSizeError(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div className="border-b border-black/[0.06] py-5 first:pt-2 last:border-b-0">
      <div className="flex gap-4">
        {/* Product Image (transparent PNG with object-contain) */}
        <div className="flex h-28 w-22 shrink-0 items-center justify-center bg-[#efede9]/70 p-2 sm:h-32 sm:w-24">
          <img
            ref={imgRef}
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
            loading="eager"
          />
        </div>

        {/* Product Details & Controls */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.18em] text-[#777777] uppercase">
                {product.category}
              </p>
              <h3 className="mt-0.5 text-sm font-medium tracking-[0.02em] text-[#111111]">
                {product.name}
              </h3>
            </div>
            <span className="text-sm font-normal text-[#111111] tabular-nums">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Size Selector */}
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.16em] text-[#666666] uppercase">
                Size
              </span>
              {sizeError && (
                <span role="alert" className="text-[10px] tracking-[0.06em] text-[#9b2c2c]">
                  Please select a size
                </span>
              )}
            </div>

            <div className="mt-1.5 grid grid-cols-4 gap-1.5">
              {product.sizes.map((size) => {
                const isActive = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                    aria-pressed={isActive}
                    className={`h-7 text-[11px] tracking-[0.12em] transition-colors duration-150 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#111111] ${
                      isActive
                        ? 'border border-[#111111] bg-[#111111] text-[#f7f5f2]'
                        : 'border border-black/12 bg-transparent text-[#111111] hover:border-black/40'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Add to Bag */}
          <div className="mt-3 flex items-center gap-2">
            <div
              className="flex h-9 items-center border border-black/12"
              aria-label={`Quantity for ${product.name}`}
            >
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="flex h-full w-8 items-center justify-center text-[#111111] transition-opacity hover:opacity-60 disabled:opacity-30"
              >
                <Minus className="h-3 w-3" strokeWidth={1.5} />
              </button>
              <span className="w-6 text-center text-xs text-[#111111] tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="flex h-full w-8 items-center justify-center text-[#111111] transition-opacity hover:opacity-60"
              >
                <Plus className="h-3 w-3" strokeWidth={1.5} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToBag}
              className={`flex h-9 flex-1 items-center justify-center gap-1.5 text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-200 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#111111] ${
                justAdded
                  ? 'bg-[#2c2c2c] text-[#f7f5f2]'
                  : 'bg-[#111111] text-[#f7f5f2] hover:bg-[#2a2a2a]'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="h-3.5 w-3.5" strokeWidth={1.75} />
                  <span>Added</span>
                </>
              ) : (
                <span>Add to Bag</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
