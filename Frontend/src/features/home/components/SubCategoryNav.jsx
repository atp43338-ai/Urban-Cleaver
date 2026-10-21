import React from 'react';

/**
 * Format category name into { label, tag }
 * e.g., "Indian beef boneless" -> { label: "Indian Beef", tag: "Boneless" }
 * e.g., "Indian mutton with bone" -> { label: "Indian Mutton", tag: "Bone-in" }
 */
const formatCategoryItem = (cat) => {
  const name = cat.name || '';
  const lower = name.toLowerCase();

  let tag = null;
  let label = name;

  if (lower.includes('boneless')) {
    tag = 'Boneless';
    label = name.replace(/boneless/i, '').trim();
  } else if (lower.includes('with bone') || lower.includes('with-bone')) {
    tag = 'Bone-in';
    label = name.replace(/with[\s-]bone/i, '').trim();
  }

  return {
    id: cat._id || cat.id || cat.slug || name,
    name: cat.name,
    label,
    tag,
    rawCategory: cat,
  };
};

/**
 * SubCategoryNav:
 * Non-fixed horizontal sub-category navigation strip directly beneath the fixed dark navbar.
 * Dynamically rendered from backend categories with All Cuts default option.
 */
const SubCategoryNav = ({
  categories = [],
  activeCategoryId = 'all',
  onSelectCategory,
  className = '',
}) => {
  const dynamicItems = [
    {
      id: 'all',
      name: 'All Cuts',
      label: 'All Cuts',
      tag: null,
      isAll: true,
    },
    ...categories
      .filter((c) => c.isActive !== false)
      .map(formatCategoryItem),
  ];

  return (
    <nav
      className={`relative z-30 bg-white border-b border-zinc-200 py-2.5 px-4 sm:px-6 lg:px-8 select-none ${className}`}
      aria-label="Sub-category Navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none py-1">
        {dynamicItems.map((item) => {
          const isActive = activeCategoryId === item.id || (activeCategoryId === 'all' && item.isAll);

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
