import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-zinc-200 hover:border-zinc-300 transition flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider font-mono">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-200 bg-zinc-50 text-zinc-800 shrink-0">
            <Icon size={16} className="stroke-1.5" />
          </div>
        )}
      </div>

      <div>
        <p className="text-2xl lg:text-3xl font-black tracking-tight text-black">
          {value ?? '—'}
        </p>

        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
            {trend && (
              <span className="font-semibold text-zinc-900 bg-zinc-100 border border-zinc-200/80 px-1.5 py-0.5 rounded text-[10px] font-mono">
                {trend}
              </span>
            )}
            {subtitle && <span className="truncate text-zinc-400">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
