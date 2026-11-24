export default function ModelSlide({
  model,
  offset,
  spacing,
  isSelected,
  isFocused,
  focusMode,
  isDragging,
  onSelect,
  onDoubleClick,
}) {
  const absOffset = Math.abs(offset);
  const isCenter = absOffset < 0.35;

  // Depth-of-field & perspective curve
  let scale = Math.max(0.68, 1 - absOffset * 0.13);
  let translateX = offset * spacing;
  let translateY = -absOffset * 12;
  let blur = absOffset < 0.08 ? 0 : Math.min(3.8, absOffset * 1.25);
  let opacity = Math.max(0.42, 1 - absOffset * 0.16);
  const zIndex = isFocused ? 60 : Math.round(50 - absOffset * 10);

  if (focusMode) {
    if (isFocused) {
      scale = 1.07;
      translateX = 0;
      translateY = 0;
      blur = 0;
      opacity = 1;
    } else {
      scale = Math.max(0.62, scale * 0.92);
      blur = Math.max(4, blur + 2);
      opacity = 0;
    }
  } else if (isSelected && isCenter) {
    scale *= 1.02;
  }

  return (
    <div
      style={{
        zIndex,
        opacity,
        transform: `translate3d(calc(-50% + ${translateX}px), ${translateY}px, 0) scale(${scale})`,
        filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none',
        transformOrigin: 'bottom center',
        pointerEvents: focusMode && !isFocused ? 'none' : 'auto',
      }}
      className={`absolute bottom-0 left-1/2 flex flex-col items-center select-none will-change-[transform,opacity,filter] ${
        isDragging
          ? ''
          : 'transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        onDoubleClick={onDoubleClick}
        aria-pressed={isSelected || isFocused}
        aria-label={`${model.label}${isFocused ? ' (focus mode)' : isCenter ? ' (active)' : ''}`}
        className="group relative flex h-[52dvh] min-h-[320px] max-h-[620px] touch-manipulation cursor-pointer items-end justify-center bg-transparent p-0 focus-visible:outline-none sm:h-[58dvh] lg:h-[62dvh]"
      >
        {/* Subtle studio floor shadow beneath the model's feet */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-1.5 left-1/2 h-3.5 w-32 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.14)_0%,transparent_72%)] transition-opacity duration-300 sm:w-40"
          style={{ opacity: focusMode && !isFocused ? 0 : Math.max(0.25, 1 - absOffset * 0.25) }}
        />

        <img
          src={model.image}
          alt={model.alt}
          draggable={false}
          loading="eager"
          className="h-full w-auto max-w-none object-contain object-bottom"
        />
      </button>
    </div>
  );
}
