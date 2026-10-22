import React from 'react';
import { UtensilsCrossed, Search, X, RotateCcw, ArrowUpDown, Filter } from 'lucide-react';

const DEFAULT_CUTS = [
  { id: 'all', label: 'All Cuts', sublabel: 'Full Selection' },
  { id: 'beef-keema', label: 'Beef Keema', sublabel: 'Mince' },
  { id: 'mutton-keema', label: 'Mutton Keema', sublabel: 'Mince' },
  { id: 'beef-cube', label: 'Beef Cube', sublabel: 'Stew / Curry' },
  { id: 'beef-kurma', label: 'Beef Kurma', sublabel: 'Slow Cook' },
  { id: 'biriyani-cutting', label: 'Biriyani Cutting', sublabel: 'Dum Pieces' },
  { id: 'saloona-cutting', label: 'Saloona Cutting', sublabel: 'Arabic Stew' },
  { id: 'finger-cutting', label: 'Finger Cutting', sublabel: 'French Fries Cut' },
  { id: 'beef-pasantha', label: 'Beef Pasantha', sublabel: 'Thin Cut' },
  { id: 'burger', label: 'Burger', sublabel: 'Patty Cut' },
  { id: 'kebab-cutting', label: 'Kebab Cutting', sublabel: 'Skewer / Boti' },
];

/**
 * ProductListingFilters:
 * Multi-dimensional filters for product catalog:
 * - Quick culinary cut style filter pills
 * - In-catalog keyword search
 * - In-stock filter toggle
 * - Price sorting (featured, price asc/desc)
 * - Reset filter action
 */
const ProductListingFilters = ({
  cuts = [],
  activeCut = 'all',
  onSelectCut,
  search = '',
  onSearchChange,
  inStockOnly = false,
  onToggleInStock,
  sortBy = 'featured',
  onSortChange,
  onResetFilters,
  hasActiveFilters = false,
}) => {
  // Normalize cut tabs from backend cuts or fallback
  const cutTabs =
    Array.isArray(cuts) && cuts.length > 0
      ? [
          { id: 'all', label: 'All Cuts', sublabel: 'Full Selection' },
          ...(cuts || []).map((c) => ({
            id: c.slug || c.name,
            label: c.name,
            sublabel: c.sublabel || 'Culinary Cut',
          })),
        ]
      : DEFAULT_CUTS;

  const isCutActive = (tabId) => {
    if (tabId === 'all') return !activeCut || activeCut === 'all';
    const cleanActive = String(activeCut).toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanTab = String(tabId).toLowerCase().replace(/[^a-z0-9]/g, '');
    return activeCut === tabId || cleanActive === cleanTab || cleanTab.includes(cleanActive);
  };

  return (
    <div className="space-y-4 mb-8 text-left">
      {/* Control Bar: Search, Stock, Sort & Reset */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-50 border border-zinc-200 p-3 rounded-xl">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search within cuts (e.g. mince, shank, dum)..."
            value={search}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full h-8 pl-8 pr-7 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black transition"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange && onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black p-0.5 cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Secondary Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* In-Stock Toggle */}
          <button
            type="button"
            onClick={onToggleInStock}
            className={`h-8 px-3 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition cursor-pointer select-none ${
              inStockOnly
                ? 'bg-black text-white border-black font-semibold'
                : 'bg-white text-zinc-700 border-zinc-200 hover:border-black'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                inStockOnly ? 'bg-white' : 'bg-emerald-500'
              }`}
            ></span>
            <span>In Stock Only</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => onSortChange && onSortChange(e.target.value)}
              className="h-8 pl-7 pr-3 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-black cursor-pointer font-medium appearance-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
            <ArrowUpDown
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              title="Reset all filters"
              className="h-8 px-2.5 bg-white border border-zinc-200 text-zinc-600 hover:text-black hover:border-black rounded-lg text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Culinary Cut Filter Strip */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
          <UtensilsCrossed size={13} className="text-black" />
          <span>Filter by Culinary Cut Style</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none select-none">
          {cutTabs.map((tab) => {
            const active = isCutActive(tab.id);

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectCut && onSelectCut(tab.id)}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shrink-0 border ${
                  active
                    ? 'bg-black text-white border-black font-semibold shadow-xs'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-black hover:text-black hover:bg-zinc-50'
                }`}
              >
                <span>{tab.label}</span>
                {tab.sublabel && (
                  <span
                    className={`text-[9px] font-mono px-1 py-0.5 rounded ${
                      active
                        ? 'bg-zinc-800 text-zinc-300'
                        : 'bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200 group-hover:text-black'
                    }`}
                  >
                    {tab.sublabel}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductListingFilters;
