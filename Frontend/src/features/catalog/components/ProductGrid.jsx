import React from 'react';
import ProductCard from './ProductCard';
import { PackageOpen, RefreshCw } from 'lucide-react';

const ProductGrid = ({
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
            className="bg-white border border-zinc-200 rounded-xl p-4 space-y-3 animate-pulse"
          >
            <div className="w-full aspect-4/3 rounded-lg bg-zinc-100"></div>
            <div className="h-3 bg-zinc-100 rounded w-1/4"></div>
            <div className="h-5 bg-zinc-100 rounded w-3/4"></div>
            <div className="h-8 bg-zinc-100 rounded w-full"></div>
            <div className="pt-3 border-t border-zinc-100 flex justify-between items-center">
              <div className="h-6 bg-zinc-100 rounded w-1/3"></div>
              <div className="h-9 bg-zinc-100 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center bg-zinc-50 border border-zinc-200 rounded-2xl p-8 max-w-xl mx-auto">
        <PackageOpen size={42} className="mx-auto mb-3 text-zinc-300 stroke-[1.5]" />
        <h3 className="text-base font-bold text-black tracking-tight">No butchery cuts found</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto leading-relaxed">
          We couldn't find any cuts matching your active department or culinary cut selection.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
        >
          <RefreshCw size={13} />
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default ProductGrid;
