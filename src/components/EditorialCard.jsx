import { ArrowUpRight } from 'lucide-react';

export default function EditorialCard({
  collection,
  index,
  isVisible,
  onSelect,
}) {
  const isLightText = collection.textTheme === 'light';

  return (
    <button
      type="button"
      onClick={() => onSelect(collection)}
      style={{
        transitionDelay: isVisible ? `${index * 220}ms` : '0ms',
      }}
      className={`group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-[12px] border-0 bg-transparent p-0 text-left shadow-none outline-none transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.985] motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:active:scale-100 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[35px] opacity-0'
      }`}
    >
      {/* Slim Campaign Image Container with exact 12px corner radius */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[12px] border-0 bg-[#efede9]">
        <img
          src={collection.image}
          alt={collection.alt}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />

        {/* Subtle directional gradient overlay for left-aligned text legibility */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${
            isLightText
              ? 'bg-gradient-to-r from-black/35 via-black/10 to-transparent'
              : 'bg-gradient-to-r from-white/40 via-white/10 to-transparent'
          }`}
        />

        {/* Editorial Title & Label Positioned Inside Left */}
        <div
          className={`absolute top-[56%] left-5 z-10 flex max-w-[82%] -translate-y-1/2 flex-col items-start gap-1.5 sm:left-6 ${
            isLightText ? 'text-white' : 'text-[#111111]'
          }`}
        >
          <span
            className={`text-[10px] font-medium tracking-[0.22em] uppercase ${
              isLightText ? 'text-white/85' : 'text-[#111111]/75'
            }`}
          >
            {collection.number}
          </span>

          <h3 className="font-editorial text-xl font-normal tracking-[0.04em] transition-opacity duration-300 group-hover:opacity-80 sm:text-2xl">
            {collection.title}
          </h3>

          <span className="mt-1 inline-flex items-center gap-1.5 pb-0.5 text-[10px] font-medium tracking-[0.18em] uppercase transition-opacity duration-300 group-hover:opacity-75">
            <span>{collection.cta}</span>
            <ArrowUpRight
              className="h-3 w-3 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
              strokeWidth={1.5}
            />
          </span>
        </div>
      </div>
    </button>
  );
}
