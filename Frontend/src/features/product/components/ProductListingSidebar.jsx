import React, { useState, useEffect } from 'react';
import { Tag, SlidersHorizontal, RotateCcw, Check, ArrowRight } from 'lucide-react';

const DEFAULT_CUTS = [
  { id: 'all', label: 'All Cuts' },
  { id: 'beef-keema', label: 'Beef Keema' },
  { id: 'biriyani-cutting', label: 'Biriyani Cutting' },
  { id: 'saloona-cutting', label: 'Saloona Cutting' },
  { id: 'beef-cube', label: 'Beef Cube' },
  { id: 'beef-kurma', label: 'Beef Kurma' },
  { id: 'finger-cutting', label: 'Finger Cutting' },
  { id: 'beef-pasantha', label: 'Beef Pasantha' },
  { id: 'burger', label: 'Burger' },
  { id: 'kebab-cutting', label: 'Kebab Cutting' },
];

/**
 * ProductListingSidebar:
 * Sticky filter sidebar inspired by modern butcher shop e-commerce layouts.
 * - Interactive Price Range slider with real-time feedback
 * - Red accent "FILTER" action button
 * - Culinary cut tags with active toggle state
 * - Clear all filters action
 */
const ProductListingSidebar = ({
  priceRange = [0, 1000],
  setPriceRange,
  selectedCut = 'all',
  setSelectedCut,
  onApplyFilter,
  onResetFilters,
  cuts = [],
  inStockOnly = false,
  setInStockOnly,
  maxAvailablePrice = 1200,
}) => {
  // Local state for the price slider before clicking "Filter"
  const [localMaxPrice, setLocalMaxPrice] = useState(priceRange[1] || 1000);
  const [localMinPrice, setLocalMinPrice] = useState(priceRange[0] || 0);

  useEffect(() => {
    setLocalMinPrice(priceRange[0] || 0);
    setLocalMaxPrice(priceRange[1] || 1000);
  }, [priceRange]);

  // Merge backend cuts with default cuts
  const availableCuts =
    Array.isArray(cuts) && cuts.length > 0
      ? [
          { id: 'all', label: 'All Cuts' },
          ...(cuts || []).map((c) => ({
            id: c.slug || c._id || c.name,
            label: c.name,
          })),
        ]
      : DEFAULT_CUTS;

  const handleApplyPriceFilter = (e) => {
    e?.preventDefault();
    const newRange = [Number(localMinPrice), Number(localMaxPrice)];
    if (setPriceRange) setPriceRange(newRange);
    if (onApplyFilter) onApplyFilter(newRange);
  };

  const handleCutToggle = (cutId) => {
    if (!setSelectedCut) return;
    if (selectedCut === cutId || (cutId === 'all' && selectedCut === 'all')) {
      setSelectedCut('all');
    } else {
      setSelectedCut(cutId);
    }
  };

  const isCutActive = (cutId) => {
    if (cutId === 'all') return !selectedCut || selectedCut === 'all';
    const cleanActive = String(selectedCut).toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanId = String(cutId).toLowerCase().replace(/[^a-z0-9]/g, '');
    return selectedCut === cutId || cleanActive === cleanId || cleanId.includes(cleanActive);
  };

  const hasActiveFilters =
    (selectedCut && selectedCut !== 'all') ||
    localMaxPrice < maxAvailablePrice ||
    localMinPrice > 0 ||
    inStockOnly;

  return (
    <div className="sticky top-24 self-start space-y-6 text-left">
      {/* 1. Price Filter Card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-black" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">
              Filter by Price
            </h3>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-[11px] font-mono text-zinc-400 hover:text-black flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw size={10} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Range Slider */}
        <div className="space-y-3 pt-1">
          <div className="relative">
            <input
              type="range"
              min={0}
              max={maxAvailablePrice}
              step={20}
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#b91c1c]"
            />
          </div>

          {/* Price Label & Action Button Row */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-zinc-700 font-mono">
              Price: <strong className="text-black">₹{localMinPrice}</strong> — <strong className="text-black">₹{localMaxPrice}</strong>
            </span>

            <button
              type="button"
              onClick={handleApplyPriceFilter}
              className="bg-[#b91c1c] text-white px-4 py-1.5 rounded-md text-xs font-bold uppercase hover:bg-red-800 transition active:scale-95 cursor-pointer shadow-xs"
            >
              Filter
            </button>
          </div>
        </div>

        {/* In-Stock Filter Toggle */}
        {setInStockOnly && (
          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-xs text-zinc-600 font-medium">In Stock Only</span>
            <button
              type="button"
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                inStockOnly ? 'bg-black' : 'bg-zinc-200'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  inStockOnly ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* 2. Product Tags / Culinary Cut Filter Card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <Tag size={15} className="text-black" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">
              Product Tags
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">
            {availableCuts.length - 1} Cuts
          </span>
        </div>

        {/* Tag Pills Grid */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {availableCuts.map((cut) => {
            const active = isCutActive(cut.id);

            return (
              <button
                key={cut.id}
                type="button"
                onClick={() => handleCutToggle(cut.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer flex items-center gap-1.5 select-none ${
                  active
                    ? 'bg-black text-white border-black font-semibold shadow-xs'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-black hover:text-black hover:bg-white'
                }`}
              >
                <span>{cut.label}</span>
                {active && <Check size={11} className="stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Butcher Standard Assurance Micro-Card */}
      <div className="p-4 bg-zinc-100/70 border border-zinc-200 rounded-xl text-left space-y-1.5">
        <p className="text-xs font-bold text-zinc-900 uppercase tracking-tight">
          The Cleaver Standard
        </p>
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          Order 1000g, cook 1000g. Guaranteed zero wastage from skin, gristle, or excess bone.
        </p>
      </div>
    </div>
  );
};

export default ProductListingSidebar;
