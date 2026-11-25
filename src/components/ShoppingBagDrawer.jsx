import { useEffect, useState } from 'react';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ShoppingBagDrawer() {
  const {
    items,
    isBagOpen,
    closeBag,
    updateQuantity,
    removeItem,
    totalItems,
    totalPrice,
  } = useCart();

  const [checkoutNotice, setCheckoutNotice] = useState(false);

  useEffect(() => {
    if (!isBagOpen) {
      setCheckoutNotice(false);
      return;
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeBag();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isBagOpen, closeBag]);

  if (!isBagOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 backdrop-blur-[1px] transition-opacity"
        onClick={closeBag}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#f7f5f2] text-[#111111]">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-black/[0.07] px-6">
          <div className="flex items-baseline gap-2.5">
            <h2 className="text-xs font-medium tracking-[0.24em] uppercase">
              Shopping Bag
            </h2>
            <span className="text-[11px] text-[#777777] tabular-nums">
              ({totalItems})
            </span>
          </div>
          <button
            type="button"
            onClick={closeBag}
            aria-label="Close shopping bag"
            className="flex h-8 w-8 items-center justify-center text-[#111111] transition-opacity hover:opacity-60 focus-visible:outline-1 focus-visible:outline-[#111111]"
          >
            <X className="h-4 w-4" strokeWidth={1.4} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-editorial text-xl italic text-[#444444]">
                Your shopping bag is empty.
              </p>
              <p className="mt-2 text-xs text-[#777777]">
                Select a size on any piece from Looks 01–04 to add it to your bag.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-black/[0.06]">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-5 first:pt-2">
                  {/* Thumbnail */}
                  <div className="flex h-24 w-20 shrink-0 items-center justify-center bg-[#efede9]/80 p-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Info & Controls */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-medium text-[#111111]">
                          {item.name}
                        </h3>
                        <p className="mt-0.5 text-[11px] tracking-[0.14em] text-[#666666] uppercase">
                          Size {item.size}
                          {item.color ? ` · ${item.color}` : ''}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        aria-label={`Remove ${item.name} size ${item.size}`}
                        className="text-[#888888] transition-colors hover:text-[#111111]"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.4} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex h-7 items-center border border-black/12">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, -1)}
                          aria-label="Decrease quantity"
                          className="flex h-full w-7 items-center justify-center text-[#111111] hover:opacity-60"
                        >
                          <Minus className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                        <span className="w-6 text-center text-xs tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, 1)}
                          aria-label="Increase quantity"
                          className="flex h-full w-7 items-center justify-center text-[#111111] hover:opacity-60"
                        >
                          <Plus className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                      </div>

                      {/* Item Subtotal */}
                      <span className="text-sm text-[#111111] tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-black/[0.07] px-6 py-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs tracking-[0.18em] text-[#555555] uppercase">
              Total
            </span>
            <span className="text-base font-medium text-[#111111] tabular-nums">
              {formatPrice(totalPrice)}
            </span>
          </div>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => setCheckoutNotice(true)}
            className="h-11 w-full bg-[#111111] text-[11px] font-medium tracking-[0.22em] text-[#f7f5f2] uppercase transition-colors duration-200 hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-35"
          >
            Checkout
          </button>

          {checkoutNotice && (
            <p className="mt-3 text-center text-[11px] leading-relaxed text-[#666666]">
              Frontend lookbook preview — checkout is not connected to a payment processor.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
