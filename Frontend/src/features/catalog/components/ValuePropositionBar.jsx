import React from 'react';
import { Scale, Scissors, PackageCheck } from 'lucide-react';

const ValuePropositionBar = () => {
  const propositions = [
    {
      icon: Scale,
      title: '100% Net Usable Weight',
      description: 'Zero deduction for skin, gizzard, or excessive fat. You receive precisely what you cook.',
    },
    {
      icon: Scissors,
      title: 'Precision Cut-to-Order',
      description: 'Laser-consistent pieces tailored for uniform cooking time in slow dum and fast curries.',
    },
    {
      icon: PackageCheck,
      title: 'Fresh Morning Batches',
      description: 'Prepared in chilled sterile rooms at 4°C and delivered in insulated sealed packs.',
    },
  ];

  return (
    <section className="bg-zinc-50 border-b border-zinc-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
          {propositions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-start gap-3.5 py-4 md:py-2 ${
                  idx === 0 ? 'md:pr-8' : idx === 1 ? 'md:px-8' : 'md:pl-8'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-white border border-zinc-200 text-black flex items-center justify-center shrink-0 shadow-2xs">
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black tracking-tight">{item.title}</h4>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionBar;
