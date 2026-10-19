import React from 'react';
import { ArrowDown, Scale, ShieldCheck, Flame } from 'lucide-react';

const HeroSection = ({ onOpenStandardModal }) => {
  const handleScrollToGrid = () => {
    const el = document.getElementById('cuts-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-white border-b border-zinc-200 pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-300 bg-zinc-50 text-[11px] font-semibold tracking-widest text-zinc-800 uppercase mb-6 shadow-xs select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
          PRECISION ARTISANAL BUTCHERY
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-black tracking-tight leading-[1.08] max-w-4xl mx-auto">
          What You Order Is What You Cook.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Never pay for feathers, bone dust, or trimmings. Pure 100% net usable meat cut fresh to your exact recipe specifications.
        </p>

        {/* CTA Button Cluster */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={handleScrollToGrid}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-lg transition active:scale-[0.99] cursor-pointer shadow-xs"
          >
            Explore Fresh Cuts
            <ArrowDown size={14} />
          </button>

          <button
            type="button"
            onClick={onOpenStandardModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-zinc-50 text-black border border-zinc-300 hover:border-black text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            <Scale size={15} />
            Our Net Weight Standard
          </button>
        </div>

        {/* Trust Metric Strip */}
        <div className="mt-14 pt-8 border-t border-zinc-100 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-black" />
            <span className="font-medium">100% Pan-Ready (Zero Waste)</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-black" />
            <span className="font-medium">Cut Specifically for Biryani & Curries</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-medium">Morning Batch Sealed</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
