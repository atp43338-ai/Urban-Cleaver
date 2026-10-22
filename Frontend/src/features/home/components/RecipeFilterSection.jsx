import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

export const DEFAULT_CULINARY_CUTS = [
  { id: 'all', label: 'All Cuts', sublabel: 'Full Selection' },
  { id: 'beef-keema', label: 'Beef Keema', sublabel: 'Mince' },
  { id: 'mutton-keema', label: 'Mutton Keema', sublabel: 'Mince' },
  { id: 'beef-cube', label: 'Beef Cube', sublabel: 'Stew / Curry' },
  { id: 'beef-kurma', label: 'Beef Kurma', sublabel: 'Slow Cook' },
  { id: 'biriyani-cutting', label: 'Biriyani Cutting', sublabel: 'Dum Pieces' },
  { id: 'saloona-cutting', label: 'Saloona Cutting', sublabel: 'Arabic Stew' },
  { id: 'finger-cutting', label: 'Finger Cutting', sublabel: 'French Fries Cut' },
  { id: 'beef-pasantha', label: 'Beef Pasantha', sublabel: 'Thin Cut' },
  { id: 'burger', label: 'Burger', sublabel: 'Patty Cut' },
  { id: 'kebab-cutting', label: 'Kebab Cutting', sublabel: 'Skewer / Boti' },
];

/**
 * RecipeFilterSection:
 * Dynamic cut tabs synchronized with backend Cut database.
 * Filters strictly by kitchen preparation cut styles and cooking purposes.
 */
const RecipeFilterSection = ({
  cuts = [],
  activeRecipe = 'all',
  onSelectRecipe,
  totalCount,
}) => {
  // Build items dynamically from backend cuts if available, otherwise fallback
  let tabs = [];
  if (cuts && cuts.length > 0) {
    tabs = [
      { id: 'all', label: 'All Cuts', sublabel: 'Full Selection' },
      ...cuts.map((c) => ({
        id: c.slug || c._id || c.name,
        label: c.name,
        sublabel: c.sublabel || 'Culinary Cut',
        raw: c,
      })),
    ];
  } else {
    tabs = DEFAULT_CULINARY_CUTS;
  }

  const isTabActive = (tab) => {
    if (tab.id === 'all') {
      return !activeRecipe || activeRecipe === 'all';
    }
    const cleanActive = String(activeRecipe).toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanId = String(tab.id).toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanLabel = String(tab.label).toLowerCase().replace(/[^a-z0-9]/g, '');

    return (
      activeRecipe === tab.id ||
      cleanActive === cleanId ||
      cleanActive === cleanLabel ||
      cleanLabel.includes(cleanActive)
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 uppercase tracking-wider">
          <UtensilsCrossed size={14} className="text-black" />
          <span>Shop by Cut Style</span>
        </div>
        {totalCount !== undefined && (
          <span className="text-[11px] font-mono text-zinc-400">
            {totalCount} {totalCount === 1 ? 'cut' : 'cuts'} available
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none select-none">
        {tabs.map((tab) => {
          const isActive = isTabActive(tab);

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
              {tab.sublabel && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-300'
                      : 'bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200 group-hover:text-black'
                  }`}
                >
                  {tab.sublabel}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RecipeFilterSection;
