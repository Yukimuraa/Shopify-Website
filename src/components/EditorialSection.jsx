import { useEffect, useRef, useState } from 'react';
import { EDITORIAL_COLLECTIONS } from '../data/collections';
import EditorialCard from './EditorialCard';

export default function EditorialSection({ onSelectCollection }) {
  const gridRef = useRef(null);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    if (hasRevealed) return;
    const el = gridRef.current;
    if (!el) return;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setHasRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasRevealed(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasRevealed]);

  return (
    <section
      aria-labelledby="editorial-campaigns-heading"
      className="w-full bg-[#f7f5f2]"
    >
      <div className="mx-auto max-w-[1680px] px-5 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
        {/* Section Header */}
        <div
          className={`mb-10 flex flex-col gap-2 transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:mb-12 sm:flex-row sm:items-end sm:justify-between ${
            hasRevealed ? 'translate-y-0 opacity-100' : 'translate-y-[35px] opacity-0'
          }`}
        >
          <div>
            <p className="text-[10px] font-medium tracking-[0.26em] text-[#777777] uppercase">
              Editorial Campaign
            </p>
            <h2
              id="editorial-campaigns-heading"
              className="font-editorial mt-1 text-3xl font-normal tracking-[0.03em] text-[#111111] sm:text-4xl"
            >
              Four Chapters
            </h2>
          </div>

          <p className="text-[11px] tracking-[0.18em] text-[#666666] uppercase">
            Timeless By Design
          </p>
        </div>

        {/* Four-Card Grid: 1 col mobile, 2 cols tablet, 4 slimmer equal cols desktop */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 xl:gap-x-7"
        >
          {EDITORIAL_COLLECTIONS.map((collection, index) => (
            <EditorialCard
              key={collection.id}
              collection={collection}
              index={index}
              isVisible={hasRevealed}
              onSelect={onSelectCollection}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
