import { useCallback, useEffect, useRef, useState } from 'react';
import { MODELS } from '../data/models';
import ModelSlide from './ModelSlide';
import CarouselControls from './CarouselControls';

function getResponsiveSpacing(width) {
  if (width < 640) return 90;
  if (width < 1024) return 122;
  if (width < 1280) return 126;
  return 146;
}

export default function FashionCarousel({
  activeIndex = 0,
  onActiveChange,
  isRevealed = true,
}) {
  const stageRef = useRef(null);

  const targetRef = useRef(activeIndex);
  const currentRef = useRef(activeIndex);
  const dragRef = useRef({
    isDown: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    startTarget: activeIndex,
    velocity: 0,
    hasMoved: false,
  });

  const isPausedRef = useRef(false);
  const resumeTimerRef = useRef(null);
  const wheelLockRef = useRef(0);

  const [renderPos, setRenderPos] = useState(activeIndex);
  const [selectedId, setSelectedId] = useState(null);
  const [focusMode, setFocusMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [spacing, setSpacing] = useState(() =>
    typeof window !== 'undefined' ? getResponsiveSpacing(window.innerWidth) : 146
  );

  // Sync external activeIndex changes
  useEffect(() => {
    if (!dragRef.current.isDown) {
      targetRef.current = activeIndex;
    }
  }, [activeIndex]);

  useEffect(() => {
    const onResize = () => setSpacing(getResponsiveSpacing(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const pauseAuto = useCallback((resumeAfterMs = 0) => {
    isPausedRef.current = true;
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    if (resumeAfterMs > 0) {
      resumeTimerRef.current = setTimeout(() => {
        isPausedRef.current = false;
      }, resumeAfterMs);
    }
  }, []);

  const updateActive = useCallback(
    (idx) => {
      const clamped = Math.max(0, Math.min(idx, MODELS.length - 1));
      targetRef.current = clamped;
      onActiveChange?.(clamped);
    },
    [onActiveChange]
  );

  const goTo = useCallback(
    (index) => {
      updateActive(index);
      pauseAuto(5500);
    },
    [updateActive, pauseAuto]
  );

  // Keep auto-drift paused while Focus Mode is active
  useEffect(() => {
    if (focusMode) {
      pauseAuto();
    } else {
      pauseAuto(4000);
    }
  }, [focusMode, pauseAuto]);

  // Smooth 60/120fps interpolation loop
  useEffect(() => {
    let rafId = null;
    let lastTime = performance.now();
    let autoDirection = 1;
    let autoAccum = 0;

    const tick = (now) => {
      const dt = Math.min(32, now - lastTime);
      lastTime = now;

      if (!isPausedRef.current && !dragRef.current.isDown && !focusMode) {
        autoAccum += dt;
        if (autoAccum >= 4500) {
          autoAccum = 0;
          let next = Math.round(targetRef.current) + autoDirection;
          if (next >= MODELS.length) {
            autoDirection = -1;
            next = MODELS.length - 2;
          } else if (next < 0) {
            autoDirection = 1;
            next = 1;
          }
          targetRef.current = next;
          onActiveChange?.(next);
        }
      } else {
        autoAccum = 0;
      }

      const diff = targetRef.current - currentRef.current;
      if (Math.abs(diff) > 0.0008) {
        const factor = dragRef.current.isDown ? 0.35 : Math.min(1, (dt / 16.67) * 0.13);
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
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [onActiveChange, focusMode]);

  // Keyboard navigation (ArrowLeft/Right + Escape to exit Focus Mode)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        goTo(activeIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        goTo(activeIndex - 1);
      } else if (e.key === 'Escape' && focusMode) {
        setFocusMode(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, focusMode, goTo]);

  // Pointer drag (mouse + touch) with momentum release
  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (focusMode) return;
    pauseAuto();

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

    const nextTarget = dragRef.current.startTarget - dxTotal / spacing;
    const clamped = Math.max(-0.25, Math.min(MODELS.length - 0.75, nextTarget));
    targetRef.current = clamped;
    onActiveChange?.(Math.max(0, Math.min(MODELS.length - 1, Math.round(clamped))));
  };

  const handlePointerUp = () => {
    if (!dragRef.current.isDown) return;
    dragRef.current.isDown = false;
    setIsDragging(false);

    const projected = targetRef.current + dragRef.current.velocity * 1.4;
    const snapped = Math.max(0, Math.min(MODELS.length - 1, Math.round(projected)));
    updateActive(snapped);
    pauseAuto(4500);
  };

  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 8) {
      return;
    }

    const now = performance.now();
    if (now - wheelLockRef.current < 260) return;
    wheelLockRef.current = now;

    goTo(activeIndex + (e.deltaX > 0 ? 1 : -1));
  };

  const handleSelectModel = (idx, id) => {
    if (dragRef.current.hasMoved) {
      dragRef.current.hasMoved = false;
      return;
    }
    if (idx !== activeIndex) {
      goTo(idx);
    } else {
      setSelectedId((prev) => (prev === id ? null : id));
      pauseAuto(5000);
    }
  };

  const handleDoubleClickModel = (idx, id) => {
    if (idx !== activeIndex) {
      updateActive(idx);
      setSelectedId(id);
      setFocusMode(true);
    } else {
      setFocusMode((prev) => !prev);
      setSelectedId((prev) => (focusMode ? prev : id));
    }
  };

  return (
    <section aria-label="TEMPUS Lookbook Carousel" className="flex flex-1 flex-col justify-end overflow-hidden">
      {/* Perspective Depth Stage */}
      <div
        ref={stageRef}
        onMouseEnter={() => pauseAuto()}
        onMouseLeave={() => {
          handlePointerUp();
          if (!focusMode) pauseAuto(2500);
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className={`relative mx-auto h-[52dvh] min-h-[320px] max-h-[620px] w-full touch-pan-y touch-manipulation select-none sm:h-[58dvh] lg:h-[62dvh] ${
          focusMode ? 'cursor-default' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Subtle Focus Mode Indicator — positioned near the model, above model z-index */}
        {focusMode && (
          <div className="pointer-events-none absolute top-3 left-5 z-[65] sm:left-10 lg:left-14">
            <span className="inline-flex items-center gap-2 border border-black/10 bg-[#f7f5f2]/95 px-3 py-1 text-[10px] tracking-[0.2em] text-[#333333] uppercase backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#111111]" aria-hidden="true" />
              Focus Mode · Double-click to exit
            </span>
          </div>
        )}

        {MODELS.map((model, idx) => (
          <div
            key={model.id}
            style={{
              transitionDelay: isRevealed ? `${180 + idx * 85}ms` : '0ms',
            }}
            className={`pointer-events-none absolute inset-0 transition-[opacity,transform] duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
              isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <ModelSlide
              model={model}
              offset={idx - renderPos}
              spacing={spacing}
              isSelected={selectedId === model.id}
              isFocused={focusMode && idx === activeIndex}
              focusMode={focusMode}
              isDragging={isDragging}
              onSelect={() => handleSelectModel(idx, model.id)}
              onDoubleClick={() => handleDoubleClickModel(idx, model.id)}
            />
          </div>
        ))}
      </div>

      {/* Bottom Controls */}
      <CarouselControls
        activeIndex={activeIndex}
        onPrev={() => goTo(activeIndex - 1)}
        onNext={() => goTo(activeIndex + 1)}
        onGoTo={goTo}
      />
    </section>
  );
}
