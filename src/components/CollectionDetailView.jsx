import { ArrowLeft } from 'lucide-react';
import { MODELS } from '../data/models';
import { getProductsForModel } from '../data/products';
import ProductRow from './ProductRow';

export default function CollectionDetailView({ collection, onBack }) {
  const collectionModels = MODELS.filter((m) =>
    collection.modelIds.includes(m.id)
  );

  return (
    <main className="mx-auto w-full max-w-[1680px] flex-1 px-5 py-8 animate-[fadeIn_360ms_ease-out] motion-reduce:animate-none sm:px-10 sm:py-12 lg:px-14">
      {/* Back Navigation */}
      <button
        type="button"
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#111111] uppercase transition-opacity duration-200 hover:opacity-60 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        <span>Back to Lookbook</span>
      </button>

      {/* Collection Hero */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <div className="aspect-[4/5] w-full overflow-hidden bg-[#efede9]">
            <img
              src={collection.image}
              alt={collection.alt}
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between lg:col-span-6">
          <div>
            <p className="text-[10px] font-medium tracking-[0.26em] text-[#777777] uppercase">
              {collection.number}
            </p>
            <h1 className="font-editorial mt-2 text-4xl font-normal tracking-[0.04em] text-[#111111] sm:text-5xl">
              {collection.title}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#555555]">
              {collection.subtitle}
            </p>
          </div>

          {/* Shoppable Looks in this Collection */}
          <div className="mt-10 border-t border-black/[0.07] pt-6">
            {collectionModels.map((model) => {
              const products = getProductsForModel(model.id);
              return (
                <div key={model.id} className="mb-8 last:mb-0">
                  <h2 className="mb-2 text-[11px] font-medium tracking-[0.22em] text-[#111111] uppercase">
                    {model.label}
                  </h2>
                  {products.map((product) => (
                    <ProductRow
                      key={`${collection.id}-${model.id}-${product.id}`}
                      product={product}
                      lookKey={`${collection.id}-${model.id}`}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
