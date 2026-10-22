import React from 'react';
import { Layers } from 'lucide-react';

const ORDERED_CATEGORY_NAMES = [
  'Indian beef boneless',
  'Indian mutton with bone',
  'Indian mutton boneless',
  'Pakisthan beef boneless',
  'Pakisthan beef with bone',
  'Keniyan mutton with bone',
];

const DEFAULT_FALLBACK_CATEGORIES = [
  { id: 'indian-beef-boneless', name: 'Indian beef boneless' },
  { id: 'indian-mutton-with-bone', name: 'Indian mutton with bone' },
  { id: 'indian-mutton-boneless', name: 'Indian mutton boneless' },
  { id: 'pakisthan-beef-boneless', name: 'Pakisthan beef boneless' },
  { id: 'pakisthan-beef-with-bone', name: 'Pakisthan beef with bone' },
  { id: 'keniyan-mutton-with-bone', name: 'Keniyan mutton with bone' },
];

/**
 * CategoryFilterSection:
 * Dynamic filter pills for base meat departments.
 * Synchronized with MongoDB Category IDs and resilient to string slugs.
 */
const CategoryFilterSection = ({
  categories = [],
  activeCategory = 'all',
  onSelectCategory,
}) => {
  // Use provided categories or fallback
  const rawList = Array.isArray(categories) && categories.length > 0 ? categories : DEFAULT_FALLBACK_CATEGORIES;

  // Sort according to canonical base order
  const sorted = [...rawList].sort((a, b) => {
    const aName = (a.name || '').toLowerCase();
    const bName = (b.name || '').toLowerCase();
    const aIdx = ORDERED_CATEGORY_NAMES.findIndex((n) => n.toLowerCase() === aName);
    const bIdx = ORDERED_CATEGORY_NAMES.findIndex((n) => n.toLowerCase() === bName);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return aName.localeCompare(bName);
  });

  const isItemActive = (cat) => {
    if (!activeCategory || activeCategory === 'all') return false;
    const catId = String(cat._id || cat.id || '');
    const cleanActive = String(activeCategory).toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanName = String(cat.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanSlug = String(cat.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    return (
      catId === String(activeCategory) ||
      cleanActive === cleanName ||
      cleanActive === cleanSlug ||
      cleanName.includes(cleanActive)
    );
  };

  const isAllActive = !activeCategory || activeCategory === 'all';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 uppercase tracking-wider">
        <Layers size={14} className="text-black" />
        <span>Select Meat Department</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none select-none">
        {/* All Cuts Tab */}
        <button
          type="button"
          onClick={() => onSelectCategory && onSelectCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 border ${
            isAllActive
              ? 'bg-black text-white border-black shadow-xs'
              : 'bg-white text-zinc-700 border-zinc-200 hover:border-black hover:text-black hover:bg-zinc-50'
          }`}
        >
          All Cuts
        </button>

        {/* Dynamic Category Tabs */}
        {sorted.map((cat) => {
          const catId = cat._id || cat.id;
          const isActive = isItemActive(cat);

          return (
            <button
              key={catId || cat.name}
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(catId)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-black hover:text-black hover:bg-zinc-50'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilterSection;
