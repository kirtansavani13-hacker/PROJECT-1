import React, { useState } from 'react';
import type { SystemAlert } from '../types';
import { PlusCircle, Clock, Check } from 'lucide-react';

interface AlertsPageProps {
  alerts: SystemAlert[];
  onResolveAlert: (id: string) => void;
  onCreatePO: (skuId: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  onResolveAlert,
  onCreatePO
}) => {
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredAlerts = filterSeverity === 'ALL'
    ? alerts
    : alerts.filter(a => a.severity === filterSeverity);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">System Alerts & Anomaly Center</h2>
          <p className="text-xs text-gray-400">Real-time alerts for inventory stockouts, supplier lead time shifts, and marketplace RTO surges.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded bg-crimson/10 border border-crimson/30 text-crimson-light text-xs font-mono font-bold">
            {alerts.filter(a => a.status === 'ACTIVE').length} Active Alerts
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-background p-1 rounded-lg border border-border-subtle w-fit">
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(s => (
          <button
            key={s}
            onClick={() => setFilterSeverity(s)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
              filterSeverity === s
                ? 'bg-primary text-white font-bold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {s === 'ALL' ? 'All Severities' : `${s} Priority`}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="card-kinetic rounded-xl p-12 text-center text-gray-400 font-mono text-xs">
            No active alerts matching filter. All systems operational.
          </div>
        ) : (
          filteredAlerts.map((alt) => (
            <div
              key={alt.id}
              className={`card-kinetic rounded-xl p-5 border-l-4 transition-all ${
                alt.severity === 'CRITICAL' ? 'border-l-crimson' : (alt.severity === 'HIGH' ? 'border-l-amber' : 'border-l-primary')
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      alt.severity === 'CRITICAL' ? 'bg-crimson/20 text-crimson-light border border-crimson/40' : 'bg-amber/20 text-amber-light border border-amber/40'
                    }`}>
                      {alt.severity}
                    </span>

                    <span className="text-xs font-mono text-primary-light font-bold">{alt.skuId}</span>

                    <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{alt.createdAt.replace('T', ' ').substring(0, 16)}</span>
                    </span>

                    {alt.status === 'RESOLVED' && (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        RESOLVED
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white">{alt.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{alt.description}</p>

                  <div className="p-3 bg-background rounded-lg border border-border-subtle text-xs space-y-1">
                    <span className="font-mono text-[10px] text-amber-400 font-bold">RECOMMENDED AI ACTION:</span>
                    <p className="text-[11px] text-gray-200">{alt.recommendedAction}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col gap-2 min-w-40 justify-end">
                  {alt.status === 'ACTIVE' && (
                    <>
                      <button
                        onClick={() => onCreatePO(alt.skuId)}
                        className="px-3 py-2 rounded bg-primary hover:bg-primary-hover text-white text-xs font-mono font-semibold flex items-center justify-center gap-1.5 shadow"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Trigger PO</span>
                      </button>

                      <button
                        onClick={() => onResolveAlert(alt.id)}
                        className="px-3 py-2 rounded bg-surface-hover hover:bg-emerald-600 text-gray-300 hover:text-white text-xs font-mono font-medium flex items-center justify-center gap-1.5 border border-border-subtle transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
