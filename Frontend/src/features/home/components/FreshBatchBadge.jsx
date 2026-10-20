import React from 'react';

/**
 * FreshBatchBadge:
 * Micro-badge component displaying "● Butchered at 6:00 AM | Sterile Packed" and scarcity status.
 * Monochrome minimalist design adhering to Urban Cleaver standards.
 */
const FreshBatchBadge = ({
  time = '6:00 AM',
  facility = 'Sterile Packed',
  scarcity = 'Morning Batch • Limited Daily Yield',
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 bg-zinc-50/90 backdrop-blur-xs text-[11px] font-semibold text-zinc-900 select-none shadow-2xs ${className}`}
    >
      <span className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-40"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
        </span>
        <span className="font-mono text-xs font-bold text-black tracking-tight">
          Butchered at {time}
        </span>
      </span>

      <span className="text-zinc-300">|</span>

      <span className="text-zinc-600 font-medium">{facility}</span>

      {scarcity && (
        <>
          <span className="hidden sm:inline text-zinc-300">•</span>
          <span className="hidden sm:inline text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
            {scarcity}
          </span>
        </>
      )}
    </div>
  );
};

export default FreshBatchBadge;