import { useCallback, useEffect, useState } from 'react';
import { MODELS } from './data/models';
import { getCollectionBySlug } from './data/collections';
import { getStreetwearModelById } from './data/streetwear';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import CollectionHeading from './components/CollectionHeading';
import FashionCarousel from './components/FashionCarousel';
import ShoppingPanel from './components/ShoppingPanel';
import MobileLookStrip from './components/MobileLookStrip';
import ShoppingBagDrawer from './components/ShoppingBagDrawer';
import FlyingToBagLayer from './components/FlyingToBagLayer';
import EditorialSection from './components/EditorialSection';
import StreetwearSection from './components/StreetwearSection';
import CollectionDetailView from './components/CollectionDetailView';
import StreetwearDetailView from './components/StreetwearDetailView';

function parseRouteFromHash() {
  const hash = window.location.hash;
  const colMatch = hash.match(/^#\/collections\/([a-z0-9-]+)$/);
  if (colMatch) {
    return { type: 'collection', slug: colMatch[1] };
  }
  const swMatch = hash.match(/^#\/streetwear\/([a-z0-9-]+)$/);
  if (swMatch) {
    return { type: 'streetwear', id: swMatch[1] };
  }
  return { type: 'home' };
}

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [route, setRoute] = useState(() =>
    typeof window !== 'undefined' ? parseRouteFromHash() : { type: 'home' }
  );
  const [selectedStreetwearId, setSelectedStreetwearId] = useState(null);

  const activeModel = MODELS[activeIndex] || MODELS[0];
  const activeCollection =
    route.type === 'collection' ? getCollectionBySlug(route.slug) : null;
  const activeStreetwearModel =
    route.type === 'streetwear' ? getStreetwearModelById(route.id) : null;

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseRouteFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const openCollection = useCallback((collection) => {
    window.location.hash = `#/collections/${collection.slug}`;
    setRoute({ type: 'collection', slug: collection.slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openStreetwearModel = useCallback((model) => {
    setSelectedStreetwearId(model.id);
    window.location.hash = `#/streetwear/${model.id}`;
    setRoute({ type: 'streetwear', id: model.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const closeCollection = useCallback(() => {
    window.location.hash = '#top';
    setRoute({ type: 'home' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const backToStreetwearShowcase = useCallback(() => {
    window.location.hash = '#streetwear-showcase';
    setRoute({ type: 'home' });
    setTimeout(() => {
      document
        .getElementById('streetwear-showcase')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
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
        ) : activeStreetwearModel ? (
          <StreetwearDetailView
            model={activeStreetwearModel}
            onBack={backToStreetwearShowcase}
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
            <StreetwearSection
              selectedModelId={selectedStreetwearId}
              onSelectModel={openStreetwearModel}
            />
          </>
        )}

        <ShoppingBagDrawer />
        <FlyingToBagLayer />
      </div>
    </CartProvider>
  );
}
