import React from 'react';
import type { ProductStatus } from '../types';

interface StatusChipProps {
  status: ProductStatus | string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  let styleClasses = "bg-gray-800 text-gray-300 border-gray-700";
  let label = status;

  switch (status) {
    case 'OPTIMAL':
    case 'HEALTHY':
    case 'RESOLVED':
      styleClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      label = status === 'OPTIMAL' ? 'Optimal Stock' : label;
      break;
    case 'LOW_STOCK':
    case 'LOW_BUFFER':
    case 'ISSUED':
      styleClasses = "bg-amber-500/10 text-amber-400 border-amber-500/30";
      label = status === 'LOW_STOCK' ? 'Low Stock' : label;
      break;
    case 'CRITICAL':
    case 'STOCKOUT_IMMINENT':
    case 'IMMINENT_STOCKOUT':
    case 'STOCKOUT':
    case 'ACTIVE':
      styleClasses = "bg-crimson-500/10 text-crimson-400 border-crimson-500/30 animate-pulse";
      label = status === 'CRITICAL' ? 'Critical Risk' : label;
      break;
    case 'OVERSTOCKED':
      styleClasses = "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
      label = 'Overstocked';
      break;
    case 'IN_TRANSIT':
      styleClasses = "bg-blue-500/10 text-blue-400 border-blue-500/30";
      label = 'In-Transit';
      break;
    case 'RECEIVED':
      styleClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      label = 'Received';
      break;
    case 'DRAFT':
      styleClasses = "bg-gray-500/10 text-gray-400 border-gray-500/30";
      label = 'Draft PO';
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-medium border ${styleClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {label}
    </span>
  );
};
