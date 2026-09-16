import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  isPositiveTrend?: boolean;
  icon: React.ReactNode;
  accentColor?: 'indigo' | 'emerald' | 'crimson' | 'amber';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  isPositiveTrend = true,
  icon,
  accentColor = 'indigo'
}) => {
  const accentBorders = {
    indigo: 'border-l-4 border-l-primary',
    emerald: 'border-l-4 border-l-emerald',
    crimson: 'border-l-4 border-l-crimson',
    amber: 'border-l-4 border-l-amber'
  };

  return (
    <div className={`card-kinetic rounded-lg p-5 ${accentBorders[accentColor]} transition-all duration-200 hover:translate-y-[-2px]`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-medium text-gray-400 uppercase tracking-wider">{title}</span>
        <div className="p-2 rounded-md bg-surface-hover text-gray-300">
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-white tracking-tight font-sans">
          {value}
        </div>

        {trend && (
          <div className={`flex items-center text-xs font-mono font-medium ${isPositiveTrend ? 'text-emerald-400' : 'text-crimson-400'}`}>
            {isPositiveTrend ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
            {trend}
          </div>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-gray-400 font-sans">{subtitle}</p>
      )}
    </div>
  );
};
