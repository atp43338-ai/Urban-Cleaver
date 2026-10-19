import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme = 'orange',
  trend,
}) => {
  const schemeStyles = {
    orange: {
      iconBg: 'bg-orange-50 text-orange-600 border-orange-100',
      valueColor: 'text-slate-900',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      valueColor: 'text-emerald-700',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      valueColor: 'text-amber-700',
    },
    red: {
      iconBg: 'bg-red-50 text-red-600 border-red-100',
      valueColor: 'text-red-700',
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      valueColor: 'text-purple-700',
    },
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      valueColor: 'text-blue-700',
    },
  };

  const currentScheme = schemeStyles[colorScheme] || schemeStyles.orange;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${currentScheme.iconBg}`}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div>
        <p className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${currentScheme.valueColor}`}>
          {value ?? '...'}
        </p>

        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
            {trend && (
              <span className="font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                {trend}
              </span>
            )}
            {subtitle && <span className="truncate">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
