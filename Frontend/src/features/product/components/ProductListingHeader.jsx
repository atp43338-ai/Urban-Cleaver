import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Layers, ShieldCheck } from 'lucide-react';

/**
 * ProductListingHeader:
 * Header banner for dedicated product listing page.
 * - Dynamic category title with fallback
 * - Breadcrumb navigation (< Home / Catalog / Category)
 * - Active item counter badge & sterile packing assurance
 */
const ProductListingHeader = ({
  categoryTitle = 'Artisanal Meat Catalog',
  categoryDescription = '',
  totalCuts = 0,
  loading = false,
}) => {
  return (
    <div className="border-b border-zinc-200 pb-6 mb-8 text-left">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono mb-4">
        <Link
          to="/"
          className="flex items-center gap-1 text-zinc-500 hover:text-black transition"
        >
          <ArrowLeft size={12} />
          <span>Home</span>
        </Link>
        <ChevronRight size={12} className="text-zinc-300" />
        <Link
          to="/products"
          className="text-zinc-500 hover:text-black transition"
        >
          Catalog
        </Link>
        {categoryTitle && categoryTitle !== 'Artisanal Meat Catalog' && (
          <>
            <ChevronRight size={12} className="text-zinc-300" />
            <span className="text-black font-semibold truncate max-w-[200px] sm:max-w-none capitalize">
              {categoryTitle}
            </span>
          </>
        )}
      </nav>

      {/* Main Title Strip & Meta Information */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
              ARTISANAL BUTCHERY CUTS
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck size={11} /> 100% Net Usable Weight
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black tracking-tight uppercase">
            {categoryTitle}
          </h1>

          {categoryDescription ? (
            <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl leading-relaxed">
              {categoryDescription}
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-zinc-500 max-w-xl">
              Precision cut fresh to order, trimmed clean of excess sinew and dressing waste.
            </p>
          )}
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-700 flex items-center gap-2">
            <Layers size={13} className="text-black" />
            <span>
              {loading ? (
                'Loading cuts...'
              ) : (
                <>
                  Showing <strong className="text-black font-bold">{totalCuts}</strong>{' '}
                  {totalCuts === 1 ? 'cut' : 'cuts'} ready for delivery
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingHeader;
