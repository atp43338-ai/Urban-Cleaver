import React from 'react';
import { ShieldCheck, ThermometerSnowflake, Clock, Award, Check } from 'lucide-react';

/**
 * FreshnessStamp:
 * Displays batch timestamp certificate, sterile cold-chain assurance,
 * and clear kitchen storage instructions.
 */
const FreshnessStamp = ({
  batchTime = 'Today at 06:15 AM',
  facility = 'Chilled at 0°C–4°C sterile facility',
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4">
      {/* Header Stamp */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center">
            <Award size={15} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-black uppercase tracking-wider">
              Cold-Chain Freshness Certificate
            </h4>
            <p className="text-[11px] text-zinc-500 font-medium">
              Sterile facility butchered &amp; vacuum-packed
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          Batch #UC-{(Date.now() % 10000).toString().padStart(4, '0')}
        </span>
      </div>

      {/* Grid of Cold-Chain Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Butchered Timestamp */}
        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
            <Clock size={12} className="text-black" />
            <span>Butchered Timestamp</span>
          </div>
          <div className="text-xs font-bold font-mono text-black">{batchTime}</div>
          <p className="text-[10px] text-zinc-500">Fresh morning harvest cut to order.</p>
        </div>

        {/* Temperature Assurance */}
        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
            <ThermometerSnowflake size={12} className="text-black" />
            <span>Cold-Chain Maintained</span>
          </div>
          <div className="text-xs font-bold font-mono text-black">0°C – 4°C Maintained</div>
          <p className="text-[10px] text-zinc-500">Never frozen, sealed in oxygen barrier.</p>
        </div>
      </div>

      {/* Standards List */}
      <div className="space-y-1.5 pt-1 text-xs text-zinc-600">
        <div className="flex items-center gap-2">
          <Check size={13} className="text-black shrink-0" />
          <span>100% Antibiotic &amp; Growth Hormone Residue Free</span>
        </div>
        <div className="flex items-center gap-2">
          <Check size={13} className="text-black shrink-0" />
          <span>Single-source farm livestock with ethical traceability</span>
        </div>
        <div className="flex items-center gap-2">
          <Check size={13} className="text-black shrink-0" />
          <span>Kitchen Storage: Refrigerate at 2°C–4°C (use within 48h) or freeze at -18°C</span>
        </div>
      </div>
    </div>
  );
};

export default FreshnessStamp;
