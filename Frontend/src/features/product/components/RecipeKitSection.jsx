import React, { useState, useEffect } from 'react';
import pantryService from '../services/pantryService';
import RecipeKitCard from './RecipeKitCard';
import { Sparkles, Utensils, Check, RotateCcw } from 'lucide-react';

/**
 * Helper to extract standard recipe keywords from cut name and product name
 */
export const resolveRecipeKeywords = (selectedCut = '', productName = '') => {
  const combined = `${selectedCut} ${productName}`.toLowerCase();

  const recipes = [];
  if (combined.includes('biryani') || combined.includes('dum')) recipes.push('Biryani');
  if (combined.includes('roast') || combined.includes('fry') || combined.includes('sukka')) {
    recipes.push('Beef Roast', 'Beef Fry');
  }
  if (combined.includes('mandi') || combined.includes('kabsa')) recipes.push('Mandi');
  if (combined.includes('curry') || combined.includes('rogan') || combined.includes('stew') || combined.includes('korma')) {
    recipes.push('Curry');
  }
  if (combined.includes('boneless') || combined.includes('steak') || combined.includes('pan')) {
    recipes.push('Pan Fry');
  }

  // Fallback defaults
  if (recipes.length === 0) {
    recipes.push('Curry', 'Biryani');
  }

  return Array.from(new Set(recipes)).join(',');
};

/**
 * RecipeKitSection:
 * Dynamic container for pre-portioned cooking add-ons matching the customer's recipe intention.
 * Smoothly hides if no items match.
 */
const RecipeKitSection = ({
  selectedCut = 'Biryani Cut',
  productName = 'Product Cut',
  onSelectedKitsChange,
}) => {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map of selected kit item ID -> { item, quantity }
  const [selectedMap, setSelectedMap] = useState({});

  const targetRecipes = resolveRecipeKeywords(selectedCut, productName);

  useEffect(() => {
    let isMounted = true;
    const loadKits = async () => {
      try {
        setLoading(true);
        const res = await pantryService.fetchPantryByRecipe(targetRecipes);
        if (isMounted) {
          const fetchedItems = res.items || [];
          setKits(fetchedItems);

          // By default, pre-select the first 2 items (e.g., spices and ghee/shallots) for convenience
          const initialSelection = {};
          fetchedItems.slice(0, 2).forEach((it) => {
            initialSelection[it._id] = { item: it, quantity: 1 };
          });
          setSelectedMap(initialSelection);
        }
      } catch (err) {
        console.error('Failed to fetch recipe kits:', err);
        if (isMounted) setKits([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadKits();
    return () => {
      isMounted = false;
    };
  }, [targetRecipes]);

  // Notify parent whenever selection changes
  useEffect(() => {
    if (onSelectedKitsChange) {
      onSelectedKitsChange(Object.values(selectedMap));
    }
  }, [selectedMap, onSelectedKitsChange]);

  const handleToggleSelect = (item) => {
    setSelectedMap((prev) => {
      const copy = { ...prev };
      if (copy[item._id]) {
        delete copy[item._id];
      } else {
        copy[item._id] = { item, quantity: 1 };
      }
      return copy;
    });
  };

  const handleQuantityChange = (itemId, newQty) => {
    setSelectedMap((prev) => {
      if (!prev[itemId]) return prev;
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          quantity: newQty,
        },
      };
    });
  };

  const handleSelectAll = () => {
    const all = {};
    kits.forEach((it) => {
      all[it._id] = { item: it, quantity: 1 };
    });
    setSelectedMap(all);
  };

  const handleDeselectAll = () => {
    setSelectedMap({});
  };

  // If loading, render elegant pulse skeleton
  if (loading) {
    return (
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-4 animate-pulse">
        <div className="h-4 bg-zinc-200 rounded w-1/3"></div>
        <div className="h-3 bg-zinc-200 rounded w-2/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="h-28 bg-zinc-200 rounded-xl"></div>
          <div className="h-28 bg-zinc-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Smoothly hide section if no items match
  if (kits.length === 0) {
    return null;
  }

  const selectedCount = Object.keys(selectedMap).length;
  const selectedKitsTotal = Object.values(selectedMap).reduce(
    (sum, entry) => sum + Number(entry.item.price) * entry.quantity,
    0
  );

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/80 pb-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shrink-0 mt-0.5">
            <Utensils size={15} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider">
                The Chef&apos;s Recipe Kit
              </h3>
              <span className="text-[10px] font-mono uppercase bg-white border border-zinc-200 px-2 py-0.5 rounded text-zinc-700 font-bold">
                Pre-Portioned for 1kg Meat
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
              Freshly prepped aromatics &amp; spices measured to cook with this cut. Zero kitchen prep.
            </p>
          </div>
        </div>

        {/* Quick Bulk Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pt-1 sm:pt-0">
          {selectedCount < kits.length ? (
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[11px] font-semibold text-zinc-600 hover:text-black underline underline-offset-2 transition cursor-pointer"
            >
              Select All ({kits.length})
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDeselectAll}
              className="text-[11px] font-semibold text-zinc-400 hover:text-black underline underline-offset-2 transition cursor-pointer"
            >
              Deselect All
            </button>
          )}
        </div>
      </div>

      {/* Grid of Selectable Micro-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {kits.map((item) => {
          const isSelected = Boolean(selectedMap[item._id]);
          const qty = selectedMap[item._id]?.quantity || 1;
          return (
            <RecipeKitCard
              key={item._id}
              item={item}
              isSelected={isSelected}
              quantity={qty}
              onToggleSelect={handleToggleSelect}
              onQuantityChange={handleQuantityChange}
            />
          );
        })}
      </div>

      {/* Live Selection Readout Strip */}
      <div className="px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-zinc-600">
          <Sparkles size={13} className="text-black" />
          <span>
            <strong className="text-black">{selectedCount}</strong> of{' '}
            <strong className="text-black">{kits.length}</strong> Recipe Kits selected
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-[11px] text-zinc-400 uppercase font-bold">Kits Total:</span>
          <span className="text-xs font-black text-black">
            +₹{selectedKitsTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecipeKitSection;
