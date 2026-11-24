import { COLLECTION_META } from '../data/models';

export default function CollectionHeading() {
  return (
    <section
      aria-labelledby="collection-title"
      className="mx-auto w-full max-w-[1600px] px-5 pt-5 pb-3 sm:px-10 sm:pt-7 sm:pb-4 lg:px-16"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h1
          id="collection-title"
          className="text-xs font-medium tracking-[0.26em] text-[#111111] uppercase sm:text-sm"
        >
          {COLLECTION_META.collection}
        </h1>
        <p className="font-editorial text-base italic tracking-[0.02em] text-[#555555] sm:text-lg">
          {COLLECTION_META.subtitle}
        </p>
      </div>
    </section>
  );
}
