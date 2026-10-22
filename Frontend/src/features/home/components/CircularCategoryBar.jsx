import React, { useState } from 'react';
import { Beef, Bone, Flame, Utensils, Layers } from 'lucide-react';
import { getFullImageUrl } from '@/utils/imageUrl';

const ORDERED_CATEGORY_NAMES = [
  'Indian beef boneless',
  'Indian mutton with bone',
  'Indian mutton boneless',
  'Pakisthan beef boneless',
  'Pakisthan beef with bone',
  'Keniyan mutton with bone',
];

function getCategoryIcon(name = '') {
  const lower = name.toLowerCase();
  if (lower.includes('keniyan') || lower.includes('bone')) return Bone;
  if (lower.includes('mutton') || lower.includes('flame')) return Flame;
  if (lower.includes('pakisthan')) return Utensils;
  return Beef;
}

/**
 * CircularCategoryBar:
 * Purely dynamic circular quick-category navigation component directly beneath the HeroSection.
 * - Index 0 is always the default "All Cuts" plate.
 * - Every category from backend dynamically renders as a round plate.
 * - Renders <img src={category.image} ... className="w-full h-full rounded-full object-cover p-1 transition-transform group-hover:scale-105" />
 *   when image is present, with fallback to clean Lucide icons.
 * - As new categories are created in Admin, they immediately appear as 7th, 8th, etc., plates.
 */
const CircularCategoryBar = ({
  categories = [],
  activeId = 'all',
  onSelectCategory,
  className = '',
}) => {
  const [imageErrors, setImageErrors] = useState({});

  // Sort canonical categories first, then append any newly added categories
  const sortedCategories = [...(categories || [])].sort((a, b) => {
    const aName = (a.name || '').toLowerCase();
    const bName = (b.name || '').toLowerCase();
    const aIdx = ORDERED_CATEGORY_NAMES.findIndex((n) => n.toLowerCase() === aName);
    const bIdx = ORDERED_CATEGORY_NAMES.findIndex((n) => n.toLowerCase() === bName);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return aName.localeCompare(bName);
  });

  // Items list: Index 0 is always "All Cuts", followed by dynamic categories
  const items = [
    {
      id: 'all',
      name: 'All Cuts',
      image: null,
      icon: Layers,
      isAll: true,
    },
    ...sortedCategories.map((cat) => ({
      id: cat._id || cat.id,
      name: cat.name,
      image: cat.image,
      icon: getCategoryIcon(cat.name),
      raw: cat,
    })),
  ];

  const isItemActive = (cat) => {
    if (cat.id === 'all') {
      return !activeId || activeId === 'all';
    }
    const catId = String(cat.id || '');
    const cleanActive = String(activeId).toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanName = String(cat.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    return (
      catId === String(activeId) ||
      cleanActive === cleanName ||
      cleanName.includes(cleanActive)
    );
  };

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className={`border-b border-zinc-200 bg-white py-6 sm:py-8 select-none ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-black"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-600 font-bold">
              CURATED BUTCHERY PLATES
            </span>
          </div>
          <span className="hidden sm:inline text-[11px] font-mono text-zinc-400">
            Click to explore specialty cuts ({sortedCategories.length} Departments)
          </span>
        </div>

        {/* Circular Items Row */}
        <div className="flex items-center justify-start md:justify-between gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
          {items.map((cat) => {
            const Icon = cat.icon || Beef;
            const isSelected = isItemActive(cat);
            const hasImage = Boolean(cat.image) && !imageErrors[cat.id];

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory && onSelectCategory(cat.raw || cat)}
                className="group flex flex-col items-center gap-2.5 text-center cursor-pointer min-w-[85px] sm:min-w-[100px] shrink-0 focus:outline-none"
              >
                {/* Round Plate Rim Container */}
                <div
                  className={`relative h-20 w-20 sm:h-24 sm:w-24 rounded-full p-1 flex items-center justify-center transition-all duration-300 overflow-hidden ${
                    isSelected
                      ? 'ring-2 ring-black ring-offset-2 border-black bg-black scale-105 shadow-md'
                      : 'border border-zinc-200 bg-zinc-50 hover:border-black hover:scale-105 hover:shadow-sm'
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-zinc-100 relative">
                    {hasImage ? (
                      <img
                        src={getFullImageUrl(cat.image)}
                        alt={cat.name}
                        onError={() => handleImageError(cat.id)}
                        className="w-full h-full rounded-full object-cover p-1 transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center transition-colors duration-300 ${
                          isSelected
                            ? 'bg-zinc-900 text-white'
                            : 'bg-zinc-100 text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white'
                        }`}
                      >
                        <Icon size={24} className="stroke-[1.75]" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Name Label */}
                <span
                  className={`text-xs sm:text-[13px] font-semibold tracking-tight transition-colors line-clamp-1 capitalize ${
                    isSelected ? 'text-black font-bold' : 'text-zinc-700 group-hover:text-black'
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
