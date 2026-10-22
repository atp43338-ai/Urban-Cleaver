import React from 'react';

const ORDERED_CATEGORY_NAMES = [
  'Indian beef boneless',
  'Indian mutton with bone',
  'Indian mutton boneless',
  'Pakisthan beef boneless',
  'Pakisthan beef with bone',
  'Keniyan mutton with bone',
];

const DEFAULT_SUB_ITEMS = [
  { id: 'all', label: 'All Cuts', tag: null },
  { id: 'indian-beef-boneless', label: 'Indian Beef', tag: 'Boneless' },
  { id: 'indian-mutton-with-bone', label: 'Indian Mutton', tag: 'Bone-in' },
  { id: 'indian-mutton-boneless', label: 'Indian Mutton', tag: 'Boneless' },
  { id: 'pakisthan-beef-boneless', label: 'Pakisthan Beef', tag: 'Boneless' },
  { id: 'pakisthan-beef-with-bone', label: 'Pakisthan Beef', tag: 'Bone-in' },
  { id: 'keniyan-mutton-with-bone', label: 'Keniyan Mutton', tag: 'Bone-in' },
];

/**
 * SubCategoryNav:
 * Non-fixed horizontal sub-category navigation strip directly beneath the fixed dark navbar.
 * - Minimal two-tier display: Clean Meat Title + Compact Micro Badge (Boneless / Bone-in)
 * - Automatically derives items from dynamic backend categories with resilient fallback.
 */
const SubCategoryNav = ({
  categories = [],
  activeCategoryId = 'all',
  onSelectCategory,
  className = '',
}) => {
  let navItems = [];

  if (categories && categories.length > 0) {
    const sortedCats = [...categories].sort((a, b) => {
      const aName = (a.name || '').toLowerCase();
      const bName = (b.name || '').toLowerCase();
      const aIdx = ORDERED_CATEGORY_NAMES.findIndex((n) => n.toLowerCase() === aName);
      const bIdx = ORDERED_CATEGORY_NAMES.findIndex((n) => n.toLowerCase() === bName);
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return aName.localeCompare(bName);
    });

    navItems = [
      { id: 'all', label: 'All Cuts', tag: null, isAll: true },
      ...sortedCats.map((cat) => {
        const name = cat.name || '';
        const isBoneless = name.toLowerCase().includes('boneless');
        const hasBone = name.toLowerCase().includes('bone');
        const tag = isBoneless ? 'Boneless' : hasBone ? 'Bone-in' : null;

        // Clean label: e.g. "Indian Beef", "Pakisthan Beef", "Keniyan Mutton"
        const cleanLabel = name
          .replace(/boneless/gi, '')
          .replace(/with bone/gi, '')
          .replace(/bone-in/gi, '')
          .trim();

        return {
          id: cat._id || cat.id,
          label: cleanLabel || name,
          tag,
          raw: cat,
        };
      }),
    ];
  } else {
    navItems = DEFAULT_SUB_ITEMS;
  }

  const isItemActive = (item) => {
    if (item.id === 'all') {
      return !activeCategoryId || activeCategoryId === 'all';
    }
    const catId = String(item.id || '');
    const cleanActive = String(activeCategoryId).toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanLabel = String(item.label || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const rawName = String(item.raw?.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    return (
      catId === String(activeCategoryId) ||
      cleanActive === cleanLabel ||
      cleanActive === rawName ||
      rawName.includes(cleanActive)
    );
  };

  return (
    <nav
      className={`relative z-30 bg-white border-b border-zinc-200 py-2.5 px-4 sm:px-6 lg:px-8 select-none ${className}`}
      aria-label="Sub-category Navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none py-1">
        {navItems.map((item) => {
          const isActive = isItemActive(item);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(item)}
              className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer border ${
                isActive
                  ? 'bg-black text-white border-black shadow-sm'
                  : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-400 hover:bg-zinc-100'
              }`}
            >
              {/* Category Label */}
              <span className="text-xs sm:text-[13px] font-semibold tracking-wide uppercase">
                {item.label}
              </span>

              {/* Minimal Cut Badge */}
              {item.tag && (
                <span
                  className={`text-[9px] sm:text-[10px] font-mono uppercase px-1.5 py-0.5 rounded tracking-wider ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                      : 'bg-white text-zinc-600 border border-zinc-200 group-hover:border-zinc-300'
                  }`}
                >
                  {item.tag}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default SubCategoryNav;
