import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

export const CULINARY_CUT_TABS = [
  { id: 'all', label: 'All Cuts', sublabel: 'Full Selection', keyword: '' },
  { id: 'beef-keema', label: 'Beef Keema', sublabel: 'Mince', keyword: 'Beef Keema' },
  { id: 'mutton-keema', label: 'Mutton Keema', sublabel: 'Mince', keyword: 'Mutton Keema' },
  { id: 'beef-cube', label: 'Beef Cube', sublabel: 'Stew / Curry', keyword: 'Beef Cube' },
  { id: 'beef-kurma', label: 'Beef Kurma', sublabel: 'Slow Cook', keyword: 'Beef Kurma' },
  { id: 'biriyani-cutting', label: 'Biriyani Cutting', sublabel: 'Dum Pieces', keyword: 'Biriyani' },
  { id: 'saloona-cutting', label: 'Saloona Cutting', sublabel: 'Arabic Stew', keyword: 'Saloona' },
  { id: 'finger-cutting', label: 'Finger Cutting', sublabel: 'French Fries Cut', keyword: 'Finger' },
  { id: 'beef-pasantha', label: 'Beef Pasantha', sublabel: 'Thin Cut', keyword: 'Pasantha' },
  { id: 'burger', label: 'Burger', sublabel: 'Patty Cut', keyword: 'Burger' },
  { id: 'kebab-cutting', label: 'Kebab Cutting', sublabel: 'Skewer / Boti', keyword: 'Kebab' },
];

/**
 * RecipeFilterSection:
 * Filters strictly by kitchen preparation cut styles.
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
          <span>Shop by Cut Style</span>
        </div>
        {totalCount !== undefined && (
          <span className="text-[11px] font-mono text-zinc-400">
            {totalCount} {totalCount === 1 ? 'item' : 'items'} available
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none select-none">
        {CULINARY_CUT_TABS.map((tab) => {
          const isActive = activeRecipe === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectRecipe && onSelectRecipe(tab.id)}
              className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-black text-white border-black shadow-xs font-semibold'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-black hover:text-black hover:bg-zinc-50'
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