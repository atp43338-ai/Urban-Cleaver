import React from 'react';
import { ChefHat, Flame, Clock, Sparkles, Scale, Info } from 'lucide-react';

/**
 * Detailed culinary data mapped by cut intention
 */
const CUT_ANATOMY_DETAILS = {
  biryani: {
    title: 'Biryani Special Cut Anatomy',
    pieceCount: '12–14 large bone-in cuts (approx. 45–55g each)',
    culinaryReason:
      'Large cuts seal natural meat juices during dum/slow-cooking without drying out or shredding under steam pressure.',
    marination: '45–60 mins (yogurt, ginger-garlic & whole spices)',
    cookTime: '25–30 mins sealed Dum cooking',
    culinaryYield: '100% Pan-ready. Fits 1:1 basmati rice ratio perfectly.',
    bestFor: 'Hyderabadi Dum Biryani, Lucknowi Pulao, Rawther Biryani',
  },
  curry: {
    title: 'Curry & Slow Cook Cut Anatomy',
    pieceCount: '16–20 medium bone-in & boneless pieces (approx. 25–35g each)',
    culinaryReason:
      'Balanced bone-to-meat ratio. The marrow releases natural collagen that enriches and thickens onion-tomato gravies.',
    marination: '20–30 mins with ground spice paste',
    cookTime: '35–40 mins slow simmer or 3 whistle pressure cook',
    culinaryYield: '100% Edible meat. Zero splintered bone fragments.',
    bestFor: 'Homestyle Tariwala Chicken, Rogan Josh, Pepper Masala Curry',
  },
  boneless: {
    title: 'Tender Boneless Muscle Cut Anatomy',
    pieceCount: 'Precision-cubed skinless muscle fillets (uniform thickness)',
    culinaryReason:
      'Zero bone or connective sinew. Enables rapid heat penetration and sear crust while remaining buttery and tender.',
    marination: '30 mins (lemon, curd, herbs or dry rub)',
    cookTime: '8–12 mins direct high heat sear / tawa roast',
    culinaryYield: '100% Pure protein yield with zero dressing deduction.',
    bestFor: 'Pan Seared Chicken, Tawa Tikka, Fajitas, Protein Meal-Prep',
  },
  keema: {
    title: 'Artisanal Keema / Mince Anatomy',
    pieceCount: 'Single-pass uniform coarse mince',
    culinaryReason:
      'Coarse minced rather than emulsified paste, preserving muscle texture and natural fats for juicy skewers and gravies.',
    marination: '15 mins with chopped aromatics and coriander',
    cookTime: '15–20 mins gentle braise or 8 mins charcoal grill',
    culinaryYield: '100% Usable mince with zero gristle or tendon chunks.',
    bestFor: 'Mutton Seekh Kebabs, Keema Matar, Stuffed Parathas',
  },
  steak: {
    title: 'Prime Steak Cut Anatomy',
    pieceCount: 'Thick hand-cut artisanal steaks (uniform cross-section)',
    culinaryReason:
      'Center-cut tenderloin with balanced intramuscular marbling that caramelizes upon high-heat pan contact.',
    marination: '15 mins (sea salt, crushed peppercorns, rosemary & butter)',
    cookTime: '4–6 mins per side to achieve medium-rare / medium tenderness',
    culinaryYield: '100% Usable cut, dry-aged for intense flavor concentration.',
    bestFor: 'Cast-iron Pan Sear, Butter Basting, Char-Grill',
  },
};

const resolveAnatomy = (cutName = '') => {
  const lower = cutName.toLowerCase();
  if (lower.includes('biryani')) return CUT_ANATOMY_DETAILS.biryani;
  if (lower.includes('curry')) return CUT_ANATOMY_DETAILS.curry;
  if (lower.includes('boneless') || lower.includes('breast') || lower.includes('fillet'))
    return CUT_ANATOMY_DETAILS.boneless;
  if (lower.includes('keema') || lower.includes('mince'))
    return CUT_ANATOMY_DETAILS.keema;
  if (lower.includes('steak') || lower.includes('chop'))
    return CUT_ANATOMY_DETAILS.steak;

  // Default fallback
  return {
    title: `${cutName} Precision Anatomy`,
    pieceCount: 'Uniformly calibrated butchery cuts',
    culinaryReason:
      'Expertly trimmed to ensure optimal thermal conductivity and moisture retention during home cooking.',
    marination: '20–30 mins with customary seasonings',
    cookTime: '20–30 mins according to cooking technique',
    culinaryYield: '100% Pan-ready usable meat with zero dressing waste.',
    bestFor: 'Specialty culinary recipes and custom preparations',
  };
};

/**
 * CutAnatomyCard:
 * Educational card explaining piece count, culinary reason,
 * marination, and cook time tailored to the selected cut.
 */
const CutAnatomyCard = ({ selectedCut = 'Biryani Cut' }) => {
  const anatomy = resolveAnatomy(selectedCut);

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center">
            <ChefHat size={14} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-black uppercase tracking-wider">
              The Butcher's Culinary Guide
            </h4>
            <p className="text-[11px] text-zinc-500 font-medium">{anatomy.title}</p>
          </div>
        </div>

        <span className="text-[10px] font-mono uppercase bg-white border border-zinc-200 px-2.5 py-1 rounded-md text-zinc-700 font-semibold">
          Calibrated Cut
        </span>
      </div>

      {/* Piece Count & Culinary Reason */}
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <Scale size={14} className="text-black shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-black">Piece Count & Size: </span>
            <span className="text-zinc-700">{anatomy.pieceCount}</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Sparkles size={14} className="text-black shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-black">Culinary Rationale: </span>
            <span className="text-zinc-600 leading-relaxed">{anatomy.culinaryReason}</span>
          </div>
        </div>
      </div>

      {/* Cooking Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        <div className="bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-2.5">
          <Clock size={16} className="text-zinc-500 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
              Recommended Marination
            </span>
            <span className="text-xs font-bold text-black truncate block">
              {anatomy.marination}
            </span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-2.5">
          <Flame size={16} className="text-black shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
              Cook / Dum Time
            </span>
            <span className="text-xs font-bold text-black truncate block">
              {anatomy.cookTime}
            </span>
          </div>
        </div>
      </div>

      {/* Best For Tag */}
      <div className="text-[11px] text-zinc-500 pt-1 border-t border-zinc-200/60 flex items-center gap-1.5">
        <span className="font-bold text-black">Ideal For:</span>
        <span className="italic">{anatomy.bestFor}</span>
      </div>
    </div>
  );
};

export default CutAnatomyCard;
