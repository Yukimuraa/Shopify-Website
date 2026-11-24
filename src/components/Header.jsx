import { Search, User, ShoppingBag } from 'lucide-react';
import { COLLECTION_META } from '../data/models';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { totalItems, openBag, bagIconRef, bagPulseKey } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.06] bg-[#f7f5f2]/95 backdrop-blur-xs">
      <div className="mx-auto flex h-14 max-w-[1680px] items-center justify-between px-5 sm:h-16 sm:px-10 lg:px-14">
        {/* Left: Brand Logo */}
        <a
          href="#top"
          className="font-editorial text-lg font-medium tracking-[0.22em] text-[#111111] transition-opacity duration-200 hover:opacity-70 sm:text-xl"
        >
          {COLLECTION_META.brand}
        </a>

        {/* Center: Collection Name */}
        <span className="text-[10px] font-medium tracking-[0.22em] text-[#111111]/80 uppercase sm:text-[11px] sm:tracking-[0.26em]">
          {COLLECTION_META.collection}
        </span>

        {/* Right: Utility Icons */}
        <nav aria-label="Utility navigation" className="flex items-center gap-4 sm:gap-5">
          <button
            type="button"
            aria-label="Search"
            className="text-[#111111] transition-opacity duration-200 hover:opacity-55 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
          >
            <Search className="h-[17px] w-[17px]" strokeWidth={1.35} />
          </button>
          <button
            type="button"
            aria-label="Account"
            className="text-[#111111] transition-opacity duration-200 hover:opacity-55 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
          >
            <User className="h-[17px] w-[17px]" strokeWidth={1.35} />
          </button>
          <button
            ref={bagIconRef}
            key={bagPulseKey > 0 ? `bag-${bagPulseKey}` : 'bag-init'}
            type="button"
            onClick={openBag}
            aria-label={`Shopping bag (${totalItems} items)`}
            className={`relative flex items-center gap-1.5 text-[#111111] transition-opacity duration-200 hover:opacity-60 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#111111] ${
              bagPulseKey > 0 ? 'animate-bag-bounce' : ''
            }`}
          >
            <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.35} />
            {totalItems > 0 && (
              <span
                key={`badge-${bagPulseKey}-${totalItems}`}
                className={`flex h-4 min-w-4 items-center justify-center rounded-full bg-[#111111] px-1 text-[9px] font-medium text-[#f7f5f2] tabular-nums ${
                  bagPulseKey > 0 ? 'animate-badge-pop' : ''
                }`}
              >
                {totalItems}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
