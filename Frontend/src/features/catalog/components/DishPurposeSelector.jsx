import React from 'react';
import { ChefHat } from 'lucide-react';

const COMMON_PURPOSES = [
  { id: 'all', label: 'All Cuts' },
  { id: 'Biryani Cut', label: 'Biryani Cut' },
  { id: 'Curry Cut', label: 'Curry Cut' },
  { id: 'Boneless', label: 'Boneless / Pan Fry' },
  { id: 'Keema', label: 'Keema / Mince' },
  { id: 'Steaks', label: 'Steaks & Chops' },
  { id: 'Soup Bones', label: 'Soup Bones' },
];

const DishPurposeSelector = ({
  selectedPurpose = 'all',
  onSelectPurpose,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 py-1">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider shrink-0 select-none">
        <ChefHat size={14} className="text-black" />
        <span>Culinary Purpose:</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none select-none">
        {COMMON_PURPOSES.map((item) => {
          const isSelected = selectedPurpose === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectPurpose(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-black text-white shadow-2xs font-semibold'
                  : 'bg-zinc-50 text-zinc-600 border border-zinc-200 hover:border-black hover:text-black hover:bg-white'
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

export default DishPurposeSelector;
