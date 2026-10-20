import React, { useState } from 'react';
import { Sparkles, Plus, Check, ShoppingBag, Utensils } from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_PAIRINGS = [
  {
    id: 'ghee',
    name: 'A2 Vedic Bilona Cow Ghee (100ml)',
    description: 'Slow-simmered artisanal cow ghee for royal aroma and moisture retention.',
    price: 95,
  },
  {
    id: 'spices',
    name: 'Whole Biryani / Curry Spices Potli',
    description: 'Black cardamom, star anise, stone flower (dagad phool), mace & green elaichi.',
    price: 65,
  },
  {
    id: 'rice',
    name: 'Aged Kaima / Jeerakasala Short Grain Rice (1kg)',
    description: 'Fragrant premium heritage rice, aged 18 months for non-sticky dum rice.',
    price: 140,
  },
];

/**
 * ChefPairingsSection:
 * Checkbox add-ons tailored to the recipe (Ghee, Spices, Rice).
 * Allows 1-click addition of cut + selected add-ons with dynamic price tally.
 */
const ChefPairingsSection = ({
  meatProductName = 'Artisanal Cut',
  meatPrice = 0,
  meatQuantity = 1,
  selectedCut = 'Curry Cut',
  onAddWithPairings,
}) => {
  const [selectedAddonIds, setSelectedAddonIds] = useState(['ghee', 'spices']);

  const toggleAddon = (id) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedAddons = DEFAULT_PAIRINGS.filter((p) =>
    selectedAddonIds.includes(p.id)
  );

  const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const meatTotal = meatPrice * meatQuantity;
  const grandTotal = meatTotal + addonsTotal;

  const handleAddAll = () => {
    if (onAddWithPairings) {
      onAddWithPairings({
        meatProduct: meatProductName,
        meatPrice,
        meatQuantity,
        selectedCut,
        addons: selectedAddons,
        grandTotal,
      });
    } else {
      const addonNames = selectedAddons.map((a) => a.name).join(', ');
      toast.success(
        `Added ${meatQuantity}x ${meatProductName} + ${selectedAddons.length} pairings to bag (Total: ₹${grandTotal})!`
      );
    }
  };

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center">
            <Utensils size={14} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-black uppercase tracking-wider">
              Chef&apos;s Pairing &amp; Spice Kit
            </h4>
            <p className="text-[11px] text-zinc-500 font-medium">
              Curated artisanal accompaniments for the perfect home cook
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono uppercase bg-white border border-zinc-200 px-2 py-0.5 rounded text-zinc-600 font-semibold">
          1-Click Add-on
        </span>
      </div>

      {/* Addons List */}
      <div className="space-y-2">
        {DEFAULT_PAIRINGS.map((item) => {
          const isChecked = selectedAddonIds.includes(item.id);
          return (
            <label
              key={item.id}
              className={`flex items-start justify-between p-3 rounded-xl border transition cursor-pointer select-none ${
                isChecked
                  ? 'bg-white border-black shadow-2xs'
                  : 'bg-white/60 border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleAddon(item.id)}
                  className="mt-1 h-4 w-4 rounded border-zinc-300 text-black focus:ring-black cursor-pointer accent-black"
                />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-black">{item.name}</div>
                  <p className="text-[11px] text-zinc-500 leading-tight">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="text-xs font-mono font-bold text-black shrink-0 ml-3">
                +₹{item.price}
              </div>
            </label>
          );
        })}
      </div>

      {/* Dynamic Action Button */}
      <button
        type="button"
        onClick={handleAddAll}
        className="w-full h-11 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-between px-4 cursor-pointer shadow-xs active:scale-[0.99]"
      >
        <div className="flex items-center gap-2">
          <ShoppingBag size={14} />
          <span>Add Cut + {selectedAddons.length} Selected Pairings</span>
        </div>
        <span className="font-mono text-xs font-black">
          ₹{grandTotal.toFixed(2)}
        </span>
      </button>
    </div>
  );
};

export default ChefPairingsSection;
