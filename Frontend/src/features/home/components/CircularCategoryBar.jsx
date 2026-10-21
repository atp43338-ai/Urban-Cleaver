import React from 'react';
import { Beef, Bone, Flame, Utensils, Layers, CircleDot } from 'lucide-react';
import { getFullImageUrl } from '@/utils/imageUrl';

/**
 * Helper to determine an icon fallback if category has no image
 */
const getCategoryIconFallback = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('beef')) return Beef;
  if (lower.includes('mutton') || lower.includes('goat') || lower.includes('lamb')) return Bone;
  if (lower.includes('chicken') || lower.includes('poultry')) return Flame;
  if (lower.includes('mince') || lower.includes('keema')) return CircleDot;
  return Utensils;
};

/**
 * CircularCategoryBar:
 * Purely dynamic circular quick-category navigation component directly beneath the HeroSection.
 * Renders "All Cuts" at index 0, followed dynamically by all backend categories.
 * Renders uploaded image thumbnail inside circular plate, with graceful Lucide icon fallback.
 */
const CircularCategoryBar = ({
  categories = [],
  activeId = 'all',
  onSelectCategory,
  className = '',
}) => {
  // Construct dynamic list: All Cuts + Categories from Database
  const displayItems = [
    {
      _id: 'all',
      name: 'All Cuts',
      image: null,
      isAll: true,
    },
    ...categories.filter((c) => c.isActive !== false),
  ];

  return (
    <section className={`border-b border-zinc-200 bg-white py-6 sm:py-8 select-none ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Hint */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
              CURATED BUTCHERY SHOWCASE
            </span>
          </div>
          <span className="hidden sm:inline text-[11px] font-mono text-zinc-400">
            Click to explore specialty cuts
          </span>
        </div>

        {/* Circular Items Row */}
        <div className="flex items-center justify-start md:justify-between gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
          {displayItems.map((cat) => {
            const catId = cat._id || cat.id || cat.name;
            const isSelected = activeId === catId || (activeId === 'all' && cat.isAll);
            const FallbackIcon = cat.isAll ? Layers : getCategoryIconFallback(cat.name);
            const hasImage = Boolean(cat.image);

            return (
              <button
                key={catId}
                type="button"
                onClick={() => onSelectCategory && onSelectCategory(cat)}
                className="group flex flex-col items-center gap-2.5 text-center cursor-pointer min-w-[90px] sm:min-w-[105px] shrink-0 focus:outline-none"
              >
                {/* Circle Container (Luxury Plate Rim) */}
                <div
                  className={`relative h-20 w-20 sm:h-24 sm:w-24 rounded-full p-1.5 flex items-center justify-center transition-all duration-300 overflow-hidden ${
                    isSelected
                      ? 'ring-2 ring-black ring-offset-2 border-black bg-zinc-950 text-white scale-105 shadow-md'
                      : 'border border-zinc-300 bg-zinc-50 text-zinc-800 hover:border-black hover:scale-105 hover:shadow-md'
                  }`}
                >
                  <div
                    className={`w-full h-full rounded-full flex flex-col items-center justify-center border transition-colors duration-300 overflow-hidden ${
                      isSelected
                        ? 'border-zinc-800 bg-zinc-900 text-white'
                        : 'border-zinc-200/80 bg-zinc-100 group-hover:bg-zinc-900 group-hover:border-zinc-800 group-hover:text-white'
                    }`}
                  >
                    {hasImage ? (
                      <img
                        src={getFullImageUrl(cat.image)}
                        alt={cat.name}
                        className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}

                    <div
                      className={`${
                        hasImage ? 'hidden' : 'flex'
                      } items-center justify-center w-full h-full`}
                    >
                      <FallbackIcon
                        size={24}
                        className="transition-transform duration-300 group-hover:scale-110 stroke-[1.75]"
                      />
                    </div>
                  </div>
                </div>

                {/* Name Label */}
                <span
                  className={`text-xs sm:text-[13px] font-semibold tracking-tight transition-colors line-clamp-1 max-w-[110px] ${
                    isSelected ? 'text-black font-bold' : 'text-zinc-800 group-hover:text-black'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CircularCategoryBar;
