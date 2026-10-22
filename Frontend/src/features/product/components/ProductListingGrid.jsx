import React from 'react';
import HomeProductCard from '@/features/home/components/HomeProductCard';
import { PackageOpen, RotateCcw } from 'lucide-react';

/**
 * ProductListingGrid:
 * 4-columns responsive butcher catalog grid (lg:grid-cols-4):
 * - Renders compact HomeProductCard items
 * - Clean loading skeletons for zero layout shift
 * - Resilient empty state with filter reset action
 */
const ProductListingGrid = ({
  products = [],
  loading = false,
  onResetFilters,
}) => {
  // Loading Skeleton Grid (4 columns)
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white border border-zinc-200 rounded-xl p-3 space-y-2.5 text-left shadow-xs"
          >
            <div className="w-full aspect-square bg-zinc-100 rounded-lg"></div>
            <div className="space-y-1.5">
              <div className="h-3.5 bg-zinc-100 rounded w-4/5"></div>
              <div className="h-2.5 bg-zinc-100 rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-zinc-100 rounded w-1/3 pt-1"></div>
            <div className="h-8 bg-zinc-200 rounded-md w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <div className="py-20 px-4 text-center bg-zinc-50/60 border border-zinc-200 rounded-2xl max-w-xl mx-auto space-y-4">
        <PackageOpen size={36} className="mx-auto text-zinc-400 stroke-[1.5]" />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-black tracking-tight">
            No cuts found for this selection.
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            We couldn't find any cuts matching your active filters. Try clearing the cut filter or searching for another term.
          </p>
        </div>

        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    );
  }

  // Product Grid (Desktop 4 Columns)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {(products || []).map((product) => (
        <HomeProductCard key={product._id || product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductListingGrid;
