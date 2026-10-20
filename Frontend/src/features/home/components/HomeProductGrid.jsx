import React from 'react';
import ProductCard from '@/features/product/components/ProductCard';
import { PackageOpen, RefreshCw } from 'lucide-react';

/**
 * HomeProductGrid:
 * Grid layout rendering ProductCard components imported from the Product feature.
 * Preserves cut pills, net weight badges, stock counters, and Add to Bag handlers.
 * Handles empty state and skeleton loading cleanly.
 */
const HomeProductGrid = ({
  products = [],
  loading = false,
  onResetFilters,
  onOpenStandardModal,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-3 animate-pulse"
          >
            <div className="w-full aspect-4/3 rounded-xl bg-zinc-100"></div>
            <div className="h-3 bg-zinc-100 rounded w-1/4"></div>
            <div className="h-5 bg-zinc-100 rounded w-3/4"></div>
            <div className="h-8 bg-zinc-100 rounded-xl w-full"></div>
            <div className="pt-3 border-t border-zinc-100 flex justify-between items-center">
              <div className="h-6 bg-zinc-100 rounded w-1/3"></div>
              <div className="h-9 bg-zinc-100 rounded-xl w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center bg-zinc-50 border border-zinc-200 rounded-2xl p-8 max-w-xl mx-auto space-y-4">
        <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
          <PackageOpen size={24} className="stroke-[1.5]" />
        </div>
        <div>
          <h3 className="text-base font-bold text-black tracking-tight">No butchery cuts found</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto leading-relaxed">
            We couldn't find any cuts matching your active department or culinary cut selection in today's morning batch.
          </p>
        </div>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition cursor-pointer shadow-xs"
          >
            <RefreshCw size={13} />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div id="catalog-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          product={product}
          onOpenStandardModal={onOpenStandardModal}
        />
      ))}
    </div>
  );
};

export default HomeProductGrid;