import React from 'react';
import { Scale, Check, ShieldCheck, ArrowRight, Info } from 'lucide-react';

/**
 * NetWeightAssuranceCard:
 * Minimal visual meter comparing "What You Order" vs "What You Cook"
 * Highlighting zero dressing deduction and 100% edible yield
 */
const NetWeightAssuranceCard = ({
  grossWeight = '1000g',
  netWeight = '1000g Net Usable',
  onOpenModal,
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center">
            <ShieldCheck size={15} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-black uppercase tracking-wider">
              100% Net Usable Weight Verification
            </h4>
            <p className="text-[11px] text-zinc-500 font-medium">
              Zero dressing deduction guarantee
            </p>
          </div>
        </div>

        {onOpenModal && (
          <button
            type="button"
            onClick={onOpenModal}
            className="text-[11px] font-semibold text-black hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Learn More</span>
            <ArrowRight size={11} />
          </button>
        )}
      </div>

      {/* Visual Comparison Meter */}
      <div className="space-y-3">
        {/* Urban Cleaver Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-black"></span>
              Urban Cleaver Pan-Ready
            </span>
            <span className="font-mono font-bold text-black">{netWeight} (100% Yield)</span>
          </div>
          <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden p-0.5 border border-zinc-200">
            <div className="h-full bg-black rounded-full w-full transition-all duration-500"></div>
          </div>
        </div>

        {/* Traditional Market Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-300"></span>
              Traditional Butcher Shop
            </span>
            <span className="font-mono text-zinc-400">~680g Yield (-32% Waste Loss)</span>
          </div>
          <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden p-0.5 border border-zinc-200">
            <div className="h-full bg-zinc-300 rounded-full w-[68%]"></div>
          </div>
        </div>
      </div>

      {/* Bulleted Guarantees */}
      <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
        <div className="flex items-start gap-2 text-xs text-zinc-700">
          <Check size={14} className="text-black shrink-0 mt-0.5" />
          <span>
            <strong className="text-black">Zero feathers & excess skin:</strong> 100% clean dressed meat.
          </span>
        </div>
        <div className="flex items-start gap-2 text-xs text-zinc-700">
          <Check size={14} className="text-black shrink-0 mt-0.5" />
          <span>
            <strong className="text-black">Zero excess fat or gristle trimmings:</strong> Hand-trimmed by master butchers.
          </span>
        </div>
        <div className="flex items-start gap-2 text-xs text-zinc-700">
          <Check size={14} className="text-black shrink-0 mt-0.5" />
          <span>
            <strong className="text-black">Zero bone splinters:</strong> Calibrated cleaver chops prevent shards.
          </span>
        </div>
      </div>

      {/* Tagline */}
      <p className="text-[11px] text-zinc-500 italic text-center">
        &ldquo;What you order is what you cook. 1000g on invoice = 1000g in your pot.&rdquo;
      </p>
    </div>
  );
};

export default NetWeightAssuranceCard;
