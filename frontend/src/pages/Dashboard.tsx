import React from 'react';
import type { DashboardSummary, Product, SystemAlert, PurchaseOrder } from '../types';
import { KpiCard } from '../components/KpiCard';
import { StatusChip } from '../components/StatusChip';
import { 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  ShoppingBag, 
  Layers, 
  PlusCircle, 
  ArrowUpRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  summary: DashboardSummary | null;
  products: Product[];
  alerts: SystemAlert[];
  purchaseOrders: PurchaseOrder[];
  onNavigate: (tab: string) => void;
  onCreatePO: (skuId: string) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({
  summary,
  products,
  alerts,
  purchaseOrders,
  onNavigate,
  onCreatePO
}) => {
  const criticalProducts = products.filter(p => p.currentStock <= p.reorderPoint);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-surface-card via-surface to-background p-6 rounded-xl border border-border-subtle relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-primary-light">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI DEMAND ENGINE ACTIVE (98.4% CONFIDENCE)</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Supply Chain Command Center</h2>
          <p className="text-xs text-gray-400">
            Real-time Indian D2C stock optimization across Amazon.in, Flipkart, Meesho, and Shopify.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigate('forecast')}
            className="px-4 py-2 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
          >
            <span>Run AI Simulation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="30-Day Demand Forecast"
          value={summary ? `${summary.totalForecasted30DayDemand.toLocaleString()} Units` : '4,280 Units'}
          subtitle="Diwali festive surge (+25%) applied"
          trend="+18.4%"
          isPositiveTrend={true}
          icon={<TrendingUp className="w-5 h-5 text-primary-light" />}
          accentColor="indigo"
        />

        <KpiCard
          title="Stockout Risk SKUs"
          value={summary ? summary.criticalCount : 2}
          subtitle="Requires immediate purchase order"
          trend="-2 resolved"
          isPositiveTrend={true}
          icon={<AlertTriangle className="w-5 h-5 text-crimson-light" />}
          accentColor="crimson"
        />

        <KpiCard
          title="Total Stock Value"
          value={summary ? `₹${(summary.totalStockValue / 100000).toFixed(2)} Lakhs` : '₹18.45 Lakhs'}
          subtitle="Across 3 fulfillment centers"
          trend="+4.2%"
          isPositiveTrend={true}
          icon={<Layers className="w-5 h-5 text-emerald-light" />}
          accentColor="emerald"
        />

        <KpiCard
          title="Pending PO Investment"
          value={summary ? `₹${(summary.pendingPOValue / 100000).toFixed(2)} Lakhs` : '₹5.39 Lakhs'}
          subtitle={`${purchaseOrders.filter(p => p.status !== 'RECEIVED').length} Purchase Orders in pipeline`}
          icon={<ShoppingBag className="w-5 h-5 text-amber-light" />}
          accentColor="amber"
        />
      </div>

      {/* Main Grid: Forecast Chart & Stockout Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demand & Inventory Visualizer */}
        <div className="lg:col-span-2 card-kinetic rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Demand Trend vs Inventory Trajectory</span>
              </h3>
              <p className="text-xs text-gray-400">Comparing historical sales with 30-day predicted depletion rate</p>
            </div>
            <span className="text-xs font-mono px-2 py-1 rounded bg-surface-hover text-gray-300">Daily Granularity</span>
          </div>

          {/* Custom SVG Demand Trend Visualizer */}
          <div className="h-64 w-full bg-background/50 rounded-lg p-4 relative flex flex-col justify-between border border-border-subtle">
            <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 border-b border-border-subtle pb-2">
              <span>Metric: Aggregated Unit Sales</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary"></span> AI Forecast</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Historical Actuals</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-crimson-light"></span> Safety Stock Floor</span>
              </div>
            </div>

            {/* SVG Line & Bar Representation */}
            <div className="h-44 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                <line x1="0" y1="30" x2="500" y2="30" stroke="#1E293B" strokeDasharray="4 4" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#1E293B" strokeDasharray="4 4" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#F43F5E" strokeDasharray="2 2" strokeWidth="1.5" />

                <path
                  d="M0,110 L50,95 L100,105 L150,80 L200,85 L250,60"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                />

                <path
                  d="M250,60 L300,50 L350,40 L400,25 L450,20 L500,15"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3"
                  strokeDasharray="5 5"
                />

                <defs>
                  <linearGradient id="forecastGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon points="250,60 300,50 350,40 400,25 450,20 500,15 500,140 250,140" fill="url(#forecastGlow)" />
              </svg>
            </div>

            <div className="flex justify-between text-[10px] font-mono text-gray-400 pt-2 border-t border-border-subtle">
              <span>01 Sep</span>
              <span>07 Sep</span>
              <span>13 Sep (Today)</span>
              <span>20 Sep (Festive Peak)</span>
              <span>27 Sep</span>
              <span>30 Sep</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center pt-2">
            <div className="bg-background p-2.5 rounded border border-border-subtle">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Avg Lead Time</span>
              <p className="text-sm font-bold text-white font-mono mt-0.5">6.5 Days</p>
            </div>
            <div className="bg-background p-2.5 rounded border border-border-subtle">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Current Service Level</span>
              <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">97.8%</p>
            </div>
            <div className="bg-background p-2.5 rounded border border-border-subtle">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Reorder ROP Threshold</span>
              <p className="text-sm font-bold text-amber-400 font-mono mt-0.5">180 Avg Qty</p>
            </div>
          </div>
        </div>

        {/* Live Alerts Column */}
        <div className="card-kinetic rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-crimson-light" />
                <span>Actionable System Alerts</span>
              </h3>
              <button 
                onClick={() => onNavigate('alerts')}
                className="text-[11px] font-mono text-primary-light hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {alerts.slice(0, 3).map((alt) => (
                <div key={alt.id} className="p-3 rounded-lg bg-background border border-border-subtle space-y-2 hover:border-border-active transition-all">
                  <div className="flex items-start justify-between">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      alt.severity === 'CRITICAL' ? 'bg-crimson/20 text-crimson-light border border-crimson/40' : 'bg-amber/20 text-amber-light border border-amber/40'
                    }`}>
                      {alt.severity}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">{alt.createdAt.split('T')[1].substring(0,5)}</span>
                  </div>

                  <h4 className="text-xs font-semibold text-white">{alt.title}</h4>
                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{alt.description}</p>

                  <button
                    onClick={() => onCreatePO(alt.skuId)}
                    className="w-full py-1.5 px-2 rounded bg-surface-hover hover:bg-primary text-gray-200 hover:text-white text-[11px] font-mono font-medium flex items-center justify-center gap-1.5 transition-all border border-border-subtle"
                  >
                    <PlusCircle className="w-3 h-3 text-primary-light" />
                    <span>Trigger Immediate PO</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-primary-glow border border-primary/30 rounded-lg text-xs space-y-1">
            <span className="font-mono text-[10px] text-primary-light font-bold">AUTOMATED REORDER NOTICE</span>
            <p className="text-[11px] text-gray-300">
              2 SKUs reached minimum stock threshold. AI recommends generating POs to prevent ₹1.2L revenue loss.
            </p>
          </div>
        </div>
      </div>

      {/* Critical Stockout Risk Table */}
      <div className="card-kinetic rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">SKUs Requiring Immediate Replenishment</h3>
            <p className="text-xs text-gray-400">Items below reorder point or facing imminent stockout</p>
          </div>
          <button
            onClick={() => onNavigate('inventory')}
            className="text-xs font-mono text-primary-light hover:underline"
          >
            Manage Inventory &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-background text-gray-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">SKU CODE</th>
                <th className="py-2.5 px-3">PRODUCT NAME</th>
                <th className="py-2.5 px-3">CURRENT STOCK</th>
                <th className="py-2.5 px-3">REORDER POINT</th>
                <th className="py-2.5 px-3">LEAD TIME</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {criticalProducts.map((p) => (
                <tr key={p.id} className="hover:bg-surface-hover/50 transition-colors">
                  <td className="py-3 px-3 font-mono text-primary-light font-semibold">{p.id}</td>
                  <td className="py-3 px-3 font-medium text-white">{p.title}</td>
                  <td className="py-3 px-3 font-mono font-bold text-amber-400">{p.currentStock} Units</td>
                  <td className="py-3 px-3 font-mono text-gray-300">{p.reorderPoint} Units</td>
                  <td className="py-3 px-3 font-mono text-gray-400">{p.leadTimeDays} Days</td>
                  <td className="py-3 px-3">
                    <StatusChip status={p.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onCreatePO(p.id)}
                      className="px-3 py-1 rounded bg-primary hover:bg-primary-hover text-white font-mono text-[11px] transition-all shadow"
                    >
                      + Generate PO
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
