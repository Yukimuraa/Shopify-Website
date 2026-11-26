import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { COLLECTION_META } from '../data/models';

export default function LandingHero({ isExiting, onExplore }) {
  const [stage, setStage] = useState(0);
  const touchStartYRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setStage(4);
      return;
    }

    const timers = [
      setTimeout(() => setStage(1), 120),  // 1. TEMPUS logo
      setTimeout(() => setStage(2), 480),  // 2. TIMELESS BY DESIGN.
      setTimeout(() => setStage(3), 850),  // 3. Campaign cutout (opacity + scale 1.04 -> 1)
      setTimeout(() => setStage(4), 1500), // 4. Supporting text + CTA button
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // Allow keyboard ArrowDown / PageDown to smoothly enter the collection
  useEffect(() => {
    const onKeyDown = (e) => {
      if (isExiting) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        onExplore();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isExiting, onExplore]);

  const handleWheel = (e) => {
    if (isExiting) return;
    if (e.deltaY > 18) {
      onExplore();
    }
  };

  const handleTouchStart = (e) => {
    touchStartYRef.current = e.touches[0]?.clientY ?? null;
  };

  const handleTouchMove = (e) => {
    if (isExiting || touchStartYRef.current === null) return;
    const currentY = e.touches[0]?.clientY;
    if (typeof currentY === 'number' && touchStartYRef.current - currentY > 36) {
      touchStartYRef.current = null;
      onExplore();
    }
  };

  return (
    <section
      aria-label="TEMPUS Welcome"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-[#f7f5f2] text-[#111111] transition-[opacity,transform] duration-[1150ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform] motion-reduce:transition-none ${
        isExiting
          ? 'pointer-events-none -translate-y-10 opacity-0'
          : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Top Bar */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1680px] shrink-0 items-center justify-between px-6 pt-5 pb-3 sm:px-10 sm:pt-7 lg:px-14">
        <div
          className={`flex items-center gap-3 transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
            stage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <img
            src={COLLECTION_META.logo}
            alt={`${COLLECTION_META.brand} logo`}
            className="h-7 w-7 rounded-[6px] object-contain sm:h-8 sm:w-8"
          />
          <span className="font-editorial text-lg font-medium tracking-[0.26em] text-[#111111] sm:text-xl">
            {COLLECTION_META.brand}
          </span>
        </div>

        <span
          className={`text-[10px] tracking-[0.26em] text-[#111111]/65 uppercase transition-opacity duration-[800ms] motion-reduce:transition-none ${
            stage >= 1 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Edition 01
        </span>
      </div>

      {/* Main Stage: Transparent Campaign Cutout + Left Editorial Typography */}
      <div className="relative mx-auto flex w-full max-w-[1680px] flex-1 flex-col justify-between px-6 sm:flex-row sm:items-center sm:px-10 lg:px-14">
        {/* Transparent PNG Cutout standing directly on the #f7f5f2 canvas */}
        <div className="relative flex flex-1 items-end justify-center overflow-hidden sm:absolute sm:inset-y-0 sm:right-6 sm:left-auto sm:w-[74%] sm:items-center sm:justify-end lg:right-10">
          <img
            src="/images/hero-campaign.png"
            alt="TEMPUS Campaign"
            className={`max-h-[46dvh] w-full object-contain object-bottom transition-[opacity,transform] duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:transition-none sm:max-h-[78dvh] sm:w-auto sm:max-w-full sm:object-right ${
              stage >= 3 ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'
            }`}
          />
        </div>

        {/* Left-Aligned Editorial Headline & CTA */}
        <div className="relative z-20 max-w-lg pb-6 sm:pb-0">
          <h1
            className={`font-editorial text-3xl font-normal tracking-[0.04em] text-[#111111] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none sm:text-5xl lg:text-6xl ${
              stage >= 2
                ? 'translate-y-0 opacity-100'
                : 'translate-y-5 opacity-0'
            }`}
          >
            TIMELESS BY DESIGN.
          </h1>

          <div
            className={`mt-4 transition-[opacity,transform] duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none sm:mt-5 ${
              stage >= 4
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            <p className="max-w-sm text-xs leading-relaxed tracking-[0.06em] text-[#444444] sm:text-sm">
              Architectural outerwear, essential denim, and modern silhouettes crafted for enduring form.
            </p>

            <button
              type="button"
              onClick={onExplore}
              disabled={isExiting}
              className="group mt-6 inline-flex cursor-pointer items-center gap-3 border border-[#111111] bg-[#111111] px-7 py-3.5 text-[11px] font-medium tracking-[0.24em] text-[#f7f5f2] uppercase transition-all duration-300 hover:bg-transparent hover:text-[#111111] disabled:pointer-events-none focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#111111] sm:mt-8"
            >
              <span>Explore the Collection</span>
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Hairline */}
      <div className="relative z-20 mx-auto w-full max-w-[1680px] shrink-0 px-6 pb-5 sm:px-10 sm:pb-6 lg:px-14">
        <div
          className={`flex items-center justify-between border-t border-black/10 pt-4 text-[10px] tracking-[0.22em] text-[#111111]/55 uppercase transition-opacity duration-[900ms] ${
            stage >= 4 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span>The New Silhouettes</span>
          <span>Scroll or Click to Explore</span>
        </div>
      </div>
    </section>
  );
}
