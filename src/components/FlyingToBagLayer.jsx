import { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';

function FlyingThumbnail({ item, onComplete }) {
  const nodeRef = useRef(null);

  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;

    const dx = item.endX - item.startX;
    const dy = item.endY - item.startY;

    // Quadratic Bezier control point for a graceful upward/inward arc
    const ctrlX = dx * 0.45 - 36;
    const ctrlY = Math.min(0, dy * 0.5) - 90;

    const steps = 16;
    const keyframes = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const omt = 1 - t;
      // Ease-in-out timing along curve
      const x = 2 * omt * t * ctrlX + t * t * dx;
      const y = 2 * omt * t * ctrlY + t * t * dy;
      const scale = 1 - 0.82 * Math.pow(t, 1.15);
      const opacity = t < 0.72 ? 0.96 : 0.96 - ((t - 0.72) / 0.28) * 0.72;

      keyframes.push({
        transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
        opacity: Number(opacity.toFixed(3)),
      });
    }

    const animation = el.animate(keyframes, {
      duration: 740,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards',
    });

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      onComplete(item.id);
    };

    animation.onfinish = finish;
    const fallbackTimer = setTimeout(finish, 800);

    return () => {
      clearTimeout(fallbackTimer);
      animation.cancel();
    };
  }, [item, onComplete]);

  return (
    <div
      ref={nodeRef}
      aria-hidden="true"
      style={{
        left: `${item.startX - item.startW / 2}px`,
        top: `${item.startY - item.startH / 2}px`,
        width: `${item.startW}px`,
        height: `${item.startH}px`,
      }}
      className="pointer-events-none fixed z-[70] flex items-center justify-center will-change-transform"
    >
      <img
        src={item.imageSrc}
        alt=""
        className="h-full w-full object-contain drop-shadow-sm"
      />
    </div>
  );
}

export default function FlyingToBagLayer() {
  const { flyingItems, completeFlyItem } = useCart();

  if (flyingItems.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden="true">
      {flyingItems.map((item) => (
        <FlyingThumbnail key={item.id} item={item} onComplete={completeFlyItem} />
      ))}
    </div>
  );
}
