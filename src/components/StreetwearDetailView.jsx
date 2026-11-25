import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Minus, Plus } from 'lucide-react';
import { formatPrice, getProductsForModel } from '../data/products';
import { useCart } from '../context/CartContext';

export default function StreetwearDetailView({ model, onBack }) {
  const { addItem, triggerFlyToBag } = useCart();
  const products = getProductsForModel(model.id);

  // Slide 0 = Complete Model, Slide 1 = Top (T-Shirt / Hoodie), Slide 2 = Bottoms (Pants / Sweatpants)
  const slides = useMemo(
    () => [
      {
        type: 'model',
        id: `${model.id}-complete`,
        label: 'Complete Look',
        image: model.image,
        alt: model.alt,
      },
      ...products.map((product) => ({
        type: 'product',
        id: product.id,
        label: product.category,
        image: product.image,
        alt: product.name,
        product,
      })),
    ],
    [model, products]
  );

  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const activeImgRef = useRef(null);
  const dragRef = useRef({ isDown: false, startX: 0 });
  const wheelLockRef = useRef(0);

  const currentSlide = slides[slideIndex] || slides[0];
  const activeProduct =
    currentSlide.type === 'product' ? currentSlide.product : null;

  // Reset to Slide 0 when model changes
  useEffect(() => {
    setSlideIndex(0);
  }, [model.id]);

  // Reset size/quantity when changing active product slide
  useEffect(() => {
    setSelectedSize(null);
    setQuantity(1);
    setSizeError(false);
    setJustAdded(false);
  }, [model.id, slideIndex]);

  const goToSlide = useCallback(
    (idx) => {
      const clamped = Math.max(0, Math.min(idx, slides.length - 1));
      setSlideIndex(clamped);
    },
    [slides.length]
  );

  // Keyboard Left/Right navigation
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        goToSlide(slideIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        goToSlide(slideIndex - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [slideIndex, goToSlide]);

  // Controlled single-step pointer drag / touch swipe
  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    dragRef.current = { isDown: true, startX: e.clientX };
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.isDown) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 42) {
      dragRef.current.isDown = false;
      goToSlide(slideIndex + (dx < 0 ? 1 : -1));
    }
  };

  const handlePointerUp = () => {
    dragRef.current.isDown = false;
  };

  // Controlled trackpad / wheel horizontal scroll (one slide per gesture)
  const handleWheel = (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 12) return;
    const now = performance.now();
    if (now - wheelLockRef.current < 420) return;
    wheelLockRef.current = now;
    goToSlide(slideIndex + (delta > 0 ? 1 : -1));
  };

  const handleAddToBag = () => {
    if (!activeProduct) return;
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addItem(activeProduct, selectedSize, quantity);
    triggerFlyToBag(activeImgRef.current, activeProduct.image);
    setSizeError(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <main className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col px-5 py-6 animate-[fadeIn_360ms_ease-out] motion-reduce:animate-none sm:px-10 sm:py-8 lg:px-14">
      {/* Top Back Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex cursor-pointer items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#111111] uppercase transition-opacity duration-200 hover:opacity-60 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span>Back to Lookbook</span>
        </button>

        <span className="text-[10px] font-medium tracking-[0.24em] text-[#777777] uppercase tabular-nums">
          {model.label} · {String(slideIndex + 1).padStart(2, '0')} /{' '}
          {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      {/* Three-Column Layout:
          Mobile: Center Carousel (order-1) -> Left Info (order-2) -> Right Shopping Controls (order-3)
          Desktop: Left Info | Center Carousel (Model -> Top -> Bottoms) | Right Shopping Controls */}
      <div className="grid flex-1 grid-cols-1 items-center gap-8 lg:grid-cols-[290px_1fr_300px] lg:gap-10 xl:grid-cols-[320px_1fr_330px]">
        {/* LEFT COLUMN — LOOKBOOK INTRO OR ACTIVE PRODUCT INFO */}
        <section
          aria-label="Product information"
          className="order-2 flex flex-col justify-center lg:order-1"
        >
          {activeProduct ? (
            <div
              key={activeProduct.id}
              className="animate-[fadeIn_300ms_ease-out]"
            >
              <p className="text-[10px] font-medium tracking-[0.24em] text-[#777777] uppercase">
                {model.label} · {activeProduct.category}
              </p>
              <h1 className="font-editorial mt-2 text-3xl font-normal tracking-[0.02em] text-[#111111] sm:text-4xl">
                {activeProduct.name}
              </h1>
              <p className="mt-2.5 text-base font-normal text-[#111111] tabular-nums">
                {formatPrice(activeProduct.price)}
              </p>
              {activeProduct.description && (
                <p className="mt-4 max-w-xs text-xs leading-relaxed text-[#666666]">
                  {activeProduct.description}
                </p>
              )}
            </div>
          ) : (
            <div
              key={`${model.id}-intro`}
              className="animate-[fadeIn_300ms_ease-out]"
            >
              <p className="text-[10px] font-medium tracking-[0.24em] text-[#777777] uppercase">
                Streetwear Editorial
              </p>
              <h1 className="font-editorial mt-2 text-3xl font-normal tracking-[0.02em] text-[#111111] sm:text-4xl">
                {model.label}
              </h1>
              <p className="mt-4 max-w-xs text-xs leading-relaxed text-[#666666]">
                {model.alt}. Scroll horizontally or select a piece to explore each garment individually.
              </p>
            </div>
          )}

          {/* Subtle Slide Sequence Controls */}
          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => goToSlide(slideIndex - 1)}
              disabled={slideIndex === 0}
              aria-label="Previous slide"
              className="flex h-8 w-8 items-center justify-center text-[#111111] transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.35} />
            </button>

            <div className="flex flex-wrap items-center gap-3">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`pb-1 text-[10px] tracking-[0.18em] uppercase transition-colors ${
                    idx === slideIndex
                      ? 'border-b border-[#111111] font-medium text-[#111111]'
                      : 'text-[#888888] hover:text-[#111111]'
                  }`}
                >
                  0{idx + 1} {slide.type === 'model' ? 'Look' : slide.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => goToSlide(slideIndex + 1)}
              disabled={slideIndex === slides.length - 1}
              aria-label="Next slide"
              className="flex h-8 w-8 items-center justify-center text-[#111111] transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.35} />
            </button>
          </div>
        </section>

        {/* CENTER COLUMN — HORIZONTAL MODEL-TO-PRODUCT SHOWCASE (1 IMAGE PER SLIDE) */}
        <section
          aria-label="Model and garment showcase"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onWheel={handleWheel}
          className="order-1 relative h-[54dvh] min-h-[340px] max-h-[760px] w-full cursor-grab overflow-hidden touch-pan-y select-none active:cursor-grabbing lg:order-2 lg:h-[74dvh]"
        >
          <div
            style={{
              transform: `translate3d(-${slideIndex * 100}%, 0, 0)`,
            }}
            className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          >
            {slides.map((slide, idx) => {
              const isActive = idx === slideIndex;
              return (
                <div
                  key={slide.id}
                  className={`flex h-full w-full shrink-0 items-center justify-center transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                  }`}
                >
                  <img
                    ref={isActive && slide.type === 'product' ? activeImgRef : null}
                    src={slide.image}
                    alt={slide.alt}
                    draggable={false}
                    className={`h-full w-auto max-w-full object-contain ${
                      slide.type === 'model' ? 'object-bottom' : 'max-h-[82%] object-center'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* RIGHT COLUMN — SHOPPING CONTROLS (FOR ACTIVE PRODUCT) OR PIECE SELECTOR (FOR MODEL SLIDE) */}
        <section
          aria-label="Shopping controls"
          className="order-3 flex flex-col justify-center lg:order-3"
        >
          {activeProduct ? (
            <div
              key={`controls-${activeProduct.id}`}
              className="animate-[fadeIn_280ms_ease-out]"
            >
              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium tracking-[0.2em] text-[#666666] uppercase">
                    Size
                  </span>
                  {sizeError && (
                    <span role="alert" className="text-[10px] text-[#9b2c2c]">
                      Please select a size
                    </span>
                  )}
                </div>

                <div className="mt-2 grid grid-cols-4 gap-2">
                  {activeProduct.sizes.map((size) => {
                    const isActive = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                        aria-pressed={isActive}
                        className={`h-9 text-[11px] tracking-[0.14em] transition-colors duration-150 ${
                          isActive
                            ? 'bg-[#111111] text-[#f7f5f2]'
                            : 'border border-black/12 bg-transparent text-[#111111] hover:border-black/40'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity & Add to Bag */}
              <div className="mt-4 flex items-center gap-2.5">
                <div
                  className="flex h-10 items-center border border-black/12"
                  aria-label={`Quantity for ${activeProduct.name}`}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="flex h-full w-9 items-center justify-center text-[#111111] transition-opacity hover:opacity-60 disabled:opacity-30"
                  >
                    <Minus className="h-3 w-3" strokeWidth={1.5} />
                  </button>
                  <span className="w-7 text-center text-xs text-[#111111] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="flex h-full w-9 items-center justify-center text-[#111111] transition-opacity hover:opacity-60"
                  >
                    <Plus className="h-3 w-3" strokeWidth={1.5} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToBag}
                  className={`flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-200 ${
                    justAdded
                      ? 'bg-[#2c2c2c] text-[#f7f5f2]'
                      : 'bg-[#111111] text-[#f7f5f2] hover:bg-[#2a2a2a]'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="h-3.5 w-3.5" strokeWidth={1.75} />
                      <span>Added</span>
                    </>
                  ) : (
                    <span>Add to Bag</span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 animate-[fadeIn_280ms_ease-out]">
              <p className="text-[10px] font-medium tracking-[0.22em] text-[#777777] uppercase">
                Styled Pieces ({products.length})
              </p>
              {products.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goToSlide(idx + 1)}
                  className="group flex cursor-pointer items-center justify-between border-b border-black/[0.08] py-3 text-left transition-opacity hover:opacity-70"
                >
                  <div>
                    <p className="text-[10px] tracking-[0.18em] text-[#777777] uppercase">
                      0{idx + 2} · {item.category}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-[#111111]">
                      {item.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#555555] tabular-nums">
                      {formatPrice(item.price)}
                    </span>
                    <ArrowRight
                      className="h-3.5 w-3.5 text-[#111111] transition-transform duration-200 group-hover:translate-x-0.5"
                      strokeWidth={1.4}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
