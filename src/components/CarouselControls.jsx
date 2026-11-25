import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MODELS } from '../data/models';

export default function CarouselControls({
  activeIndex,
  onPrev,
  onNext,
  onGoTo,
}) {
  const total = MODELS.length;

  return (
    <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 pt-4 pb-6 sm:px-10 sm:pt-5 sm:pb-8 lg:px-16">
      {/* Left Arrow */}
      <button
        type="button"
        onClick={onPrev}
        disabled={activeIndex === 0}
        aria-label="Previous look"
        className="flex h-9 w-9 items-center justify-center text-[#111111] transition-opacity duration-200 hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-25 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.4} />
      </button>

      {/* Numbered Look Indicators: 01 .. 08 */}
      <div
        role="tablist"
        aria-label="Lookbook navigation"
        className="flex items-center gap-2 sm:gap-4"
      >
        {MODELS.map((model, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={model.id}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              aria-label={`View ${model.label}`}
              onClick={() => onGoTo(idx)}
              className={`relative py-1.5 text-[11px] tracking-[0.18em] tabular-nums transition-colors duration-200 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#111111] ${
                isCurrent
                  ? 'font-medium text-[#111111]'
                  : 'font-normal text-[#888888] hover:text-[#111111]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>{model.number}</span>
                {isCurrent && (
                  <span className="hidden text-[10px] tracking-[0.2em] uppercase sm:inline">
                    {model.label}
                  </span>
                )}
              </span>
              <span
                aria-hidden="true"
                className={`absolute right-0 bottom-0 left-0 h-[1.5px] bg-[#111111] transition-transform duration-300 origin-left ${
                  isCurrent ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Right Arrow */}
      <button
        type="button"
        onClick={onNext}
        disabled={activeIndex === total - 1}
        aria-label="Next look"
        className="flex h-9 w-9 items-center justify-center text-[#111111] transition-opacity duration-200 hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-25 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
      >
        <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
      </button>
    </div>
  );
}
