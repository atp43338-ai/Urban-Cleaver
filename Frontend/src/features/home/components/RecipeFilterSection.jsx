import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

export const RECIPE_PURPOSE_TABS = [
  { id: 'all', label: 'All Cuts', sublabel: 'Full inventory' },
  { id: 'biryani', label: 'Biryani Special', sublabel: 'Dum & Bone-in' },
  { id: 'curry', label: 'Curry & Slow Cook', sublabel: 'Rich gravies' },
  { id: 'fry', label: 'Pan Fry & Roast', sublabel: 'Boneless & Steaks' },
  { id: 'diet', label: 'Diet & High-Protein', sublabel: 'Lean & Trimmed' },
];

/**
 * RecipeFilterSection:
 * Horizontal dish/purpose filter tabs:
 * ['All Cuts', 'Biryani Special', 'Curry & Slow Cook', 'Pan Fry & Roast', 'Diet & High-Protein']
 * Receives activeRecipe and onSelectRecipe as props.
 */
const RecipeFilterSection = ({
  activeRecipe = 'all',
  onSelectRecipe,
  totalCount,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 uppercase tracking-wider">
          <UtensilsCrossed size={14} className="text-black" />
          <span>Shop by Recipe &amp; Purpose</span>
        </div>
        {totalCount !== undefined && (
          <span className="text-[11px] font-mono text-zinc-400">
            {totalCount} {totalCount === 1 ? 'item' : 'items'} available
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none select-none">
        {RECIPE_PURPOSE_TABS.map((tab) => {
          const isActive = activeRecipe === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectRecipe && onSelectRecipe(tab.id)}
              className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-black text-white shadow-xs font-semibold'
                  : 'bg-white text-zinc-700 border border-zinc-200 hover:border-black hover:text-black hover:bg-zinc-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-300'
                    : 'bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200 group-hover:text-black'
                }`}
              >
                {tab.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RecipeFilterSection;