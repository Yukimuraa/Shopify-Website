import { useEffect, useRef, useState } from 'react';
import { STREETWEAR_MODELS } from '../data/streetwear';

export default function StreetwearSection({ selectedModelId, onSelectModel }) {
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
        threshold: 0.14,
        rootMargin: '0px 0px -70px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasRevealed]);

  return (
    <section
      id="streetwear-showcase"
      aria-labelledby="streetwear-showcase-heading"
      className="w-full border-t border-black/[0.06] bg-[#f7f5f2] py-16 sm:py-22 lg:py-28"
    >
      <div className="mx-auto max-w-[1680px] px-5 sm:px-10 lg:px-14">
        {/* Section Header */}
        <div
          className={`mb-12 flex flex-col gap-2 transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:mb-16 sm:flex-row sm:items-end sm:justify-between ${
            hasRevealed ? 'translate-y-0 opacity-100' : 'translate-y-[28px] opacity-0'
          }`}
        >
          <div>
            <p className="text-[10px] font-medium tracking-[0.26em] text-[#777777] uppercase">
              Streetwear Editorial
            </p>
            <h2
              id="streetwear-showcase-heading"
              className="font-editorial mt-1 text-3xl font-normal tracking-[0.03em] text-[#111111] sm:text-4xl"
            >
              The New Silhouettes
            </h2>
          </div>

          <p className="text-[11px] tracking-[0.18em] text-[#666666] uppercase">
            Models 09 — 12
          </p>
        </div>

        {/* 4-Model Showcase: 2 cols mobile/tablet, 4 cols desktop — frameless transparent cutouts */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 items-end gap-x-4 gap-y-12 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-8 xl:gap-x-10"
        >
          {STREETWEAR_MODELS.map((model, index) => {
            const isSelected = selectedModelId === model.id;
            return (
              <figure
                key={model.id}
                style={{
                  transitionDelay: hasRevealed ? `${index * 180}ms` : '0ms',
                }}
                className={`flex flex-col items-center transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
                  hasRevealed
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-[32px] opacity-0'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectModel?.(model)}
                  aria-label={`Explore ${model.label}`}
                  className="group flex w-full cursor-pointer flex-col items-center border-0 bg-transparent p-0 outline-none focus-visible:opacity-75"
                >
                  <div className="flex h-[38dvh] min-h-[260px] max-h-[580px] w-full items-end justify-center sm:h-[48dvh] lg:h-[58dvh]">
                    <img
                      src={model.image}
                      alt={model.alt}
                      loading="lazy"
                      draggable={false}
                      className="h-full w-auto max-w-full object-contain object-bottom transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>

                  <figcaption
                    className={`mt-4 text-center text-[10px] tracking-[0.24em] uppercase transition-colors duration-200 ${
                      isSelected
                        ? 'font-semibold text-[#111111] underline underline-offset-4'
                        : 'font-medium text-[#555555] group-hover:text-[#111111]'
                    }`}
                  >
                    {model.label}
                  </figcaption>
                </button>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
