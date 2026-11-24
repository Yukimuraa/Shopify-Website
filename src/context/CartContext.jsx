import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [flyingItems, setFlyingItems] = useState([]);
  const [bagPulseKey, setBagPulseKey] = useState(0);

  const bagIconRef = useRef(null);

  const openBag = useCallback(() => setIsBagOpen(true), []);
  const closeBag = useCallback(() => setIsBagOpen(false), []);

  const triggerFlyToBag = useCallback((sourceEl, imageSrc) => {
    if (!imageSrc) return;

    const sourceRect = sourceEl?.getBoundingClientRect();
    const bagRect = bagIconRef.current?.getBoundingClientRect();

    // Fallback start/end coordinates if an element is offscreen on mobile
    const startX = sourceRect ? sourceRect.left + sourceRect.width / 2 : window.innerWidth / 2;
    const startY = sourceRect ? sourceRect.top + sourceRect.height / 2 : window.innerHeight / 2;
    const startW = sourceRect ? Math.min(84, Math.max(48, sourceRect.width)) : 56;
    const startH = sourceRect ? Math.min(104, Math.max(56, sourceRect.height)) : 72;

    const endX =
      bagRect && bagRect.width > 0
        ? bagRect.left + bagRect.width / 2
        : window.innerWidth - 36;
    const endY =
      bagRect && bagRect.height > 0 ? bagRect.top + bagRect.height / 2 : 28;

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setFlyingItems((prev) => [
      ...prev,
      { id, imageSrc, startX, startY, startW, startH, endX, endY },
    ]);
  }, []);

  const completeFlyItem = useCallback((id) => {
    setFlyingItems((prev) => prev.filter((entry) => entry.id !== id));
    setBagPulseKey((k) => k + 1);
  }, []);

  const addItem = useCallback((product, size, quantity = 1) => {
    if (!product || !size || quantity < 1) return;
    const key = `${product.id}__${size}`;

    setItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          quantity,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((key, delta) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      isBagOpen,
      openBag,
      closeBag,
      addItem,
      updateQuantity,
      removeItem,
      totalItems,
      totalPrice,
      bagIconRef,
      flyingItems,
      triggerFlyToBag,
      completeFlyItem,
      bagPulseKey,
    }),
    [
      items,
      isBagOpen,
      openBag,
      closeBag,
      addItem,
      updateQuantity,
      removeItem,
      totalItems,
      totalPrice,
      flyingItems,
      triggerFlyToBag,
      completeFlyItem,
      bagPulseKey,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
