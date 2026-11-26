import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { EDITORIAL_COLLECTIONS } from '../data/collections';

function getCoverflowLayout(width) {
  if (width < 640) {
    return { cardWidth: 270, spacing: 220 };
  }
  if (width < 1024) {
    return { cardWidth: 380, spacing: 330 };
  }
  if (width < 1280) {
    return { cardWidth: 440, spacing: 395 };
  }
  return { cardWidth: 500, spacing: 455 };
}

export default function EditorialSection({ onSelectCollection }) {
  const total = EDITORIAL_COLLECTIONS.length;
  const initialIndex = 1; // Start centered on Collection 02 so neighbors appear on both sides

  const sectionRef = useRef(null);
  const targetRef = useRef(initialIndex);
  const currentRef = useRef(initialIndex);
  const wheelLockRef = useRef(0);
  const dragRef = useRef({
    isDown: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    startTarget: initialIndex,
    velocity: 0,
    hasMoved: false,
  });

  const [hasRevealed, setHasRevealed] = useState(false);
  const [renderPos, setRenderPos] = useState(initialIndex);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [layout, setLayout] = useState(() =>
    typeof window !== 'undefined'
      ? getCoverflowLayout(window.innerWidth)
      : { cardWidth: 500, spacing: 455 }
  );

  // Smooth once-only scroll-down reveal for Editorial Campaign — Four Chapters
  useEffect(() => {
    if (hasRevealed) return;
    const el = sectionRef.current;
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
        rootMargin: '0px 0px -80px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasRevealed]);

  useEffect(() => {
    const onResize = () => setLayout(getCoverflowLayout(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const goTo = useCallback(
    (index) => {
      const clamped = Math.max(0, Math.min(index, total - 1));
      targetRef.current = clamped;
      setActiveIndex(clamped);
    },
    [total]
  );

  // Smooth 60/120fps interpolation loop
  useEffect(() => {
    let rafId = null;
    let lastTime = performance.now();

    const tick = (now) => {
      const dt = Math.min(32, now - lastTime);
      lastTime = now;

      const diff = targetRef.current - currentRef.current;
      if (Math.abs(diff) > 0.0008) {
        const factor = dragRef.current.isDown
          ? 0.36
          : Math.min(1, (dt / 16.67) * 0.13);
        currentRef.current += diff * factor;
        setRenderPos(currentRef.current);
      } else if (currentRef.current !== targetRef.current) {
        currentRef.current = targetRef.current;
        setRenderPos(currentRef.current);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Pointer drag (mouse + touch) with momentum release
  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    dragRef.current = {
      isDown: true,
      startX: e.clientX,
      lastX: e.clientX,
      lastTime: performance.now(),
      startTarget: currentRef.current,
      velocity: 0,
      hasMoved: false,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.isDown) return;

    const now = performance.now();
    const dt = Math.max(1, now - dragRef.current.lastTime);
    const dxFromLast = e.clientX - dragRef.current.lastX;
    const dxTotal = e.clientX - dragRef.current.startX;

    if (Math.abs(dxTotal) > 6) {
      dragRef.current.hasMoved = true;
    }

    dragRef.current.velocity = -dxFromLast / dt;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastTime = now;

    const nextTarget = dragRef.current.startTarget - dxTotal / layout.spacing;
    const clamped = Math.max(-0.25, Math.min(total - 0.75, nextTarget));
    targetRef.current = clamped;
    setActiveIndex(Math.max(0, Math.min(total - 1, Math.round(clamped))));
  };

  const handlePointerUp = () => {
    if (!dragRef.current.isDown) return;
    dragRef.current.isDown = false;
    setIsDragging(false);

    const projected = targetRef.current + dragRef.current.velocity * 1.4;
    const snapped = Math.max(0, Math.min(total - 1, Math.round(projected)));
    goTo(snapped);
  };

  // Trackpad horizontal scroll
  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 8) {
      return;
    }
    const now = performance.now();
    if (now - wheelLockRef.current < 260) return;
    wheelLockRef.current = now;

    goTo(activeIndex + (e.deltaX > 0 ? 1 : -1));
  };

  const handleCardClick = (idx, collection) => {
    if (dragRef.current.hasMoved) {
      dragRef.current.hasMoved = false;
      return;
    }
    if (idx !== activeIndex) {
      goTo(idx);
    } else {
      onSelectCollection(collection);
    }
  };

  const activeCollection = EDITORIAL_COLLECTIONS[activeIndex] || EDITORIAL_COLLECTIONS[0];
  const stageHeight = Math.round(layout.cardWidth * 1.25 * 1.1);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="editorial-campaigns-heading"
      className="w-full overflow-hidden border-t border-black/[0.06] bg-[#f7f5f2] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1680px] px-5 sm:px-10 lg:px-14">
        {/* Section Header */}
        <div
          className={`mb-10 flex flex-col gap-2 transition-[opacity,transform] delay-[160ms] duration-[1150ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:delay-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:mb-12 sm:flex-row sm:items-end sm:justify-between ${
            hasRevealed ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
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
      </div>

      {/* Coverflow Stage */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onWheel={handleWheel}
        style={{ height: `${stageHeight}px` }}
        className={`relative mx-auto w-full max-w-[1680px] touch-pan-y select-none transition-[opacity,transform] delay-[320ms] duration-[1250ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:delay-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${hasRevealed ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        {EDITORIAL_COLLECTIONS.map((collection, idx) => {
          const offset = idx - renderPos;
          const absOffset = Math.abs(offset);
          const isCenter = idx === activeIndex && absOffset < 0.35;

          // Smooth continuous S-curve: center = 1.08 (dominant), neighbors = 0.64, outer = 0.46 (sharp, no blur)
          const t = Math.min(1, absOffset);
          const smoothT = (1 - Math.cos(t * Math.PI)) / 2;
          const scale =
            absOffset <= 1
              ? 1.08 - smoothT * 0.44
              : Math.max(0.46, 0.64 - (absOffset - 1) * 0.18);
          const translateX = offset * layout.spacing;
          const opacity = Math.max(0.45, 1 - absOffset * 0.22);
          const zIndex = Math.round(40 - absOffset * 10);

          return (
            <div
              key={collection.id}
              style={{
                width: `${layout.cardWidth}px`,
                zIndex,
                opacity,
                transform: `translate3d(calc(-50% + ${translateX}px), -50%, 0) scale(${scale})`,
              }}
              className="absolute top-1/2 left-1/2 will-change-transform"
            >
              <button
                type="button"
                onClick={() => handleCardClick(idx, collection)}
                aria-label={
                  isCenter
                    ? `${collection.number} — ${collection.title}. Discover the look`
                    : `Focus ${collection.number} — ${collection.title}`
                }
                className="group relative block aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-[6px] border-0 bg-[#efede9] p-0 outline-none focus-visible:ring-1 focus-visible:ring-[#111111]"
              >
                <img
                  src={collection.image}
                  alt={collection.alt}
                  draggable={false}
                  loading="eager"
                  className="h-full w-full object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Active Collection Information & Navigation Controls */}
      <div
        className={`mx-auto mt-8 flex max-w-[1680px] flex-col items-center px-5 text-center transition-[opacity,transform] delay-[460ms] duration-[1150ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:delay-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:mt-10 sm:px-10 lg:px-14 ${
          hasRevealed ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div
          key={activeCollection.id}
          className="flex flex-col items-center animate-[fadeIn_320ms_ease-out]"
        >
          <span className="text-[10px] font-medium tracking-[0.26em] text-[#777777] uppercase">
            {activeCollection.number}
          </span>
          <h3 className="font-editorial mt-1 text-2xl font-normal tracking-[0.05em] text-[#111111] sm:text-3xl">
            {activeCollection.title}
          </h3>
          <button
            type="button"
            onClick={() => onSelectCollection(activeCollection)}
            className="group mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-medium tracking-[0.22em] text-[#111111] uppercase transition-opacity duration-200 hover:opacity-65"
          >
            <span>{activeCollection.cta}</span>
            <ArrowUpRight
              className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Left / Right Navigation Arrows & Slide Counter */}
        <div className="mt-6 flex items-center gap-6">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous collection"
            className="flex h-9 w-9 items-center justify-center border border-black/12 text-[#111111] transition-colors duration-200 hover:border-[#111111] disabled:cursor-not-allowed disabled:opacity-25"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.35} />
          </button>

          <span className="text-[11px] font-medium tracking-[0.22em] text-[#111111] tabular-nums">
            {String(activeIndex + 1).padStart(2, '0')}{' '}
            <span className="text-[#999999]">/</span>{' '}
            {String(total).padStart(2, '0')}
          </span>

          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === total - 1}
            aria-label="Next collection"
            className="flex h-9 w-9 items-center justify-center border border-black/12 text-[#111111] transition-colors duration-200 hover:border-[#111111] disabled:cursor-not-allowed disabled:opacity-25"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={1.35} />
          </button>
        </div>
      </div>
    </section>
  );
}
