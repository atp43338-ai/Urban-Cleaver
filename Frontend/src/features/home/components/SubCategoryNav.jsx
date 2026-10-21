import React from 'react';

export const SUB_CATEGORIES = [
  { id: 'all', label: 'All Cuts', tag: null, keyword: '' },
  { id: 'indian-beef-boneless', label: 'Indian Beef', tag: 'Boneless', keyword: 'Indian Beef Boneless' },
  { id: 'indian-mutton-bone', label: 'Indian Mutton', tag: 'Bone-in', keyword: 'Indian Mutton with Bone' },
  { id: 'indian-mutton-boneless', label: 'Indian Mutton', tag: 'Boneless', keyword: 'Indian Mutton Boneless' },
  { id: 'pakistan-beef-boneless', label: 'Pakistan Beef', tag: 'Boneless', keyword: 'Pakistan Beef Boneless' },
  { id: 'pakistan-beef-bone', label: 'Pakistan Beef', tag: 'Bone-in', keyword: 'Pakistan Beef with Bone' },
  { id: 'kenyan-mutton-bone', label: 'Kenyan Mutton', tag: 'Bone-in', keyword: 'Kenyan Mutton with Bone' },
];

/**
 * SubCategoryNav:
 * Non-fixed horizontal sub-category navigation strip directly beneath the fixed dark navbar.
 * - Minimal two-tier display: Clean Meat Title + Compact Micro Badge (Boneless / Bone-in)
 * - Space-efficient & zero clutter on mobile/desktop screens.
 */
const SubCategoryNav = ({
  activeCategoryId = 'all',
  onSelectCategory,
  className = '',
}) => {
  return (
    <nav
      className={`relative z-30 bg-white border-b border-zinc-200 py-2.5 px-4 sm:px-6 lg:px-8 select-none ${className}`}
      aria-label="Sub-category Navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none py-1">
        {SUB_CATEGORIES.map((item) => {
          const isActive = activeCategoryId === item.id;

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