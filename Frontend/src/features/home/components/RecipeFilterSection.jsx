import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

export const DEFAULT_CUT_TABS = [
  { id: 'all', label: 'All Cuts', sublabel: 'Full Selection', name: 'All Cuts' },
  { id: 'beef-keema', label: 'Beef Keema', sublabel: 'Mince', name: 'Beef Keema' },
  { id: 'mutton-keema', label: 'Mutton Keema', sublabel: 'Mince', name: 'Mutton Keema' },
  { id: 'beef-cube', label: 'Beef Cube', sublabel: 'Stew / Curry', name: 'Beef Cube' },
  { id: 'beef-kurma', label: 'Beef Kurma', sublabel: 'Slow Cook', name: 'Beef Kurma' },
  { id: 'biriyani-cutting', label: 'Biriyani Cutting', sublabel: 'Dum Pieces', name: 'Biriyani cutting' },
  { id: 'saloona-cutting', label: 'Saloona Cutting', sublabel: 'Arabic Stew', name: 'Saloona cutting' },
  { id: 'finger-cutting', label: 'Finger Cutting', sublabel: 'French Fries Cut', name: 'Finger cutting (French fries)' },
  { id: 'beef-pasantha', label: 'Beef Pasantha', sublabel: 'Thin Cut', name: 'Beef pasantha' },
  { id: 'burger', label: 'Burger', sublabel: 'Patty Cut', name: 'Burger' },
  { id: 'kebab-cutting', label: 'Kebab Cutting', sublabel: 'Skewer / Boti', name: 'Kebab cutting' },
];

/**
 * RecipeFilterSection:
 * Dynamic horizontal filter tabs listing culinary cut preparation styles.
 * Renders dynamically from backend cuts API with fallback support.
 */
const RecipeFilterSection = ({
  cuts = [],
  activeRecipe = 'all',
  onSelectRecipe,
  totalCount,
}) => {
  // Construct dynamic cut tabs
  const tabs = [
    { id: 'all', label: 'All Cuts', sublabel: 'Full Selection', name: 'all' },
    ...(Array.isArray(cuts) && cuts.length > 0
      ? cuts
          .filter((c) => c.isActive !== false)
          .map((c) => ({
            id: c._id || c.name,
            label: c.name,
            sublabel: c.sublabel || c.targetMeat || 'Cut Style',
            name: c.name,
          }))
      : DEFAULT_CUT_TABS.slice(1)),
  ];

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
        {tabs.map((tab) => {
          const isActive =
            activeRecipe === tab.id ||
            activeRecipe === tab.name ||
            (activeRecipe === 'all' && tab.id === 'all');

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectRecipe && onSelectRecipe(tab.id === 'all' ? 'all' : tab.name)}
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
