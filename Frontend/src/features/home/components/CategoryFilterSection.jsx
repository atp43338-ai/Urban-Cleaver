import React from 'react';
import { Layers } from 'lucide-react';

/**
 * CategoryFilterSection:
 * Dynamic meat category tabs rendered directly from backend categories.
 */
const CategoryFilterSection = ({
  categories = [],
  activeCategory = 'all',
  onSelectCategory,
}) => {
  const dynamicItems = [
    { id: 'all', label: 'All Cuts' },
    ...categories
      .filter((c) => c.isActive !== false)
      .map((c) => ({
        id: c._id || c.id,
        label: c.name,
      })),
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 uppercase tracking-wider">
        <Layers size={14} className="text-black" />
        <span>Select Meat Item</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
        {dynamicItems.map((item) => {
          const isSelected =
            activeCategory === item.id ||
            (activeCategory === 'all' && item.id === 'all');

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-black hover:text-black hover:bg-zinc-50'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilterSection;
