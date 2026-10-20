import React from 'react';
import { Layers } from 'lucide-react';

/**
 * CategoryFilterSection:
 * Meat species selector tabs: All, Mutton (Pakistani & Indian), Prime Beef, Farm Chicken.
 * Receives activeCategory and onSelectCategory as props.
 */
const CategoryFilterSection = ({
  categories = [],
  activeCategory = 'all',
  onSelectCategory,
}) => {
  const hasDynamicCategories = Array.isArray(categories) && categories.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 uppercase tracking-wider">
        <Layers size={14} className="text-black" />
        <span>Select Meat Department</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
        {/* All Departments Tab */}
        <button
          type="button"
          onClick={() => onSelectCategory && onSelectCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
            activeCategory === 'all'
              ? 'bg-black text-white shadow-xs'
              : 'bg-white text-zinc-700 border border-zinc-200 hover:border-black hover:text-black hover:bg-zinc-50'
          }`}
        >
          All Cuts
        </button>

        {hasDynamicCategories ? (
          categories.map((cat) => {
            const id = cat._id || cat.id || cat.name;
            const isSelected = activeCategory === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelectCategory && onSelectCategory(id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-white text-zinc-700 border border-zinc-200 hover:border-black hover:text-black hover:bg-zinc-50'
                }`}
              >
                {cat.name}
              </button>
            );
          })
        ) : (
          /* Default species tabs fallback */
          <>
            <button
              type="button"
              onClick={() => onSelectCategory && onSelectCategory('mutton')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                activeCategory === 'mutton'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white text-zinc-700 border border-zinc-200 hover:border-black hover:text-black hover:bg-zinc-50'
              }`}
            >
              Pakistani &amp; Indian Mutton
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory && onSelectCategory('beef')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                activeCategory === 'beef'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white text-zinc-700 border border-zinc-200 hover:border-black hover:text-black hover:bg-zinc-50'
              }`}
            >
              Choice Beef
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory && onSelectCategory('chicken')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                activeCategory === 'chicken'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white text-zinc-700 border border-zinc-200 hover:border-black hover:text-black hover:bg-zinc-50'
              }`}
            >
              Farm Fresh Chicken
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryFilterSection;