import React from 'react';
import { Check, Scissors } from 'lucide-react';

/**
 * Metadata dictionary mapping cut names to quick piece descriptions
 */
const CUT_METADATA = {
  'biryani cut': {
    tag: '12-14 large pcs',
    weightGuide: '45-55g / piece',
    recommended: 'Best for Dum',
  },
  'curry cut': {
    tag: '16-20 medium pcs',
    weightGuide: '25-35g / piece',
    recommended: 'Best for Gravy',
  },
  'boneless': {
    tag: 'Clean trimmed cubes',
    weightGuide: '100% Lean meat',
    recommended: 'Best for Pan Fry',
  },
  'keema': {
    tag: 'Single-pass mince',
    weightGuide: 'Zero sinew/gristle',
    recommended: 'Best for Kebabs',
  },
  'steaks': {
    tag: 'Thick uniform slices',
    weightGuide: 'Direct high-sear',
    recommended: 'Best for Grill',
  },
  'chops': {
    tag: 'Rib-bone trimmed',
    weightGuide: 'Juicy bone-in meat',
    recommended: 'Best for Tawa Fry',
  },
  'soup bones': {
    tag: 'Marrow & joint bones',
    weightGuide: 'Collagen-rich broth',
    recommended: 'Best for Paya / Soup',
  },
  'whole / roast': {
    tag: 'Whole dressed bird',
    weightGuide: 'Retains cavity shape',
    recommended: 'Best for Oven Roast',
  },
};

const getCutMeta = (cutName = '') => {
  const lower = cutName.toLowerCase().trim();
  for (const [key, val] of Object.entries(CUT_METADATA)) {
    if (lower.includes(key)) return val;
  }
  return {
    tag: 'Artisanal butchered',
    weightGuide: 'Precision portioned',
    recommended: 'Custom Culinary Cut',
  };
};

/**
 * CutSelectorSection:
 * Interactive cut selection with piece-size metadata and culinary guidance
 */
const CutSelectorSection = ({
  cutTypes = [],
  selectedCut,
  onSelectCut,
}) => {
  const normalizedCuts = Array.isArray(cutTypes) && cutTypes.length > 0
    ? cutTypes
    : ['Curry Cut'];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500">
          <Scissors size={14} className="text-black" />
          <span>Select Culinary Cut Style</span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">
          Selected: <strong className="text-black">{selectedCut}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {normalizedCuts.map((cut, idx) => {
          const isSelected = selectedCut === cut;
          const meta = getCutMeta(cut);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectCut(cut)}
              className={`flex items-start justify-between p-3 rounded-xl border text-left transition cursor-pointer select-none ${
                isSelected
                  ? 'border-black bg-black text-white shadow-xs'
                  : 'border-zinc-200 bg-white text-zinc-800 hover:border-black hover:bg-zinc-50'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold tracking-tight">{cut}</span>
                  {isSelected && (
                    <span className="bg-white text-black p-0.5 rounded-full">
                      <Check size={10} strokeWidth={3} />
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] leading-tight ${
                    isSelected ? 'text-zinc-300' : 'text-zinc-500'
                  }`}
                >
                  {meta.tag} • {meta.weightGuide}
                </p>
              </div>

              <span
                className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                  isSelected
                    ? 'bg-zinc-800 text-zinc-200'
                    : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {meta.recommended}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CutSelectorSection;
