import React from 'react';
import { Layers } from 'lucide-react';

export const BASE_MEAT_ITEMS = [
  { id: 'all', label: 'All Cuts', keyword: '' },
  { id: 'indian-beef-boneless', label: 'Indian Beef Boneless', keyword: 'Indian Beef Boneless' },
  { id: 'indian-mutton-bone', label: 'Indian Mutton With Bone', keyword: 'Indian Mutton with Bone' },
  { id: 'indian-mutton-boneless', label: 'Indian Mutton Boneless', keyword: 'Indian Mutton Boneless' },
  { id: 'pakistan-beef-boneless', label: 'Pakisthan Beef Boneless', keyword: 'Pakisthan Beef Boneless' },
  { id: 'pakistan-beef-bone', label: 'Pakisthan Beef With Bone', keyword: 'Pakisthan Beef with Bone' },
  { id: 'kenyan-mutton-bone', label: 'Keniyan Mutton With Bone', keyword: 'Keniyan Mutton with Bone' },
];

/**
 * CategoryFilterSection:
 * Filters strictly by base meat origin and bone-in / boneless specification.
 */
const CategoryFilterSection = ({
  activeCategory = 'all',
  onSelectCategory,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 uppercase tracking-wider">
        <Layers size={14} className="text-black" />
        <span>Select Meat Item</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
        {BASE_MEAT_ITEMS.map((item) => {
          const isSelected = activeCategory === item.id;
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