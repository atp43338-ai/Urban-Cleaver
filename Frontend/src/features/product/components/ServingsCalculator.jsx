import React, { useState } from 'react';
import { Users, Minus, Plus, ShoppingBag, Calculator } from 'lucide-react';

/**
 * ServingsCalculator:
 * Dynamic counter enabling home cooks to calculate meat required by headcount
 * Formula: ~250g (0.25kg) net usable meat per adult diner
 */
const ServingsCalculator = ({
  recipeName = 'Dum Biryani',
  packWeightGrams = 1000,
  unitPrice = 0,
  onApplyCalculatedQuantity,
}) => {
  const [people, setPeople] = useState(4);

  const GRAMS_PER_PERSON = 250;
  const totalGramsNeeded = people * GRAMS_PER_PERSON;
  const totalKgNeeded = (totalGramsNeeded / 1000).toFixed(1);

  // Calculate packs required (e.g. if pack is 1000g, 1.0kg = 1 pack; 1.5kg = 2 packs, etc.)
  const packsRequired = Math.max(1, Math.ceil(totalGramsNeeded / packWeightGrams));
  const estimatedMeatCost = (packsRequired * unitPrice).toFixed(2);

  const handleDecrement = () => {
    if (people > 1) setPeople(people - 1);
  };

  const handleIncrement = () => {
    if (people < 30) setPeople(people + 1);
  };

  const handleAddToCart = () => {
    if (onApplyCalculatedQuantity) {
      onApplyCalculatedQuantity({
        people,
        totalKg: totalKgNeeded,
        packs: packsRequired,
      });
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-100 text-black flex items-center justify-center">
            <Calculator size={14} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-black uppercase tracking-wider">
              Servings & Quantity Estimator
            </h4>
            <p className="text-[11px] text-zinc-500 font-medium">
              Calibrated at 250g net usable meat per person
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200">
          Zero Waste Metric
        </span>
      </div>

      {/* Counter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-zinc-500" />
          <span className="text-xs font-semibold text-zinc-700">How many people are dining?</span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={people <= 1}
            className="w-9 h-9 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:border-black hover:text-black hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            aria-label="Decrease persons"
          >
            <Minus size={13} />
          </button>

          <div className="w-16 h-9 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-xs font-bold font-mono text-black">
            {people} {people === 1 ? 'Person' : 'People'}
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            disabled={people >= 30}
            className="w-9 h-9 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:border-black hover:text-black hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            aria-label="Increase persons"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* Smart Calculation Readout */}
      <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1.5">
        <div className="text-xs text-zinc-700 leading-relaxed">
          For <strong className="text-black">{people} people</strong> cooking{' '}
          <span className="font-semibold text-black">{recipeName}</span>, you need{' '}
          <strong className="text-black underline underline-offset-2 font-mono">
            ~{totalKgNeeded} kg net usable meat
          </strong>{' '}
          <span className="text-zinc-500 text-[11px]">
            (approx. {packsRequired} {packsRequired === 1 ? 'pack' : 'packs'} @ {packWeightGrams}g).
          </span>
        </div>
        <p className="text-[10px] text-zinc-500 font-mono">
          Traditional butcher shops would charge you for ~{(totalKgNeeded * 1.35).toFixed(1)} kg gross live weight to give you this net yield.
        </p>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleAddToCart}
        className="w-full h-11 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
      >
        <ShoppingBag size={14} />
        <span>
          Add Exact Quantity ({totalKgNeeded} kg • {packsRequired} {packsRequired === 1 ? 'Pack' : 'Packs'}) — ₹{estimatedMeatCost}
        </span>
      </button>
    </div>
  );
};

export default ServingsCalculator;
