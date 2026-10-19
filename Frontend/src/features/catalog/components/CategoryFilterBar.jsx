import React from 'react';
import { Layers } from 'lucide-react';

const CategoryFilterBar = ({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  loading = false,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
      <button
        type="button"
        onClick={() => onSelectCategory('all')}
        className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
          selectedCategory === 'all'
            ? 'bg-black text-white shadow-xs'
            : 'bg-white text-zinc-700 border border-zinc-200 hover:border-black hover:text-black'
        }`}
      >
        All Departments
      </button>

      {categories.map((cat) => {
        const id = cat._id || cat.id;
        const isSelected = selectedCategory === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelectCategory(id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
              isSelected
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-zinc-700 border border-zinc-200 hover:border-black hover:text-black'
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilterBar;
