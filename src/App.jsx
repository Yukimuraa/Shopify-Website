import { useCallback, useEffect, useState } from 'react';
import { MODELS } from './data/models';
import { getCollectionBySlug } from './data/collections';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import CollectionHeading from './components/CollectionHeading';
import FashionCarousel from './components/FashionCarousel';
import ShoppingPanel from './components/ShoppingPanel';
import MobileLookStrip from './components/MobileLookStrip';
import ShoppingBagDrawer from './components/ShoppingBagDrawer';
import FlyingToBagLayer from './components/FlyingToBagLayer';
import EditorialSection from './components/EditorialSection';
import CollectionDetailView from './components/CollectionDetailView';

function parseCollectionSlugFromHash() {
  const match = window.location.hash.match(/^#\/collections\/([a-z0-9-]+)$/);
  return match ? match[1] : null;
}

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [collectionSlug, setCollectionSlug] = useState(() =>
    typeof window !== 'undefined' ? parseCollectionSlugFromHash() : null
  );

  const activeModel = MODELS[activeIndex] || MODELS[0];
  const activeCollection = collectionSlug
    ? getCollectionBySlug(collectionSlug)
    : null;

  useEffect(() => {
    const onHashChange = () => {
      setCollectionSlug(parseCollectionSlugFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const openCollection = useCallback((collection) => {
    window.location.hash = `#/collections/${collection.slug}`;
    setCollectionSlug(collection.slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const closeCollection = useCallback(() => {
    window.location.hash = '#top';
    setCollectionSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <CartProvider>
      <div id="top" className="flex min-h-dvh flex-col bg-[#f7f5f2] text-[#111111]">
        <Header onNavigateHome={closeCollection} />

        {activeCollection ? (
          <CollectionDetailView
            collection={activeCollection}
            onBack={closeCollection}
          />
        ) : (
          <>
            <main className="mx-auto grid w-full max-w-[1680px] flex-1 grid-cols-1 lg:grid-cols-[1fr_390px] xl:grid-cols-[1fr_430px]">
              {/* Left Column: Editorial Heading + Transparent Model Carousel */}
              <div className="flex min-w-0 flex-col justify-between">
                <CollectionHeading />
                <FashionCarousel
                  activeIndex={activeIndex}
                  onActiveChange={setActiveIndex}
                />
              </div>

              {/* Right Column: Sticky Shopping Panel (desktop) + Mobile Look Strip */}
              <ShoppingPanel activeModel={activeModel} />
              <MobileLookStrip activeModel={activeModel} />
            </main>

            <EditorialSection onSelectCollection={openCollection} />
          </>
        )}

        <ShoppingBagDrawer />
        <FlyingToBagLayer />
      </div>
    </CartProvider>
  );
}
