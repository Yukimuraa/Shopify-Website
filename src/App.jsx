import { useState } from 'react';
import { MODELS } from './data/models';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import CollectionHeading from './components/CollectionHeading';
import FashionCarousel from './components/FashionCarousel';
import ShoppingPanel from './components/ShoppingPanel';
import ShoppingBagDrawer from './components/ShoppingBagDrawer';
import FlyingToBagLayer from './components/FlyingToBagLayer';

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeModel = MODELS[activeIndex] || MODELS[0];

  return (
    <CartProvider>
      <div id="top" className="flex min-h-dvh flex-col bg-[#f7f5f2] text-[#111111]">
        <Header />

        <main className="mx-auto grid w-full max-w-[1680px] flex-1 grid-cols-1 lg:grid-cols-[1fr_390px] xl:grid-cols-[1fr_430px]">
          {/* Left Column: Editorial Heading + Transparent Model Carousel */}
          <div className="flex min-w-0 flex-col justify-between">
            <CollectionHeading />
            <FashionCarousel
              activeIndex={activeIndex}
              onActiveChange={setActiveIndex}
            />
          </div>

          {/* Right Column: Sticky Shopping Panel */}
          <ShoppingPanel activeModel={activeModel} />
        </main>

        <ShoppingBagDrawer />
        <FlyingToBagLayer />
      </div>
    </CartProvider>
  );
}
