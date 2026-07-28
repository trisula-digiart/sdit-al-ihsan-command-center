'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KPICard({ title, value, subtext, icon: Icon, trend, color = 'emerald' }) {
  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-50/60',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-600',
      iconText: 'text-white',
      badge: 'bg-emerald-100 text-emerald-700',
    },
    amber: {
      bg: 'bg-amber-50/60',
      border: 'border-amber-100',
      iconBg: 'bg-amber-500',
      iconText: 'text-white',
      badge: 'bg-amber-100 text-amber-800',
    },
    blue: {
      bg: 'bg-blue-50/60',
      border: 'border-blue-100',
      iconBg: 'bg-blue-600',
      iconText: 'text-white',
      badge: 'bg-blue-100 text-blue-700',
    },
    rose: {
      bg: 'bg-rose-50/60',
      border: 'border-rose-100',
      iconBg: 'bg-rose-600',
      iconText: 'text-white',
      badge: 'bg-rose-100 text-rose-700',
    },
  };

  const activeStyle = colorStyles[color] || colorStyles.emerald;

  return (
    <div className={`p-5 rounded-2xl bg-white border ${activeStyle.border} shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${activeStyle.iconBg} ${activeStyle.iconText} shadow-sm`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
        <span className="text-slate-500 font-medium">{subtext}</span>

        {trend && (
          <div className={`flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[11px] ${
            trend === 'up' ? 'text-emerald-700 bg-emerald-50' : trend === 'down' ? 'text-rose-700 bg-rose-50' : 'text-slate-600 bg-slate-100'
          }`}>
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {trend === 'neutral' && <Minus className="w-3 h-3" />}
            <span>{trend === 'up' ? '+ Realtime' : trend === 'down' ? 'Isu' : 'Stabil'}</span>
          </div>
        )}
      </div>
    </div>
  );
}