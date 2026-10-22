import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, ShieldCheck, Flame } from 'lucide-react';
import { getFullImageUrl } from '@/utils/imageUrl';

/**
 * ProductListingHero:
 * Modern butcher e-commerce hero banner placed below the fixed navbar.
 * - Dynamic category title & description
 * - Breadcrumb navigation (Home / Catalog / Category)
 * - Live item count & sterile cold-chain guarantee badge
 * - Cinematic dark butchery background with optional category backdrop
 */
const ProductListingHero = ({
  category = null,
  count = 0,
}) => {
  const title = category?.name
    ? `${category.name} Catalog`
    : 'Artisanal Fresh Meat Catalog';

  const description = category?.description ||
    '100% net usable weight standards. Trimmed clean of sinew, bone dust, and excess fat before precision portioning.';

  const bgImage = category?.image ? getFullImageUrl(category.image) : null;

  return (
    <div className="relative mt-20 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black text-white border-b border-zinc-800 overflow-hidden">
      {/* Optional Background Backdrop Image with Monochromatic Overlay */}
      {bgImage && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={bgImage}
            alt={title}
            className="w-full h-full object-cover opacity-15 mix-blend-luminosity scale-105 blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
        </div>
      )}

      {/* Decorative Radial Spotlight */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-left">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono mb-4">
          <Link
            to="/"
            className="flex items-center gap-1 text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft size={12} />
            <span>Home</span>
          </Link>
          <ChevronRight size={12} className="text-zinc-600" />
          <Link
            to="/products"
            className="text-zinc-400 hover:text-white transition"
          >
            Catalog
          </Link>
          {category?.name && (
            <>
              <ChevronRight size={12} className="text-zinc-600" />
              <span className="text-white font-semibold truncate capitalize">
                {category.name}
              </span>
            </>
          )}
        </nav>

        {/* Header Content & Badges */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            {/* Micro Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-red-400 bg-red-950/40 border border-red-900/60 px-2.5 py-0.5 rounded-full">
                <Flame size={11} className="text-red-500 fill-red-500" />
                Artisanal Butchery
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-full">
                <ShieldCheck size={11} className="text-emerald-400" />
                Zero Dressing Deduction
              </span>
            </div>

            {/* Dynamic Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white uppercase font-sans">
              {title}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

          {/* Quick Count Badge */}
          <div className="shrink-0 flex items-center gap-3">
            <div className="px-4 py-2 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-300 shadow-sm flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>
                <strong className="text-white font-bold">{count}</strong> Fresh Cuts Available
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingHero;
