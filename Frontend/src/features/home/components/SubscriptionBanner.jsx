import React from 'react';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * SubscriptionBanner:
 * Dedicated weekly/monthly meat subscription section ("Weekly Cleaver Pass")
 * - Fresh butchery cuts delivered to your doorstep every Sunday morning
 * - Priority batch booking, customized weekly cuts, zero delivery charges
 * - Minimal action button: [ Setup Weekly Plan ]
 */
const SubscriptionBanner = ({ onSubscribeClick }) => {
  const handleAction = () => {
    if (onSubscribeClick) {
      onSubscribeClick();
    } else {
      toast.success('Weekly Cleaver Pass reservation opened! Choose your regular Sunday cut batch.');
    }
  };

  return (
    <section className="bg-zinc-50 border-b border-zinc-200 py-6 sm:py-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Headline & Description */}
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase font-bold tracking-wider text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
              <span>WEEKLY CLEAVER PASS</span>
              <span className="text-zinc-300">•</span>
              <span className="text-zinc-700">SUNDAY MORNING HARVEST</span>
            </div>
            
            <h3 className="text-base sm:text-lg font-black text-black tracking-tight">
              Fresh Butchery Cuts Delivered Every Sunday Morning
            </h3>
            
            <p className="text-xs text-zinc-500 leading-relaxed">
              Automate your home kitchen with recurring batches. Sliced fresh at 5:00 AM, vacuum-chilled at 2°C, and delivered directly to your doorstep.
            </p>
          </div>

          {/* Center / Perks List */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-5 text-xs text-zinc-700 pt-1 lg:pt-0 border-t lg:border-t-0 border-zinc-100">
            <div className="flex items-center gap-1.5">
              <Check size={14} className="text-black shrink-0 stroke-[2.5]" />
              <span className="font-semibold text-zinc-900">Priority Batch Booking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={14} className="text-black shrink-0 stroke-[2.5]" />
              <span className="font-semibold text-zinc-900">Customized Cuts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={14} className="text-black shrink-0 stroke-[2.5]" />
              <span className="font-semibold text-zinc-900">Zero Delivery Fee</span>
            </div>
          </div>

          {/* Right: Action Button */}
          <div className="pt-2 lg:pt-0 shrink-0">
            <button
              type="button"
              onClick={handleAction}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition active:scale-[0.98] cursor-pointer shadow-xs whitespace-nowrap"
            >
              <span>Setup Weekly Plan</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionBanner;