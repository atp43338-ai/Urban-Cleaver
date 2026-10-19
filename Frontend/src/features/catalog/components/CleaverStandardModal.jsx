import React from 'react';
import { X, Check, XCircle, Scale, ShieldCheck } from 'lucide-react';

const CleaverStandardModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-2xl overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
              <Scale size={16} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-bold text-black tracking-tight">The Urban Cleaver Standard</h3>
              <p className="text-xs text-zinc-500">100% Net Usable Weight vs. Traditional Dressing Loss</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Core Philosophy Banner */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
            <p className="text-xs text-zinc-700 leading-relaxed font-medium">
              At traditional butcher shops, when you pay for <strong className="text-black">1000g</strong> of live or gross bird/meat, up to <strong className="text-black">30% to 35%</strong> is discarded during dressing, leaving you with barely 650g–700g of meat. At Urban Cleaver, <strong className="text-black">1000g ordered means 1000g clean, trimmed, pan-ready meat</strong> in your cooking vessel.
            </p>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Traditional Market */}
            <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50/50 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                <XCircle size={15} className="text-zinc-400" />
                Traditional Butcher Shop
              </div>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 font-bold">•</span>
                  <span><strong>Gross Weight Billing:</strong> Weighed before skinning, disemboweling, and trimming.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 font-bold">•</span>
                  <span><strong>300g Waste Loss:</strong> You pay for bone dust, fat chunks, and offal you throw away.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 font-bold">•</span>
                  <span><strong>Random Chopping:</strong> Uneven pieces with bone splinters that tear during cooking.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 font-bold">•</span>
                  <span><strong>Open Exposure:</strong> Cut on wooden stumps with high microbial contact.</span>
                </li>
              </ul>
            </div>

            {/* The Urban Cleaver Standard */}
            <div className="border-2 border-black rounded-xl p-4 bg-white space-y-3 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-black uppercase tracking-wider">
                <ShieldCheck size={15} className="text-black" />
                The Urban Cleaver Standard
              </div>
              <ul className="space-y-2 text-xs text-zinc-800">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-black shrink-0 mt-0.5" />
                  <span><strong>100% Net Usable Weight:</strong> Every single gram you purchase goes straight into your pan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-black shrink-0 mt-0.5" />
                  <span><strong>Zero Trimming Waste:</strong> We absorb all preparation loss so you pay only for edible meat.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-black shrink-0 mt-0.5" />
                  <span><strong>Calibrated Precision Cuts:</strong> Uniform 35-40g pieces for slow dum biryani and fast curries.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-black shrink-0 mt-0.5" />
                  <span><strong>Chilled Clean-Room Packing:</strong> Cut at 4°C and sealed in sterile, food-grade pouch.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between shrink-0">
          <span className="text-xs text-zinc-500">
            Backed by our 100% Culinary Quality Guarantee.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-lg transition cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

export default CleaverStandardModal;
