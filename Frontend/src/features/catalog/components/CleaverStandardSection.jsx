import React from 'react';
import { Scale, Check, X, ShieldCheck } from 'lucide-react';

const CleaverStandardSection = ({ onOpenStandardModal }) => {
  return (
    <section className="bg-white border-t border-zinc-200 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-300 bg-zinc-50 text-[11px] font-semibold tracking-widest text-zinc-800 uppercase mb-3 select-none">
            <Scale size={13} />
            TRANSPARENT BUTCHERY COMPARISON
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
            Stop Paying for Dressing Waste.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
            Understand how our pan-ready net weight guarantee changes your culinary results and weekly grocery spending.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Traditional Market Card */}
          <div className="border border-zinc-200 bg-zinc-50/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">Old Paradigm</span>
                  <h3 className="text-lg font-bold text-zinc-700">Traditional Meat Stall</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center font-bold text-xs">
                  ✕
                </div>
              </div>

              <div className="my-6 p-4 bg-white border border-zinc-200 rounded-xl">
                <p className="text-xs text-zinc-500">Gross Weighed vs. Net Cooked:</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-zinc-800 font-mono">1000g Gross</span>
                  <span className="text-xs text-zinc-400">yields only</span>
                  <span className="text-lg font-bold text-zinc-600 font-mono">~680g Usable</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  You forfeit 320g in blood, skin, feathers, and trim loss.
                </p>
              </div>

              <ul className="space-y-3 text-xs text-zinc-600">
                <li className="flex items-start gap-2.5">
                  <X size={15} className="text-zinc-400 shrink-0 mt-0.5" />
                  <span>Hidden waste fee included inside headline price.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X size={15} className="text-zinc-400 shrink-0 mt-0.5" />
                  <span>Crushed bone splinters scattered throughout pieces.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X size={15} className="text-zinc-400 shrink-0 mt-0.5" />
                  <span>Uneven cut sizes cause smaller pieces to overcook while thick cuts stay raw.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X size={15} className="text-zinc-400 shrink-0 mt-0.5" />
                  <span>Thin plastic bag packaging with leakage risk.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200 text-[11px] text-zinc-400 text-center font-medium">
              Average culinary waste: 30% per kilogram
            </div>
          </div>

          {/* Urban Cleaver Card */}
          <div className="border-2 border-black bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-lg relative">
            <div className="absolute -top-3 right-6 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              100% Pan-Ready
            </div>

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-black block">Urban Cleaver Standard</span>
                  <h3 className="text-lg font-bold text-black">Artisanal Precision Butchery</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
              </div>

              <div className="my-6 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                <p className="text-xs text-zinc-500">True Usable Net Weight:</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-black font-mono">1000g Ordered</span>
                  <span className="text-xs text-zinc-400">= exactly</span>
                  <span className="text-lg font-bold text-black font-mono">1000g Cooked</span>
                </div>
                <p className="text-[11px] text-zinc-600 mt-1">
                  Zero trimming loss. Every single gram is pure, cleaned meat ready for heat.
                </p>
              </div>

              <ul className="space-y-3 text-xs text-zinc-800">
                <li className="flex items-start gap-2.5">
                  <Check size={15} className="text-black shrink-0 mt-0.5" />
                  <span><strong>Zero Trimming Waste:</strong> We absorb all preparation loss before weighing.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={15} className="text-black shrink-0 mt-0.5" />
                  <span><strong>Recipe-Specific Pieces:</strong> Calibrated cuts for uniform heat penetration and dum cooking.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={15} className="text-black shrink-0 mt-0.5" />
                  <span><strong>Bone Splinter Removal:</strong> Clean saw cuts with water filtration to eliminate sharp debris.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={15} className="text-black shrink-0 mt-0.5" />
                  <span><strong>Vacuum-Sealed Sterile Packs:</strong> Kept at a continuous 0-4°C chill chain until delivery.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-black flex items-center gap-1.5">
                <ShieldCheck size={14} /> Verified Net Usable Standard
              </span>
              <button
                type="button"
                onClick={onOpenStandardModal}
                className="text-xs font-bold underline underline-offset-2 text-black hover:text-zinc-600 cursor-pointer"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CleaverStandardSection;
