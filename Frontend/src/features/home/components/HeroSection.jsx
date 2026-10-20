import React from 'react';
import { ArrowRight, Scale, ShieldCheck, ThermometerSnowflake } from 'lucide-react';
import heroImage from '../assets/Hero-bg.jpeg';

/**
 * HeroSection:
 * Height-optimized 68vh/72vh full-cover cinematic banner:
 * - Locked height: h-[68vh] sm:h-[72vh] max-h-[640px] min-h-[480px]
 * - Minimalist studio typography: "ARTISANAL CUTS. THE CLEAVER STANDARD."
 * - Single Primary CTA: [ ORDER PRECISION CUTS → ] scrolls to #cuts-catalog
 * - Micro Value Strip: [ 1000g = 1000g Pan-Ready ] • [ Butchered Daily at 6 AM ] • [ Zero Splinters ]
 */
const HeroSection = () => {
  const handleScrollToGrid = () => {
    const el = document.getElementById('cuts-catalog') || document.getElementById('catalog-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-[68vh] sm:h-[72vh] max-h-[640px] min-h-[480px] flex items-center justify-start overflow-hidden bg-black text-white select-none">
      {/* 1. Full-Cover Background & Linear Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Urban Cleaver Artisanal Butchery"
          className="w-full h-full object-cover object-center lg:object-right brightness-95 contrast-105"
        />

        {/* Subtle dark-to-light gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

        {/* Subtle bottom vignette to blend smoothly into page */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
      </div>

      {/* 2. Left-Aligned Minimalist Studio Typography */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center">
        <div className="max-w-2xl lg:max-w-3xl text-left space-y-4 sm:space-y-5">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/50 backdrop-blur-md shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase text-white">
              MORNING BATCH | 0-4°C CHILLED STERILE PACKS
            </span>
          </div>

          {/* Main Headline (Bold & Clean) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.02]">
            ARTISANAL CUTS.
            <br />
            <span className="text-zinc-200">THE CLEAVER STANDARD.</span>
          </h1>

          {/* Short Subtitle */}
          <p className="text-xs sm:text-sm lg:text-base text-zinc-300 max-w-xl leading-relaxed font-normal">
            Pakistani Mutton, Prime Indian Mutton &amp; Choice Beef. 
            100% Net Usable Weight &mdash; Zero waste deduction.
          </p>

          {/* Single Primary CTA Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleScrollToGrid}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-white text-black font-mono text-xs font-bold tracking-widest uppercase hover:bg-zinc-200 transition active:scale-[0.98] shadow-xl cursor-pointer rounded-lg"
            >
              <span>ORDER PRECISION CUTS</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Micro Value Strip at Bottom-Left */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-zinc-300 font-medium">
            <div className="flex items-center gap-1.5">
              <Scale size={14} className="text-white shrink-0" />
              <span className="font-mono text-white font-bold">1000g = 1000g Pan-Ready</span>
            </div>
            <span className="text-zinc-500">•</span>
            <div className="flex items-center gap-1.5">
              <ThermometerSnowflake size={14} className="text-white shrink-0" />
              <span>Butchered Daily at 6 AM</span>
            </div>
            <span className="text-zinc-500">•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-white shrink-0" />
              <span>Zero Splinters</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;