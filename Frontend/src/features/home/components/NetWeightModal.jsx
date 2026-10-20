import React from 'react';
import { X, Check, XCircle, Scale, ShieldCheck, ArrowRight } from 'lucide-react';

/**
 * NetWeightModal:
 * Clean monochrome modal explaining the "1000g = 1000g" zero dressing waste standard.
 */
const NetWeightModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs select-none">
      <div
        className="relative w-full max-w-xl bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
              <Scale size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black text-black tracking-tight">
                THE 100% NET WEIGHT ASSURANCE
              </h3>
              <p className="text-[11px] text-zinc-500 font-mono">
                Urban Cleaver Standard Audit
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black hover:border-black transition cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-zinc-900 max-h-[75vh] overflow-y-auto">
          {/* Headline Banner */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              The Fundamental Rule
            </span>
            <div className="text-base font-black text-black">
              &quot;What You Order Is What You Cook.&quot;
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              At traditional stalls, buying 1kg of meat means you receive as little as 650g–700g of cookable meat after skinning, de-feathering, trimming, and fat discard. At Urban Cleaver, 1000g ordered is 1000g clean, edible meat in your pan.
            </p>
          </div>

          {/* Audit Comparison Grid */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider">
              Audit Breakdown (1000g Nominal Purchase)
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Local Stall */}
              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-zinc-700">
                  <XCircle size={14} className="text-zinc-400" />
                  <span>Local Butcher Stall</span>
                </div>
                <div className="space-y-1 text-[11px] text-zinc-500">
                  <div className="flex justify-between">
                    <span>Gross weight billed:</span>
                    <span className="font-mono font-semibold text-zinc-700">1000g</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Skin &amp; fat trim:</span>
                    <span className="font-mono">-180g</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Inedible bone &amp; waste:</span>
                    <span className="font-mono">-140g</span>
                  </div>
                  <div className="pt-1.5 border-t border-zinc-200 flex justify-between font-bold text-zinc-900">
                    <span>Final cookable meat:</span>
                    <span className="font-mono text-zinc-900">~680g</span>
                  </div>
                </div>
              </div>

              {/* Urban Cleaver */}
              <div className="p-3.5 rounded-xl border-2 border-black bg-white space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-black">
                  <Check size={14} className="text-black stroke-[3]" />
                  <span>Urban Cleaver</span>
                </div>
                <div className="space-y-1 text-[11px] text-zinc-600">
                  <div className="flex justify-between">
                    <span>Gross animal weight:</span>
                    <span className="font-mono">1450g</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Zero waste dressing:</span>
                    <span className="font-mono">Absorbed</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Precision bone slicing:</span>
                    <span className="font-mono">Included</span>
                  </div>
                  <div className="pt-1.5 border-t border-zinc-200 flex justify-between font-black text-black">
                    <span>Pan-ready usable meat:</span>
                    <span className="font-mono text-black">1000g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Three Pillars */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <ShieldCheck size={16} className="text-black shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-black">Zero Splinter Guarantee</h4>
                <p className="text-[11px] text-zinc-500 leading-snug">
                  Bone cuts are made with precision band-saws, eliminating dangerous bone shards that ruin delicate gravies.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <Scale size={16} className="text-black shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-black">Calibrated Portions</h4>
                <p className="text-[11px] text-zinc-500 leading-snug">
                  Curry and Biryani pieces are cut to uniform sizes (45–55g) so every piece cooks evenly to tenderness.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-400">
            UC-SPEC-NET-1000
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetWeightModal;