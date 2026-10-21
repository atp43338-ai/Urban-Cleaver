import React from 'react';
import { ArrowRight, Scale, ShieldCheck, ThermometerSnowflake } from 'lucide-react';
import heroImage from '../assets/Hero-bg.jpeg';

/**
 * HeroSection:
 * Full screen immersive banner (covers complete screen height beneath navbar)
 */
const HeroSection = () => {
  const handleScrollToGrid = () => {
    const el = document.getElementById('cuts-catalog') || document.getElementById('catalog-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] sm:min-h-[calc(100vh-80px)] flex items-center justify-start overflow-hidden bg-black text-white select-none">
      
      {/* 1. Full-Cover Edge-to-Edge Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Urban Cleaver Artisanal Butchery"
          className="w-full h-full object-cover object-right md:object-center brightness-90 contrast-105"
        />

        {/* Dark linear gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />

        {/* Subtle bottom vignette to smoothly merge with white bar below */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      </div>

      {/* 2. Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full flex flex-col justify-center py-12">
        <div className="max-w-xl lg:max-w-2xl text-left space-y-5">
          
          {/* Live Batch Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/50 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-zinc-300">
              Morning Harvest • 0-4°C Chilled
            </span>
          </div>

          {/* Luxury Standard Headline */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-wide uppercase leading-tight">
              Artisanal Cuts.
            </h1>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light text-zinc-300 tracking-wider uppercase leading-tight font-serif italic">
              The Cleaver Standard.
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-base text-zinc-300 max-w-lg leading-relaxed font-normal">
            Pakistani Mutton, Prime Indian Mutton & Choice Beef. 100% pan-ready yield with zero waste trimmings.
          </p>

          {/* Primary CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleScrollToGrid}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-white text-black font-mono text-xs font-bold tracking-wider uppercase hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-xl cursor-pointer rounded-lg"
            >
              <span>Explore Cuts</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;