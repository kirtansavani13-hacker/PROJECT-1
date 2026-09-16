import React, { useState, useEffect } from 'react';
import type { AIForecastItem } from '../types';
import { api } from '../services/api';
import { StatusChip } from '../components/StatusChip';
import { BrainCircuit, Sliders, Calendar, Sparkles, PlusCircle, CheckCircle } from 'lucide-react';

interface ForecastPageProps {
  onCreatePO: (skuId: string) => void;
}

export const ForecastPage: React.FC<ForecastPageProps> = ({ onCreatePO }) => {
  const [horizon, setHorizon] = useState<number>(30);
  const [seasonality, setSeasonality] = useState<number>(1.25);
  const [forecasts, setForecasts] = useState<AIForecastItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchForecastData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getForecast(horizon, seasonality);
      setForecasts(data.forecasts);
    } catch (err) {
      console.error('Failed to load forecast', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForecastData();
  }, [horizon, seasonality]);

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary-light mb-1">
            <BrainCircuit className="w-4 h-4" />
            <span>NEURAL DEMAND PREDICTION ENGINE</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">AI Demand Forecast & Parameter Tuning</h2>
          <p className="text-xs text-gray-400">Simulate market trends, festive surges, and lead time buffer requirements.</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={fetchForecastData}
            className="px-3 py-1.5 rounded bg-primary hover:bg-primary-hover text-white text-xs font-mono font-medium flex items-center gap-1.5 shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recalculate AI Model</span>
          </button>
        </div>
      </div>

      {/* AI Controls & Parameter Tuning Panel */}
      <div className="card-kinetic rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Horizon Selector */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300 font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-light" />
            <span>Forecast Horizon Window</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5 bg-background p-1 rounded-lg border border-border-subtle">
            {[7, 30, 60, 90].map((d) => (
              <button
                key={d}
                onClick={() => setHorizon(d)}
                className={`py-1.5 rounded text-xs font-mono font-medium transition-all ${
                  horizon === d
                    ? 'bg-primary text-white font-bold'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>
          <p className="text-[11px] text-gray-400">Target evaluation window for stock depletion</p>
        </div>

        {/* Seasonality Multiplier Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-gray-300 font-semibold">
            <span className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Festive Season Multiplier</span>
            </span>
            <span className="text-primary-light font-bold">{seasonality}x ({Math.round((seasonality - 1) * 100)}% Surge)</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.0"
            step="0.05"
            value={seasonality}
            onChange={(e) => setSeasonality(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-surface-hover rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] font-mono text-gray-400">
            <span>Normal (1.0x)</span>
            <span>Diwali Peak (1.5x)</span>
            <span>Mega Sale (2.0x)</span>
          </div>
        </div>

        {/* Safety Stock Model Tuning */}
        <div className="bg-background p-4 rounded-lg border border-border-subtle space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-gray-300 font-semibold">Service Level Target</span>
            <span className="font-mono text-emerald-400 font-bold">95.0% (Z=1.65)</span>
          </div>
          <div className="w-full bg-surface-hover h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full w-[95%]"></div>
          </div>
          <p className="text-[10px] text-gray-400">Safety stock buffers automatically dynamically adjust based on vendor lead time variance.</p>
        </div>
      </div>

      {/* Forecast Data Table */}
      <div className="card-kinetic rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">SKU-Level Demand Predictions ({horizon}-Day Window)</h3>
          <span className="text-xs font-mono text-gray-400">Found {forecasts.length} SKU predictions</span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-gray-400 font-mono text-xs animate-pulse">
            Computing neural demand forecasts...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-background text-gray-400 font-mono text-[11px]">
                  <th className="py-3 px-3">SKU & TITLE</th>
                  <th className="py-3 px-3">CURRENT STOCK</th>
                  <th className="py-3 px-3">PREDICTED DEMAND</th>
                  <th className="py-3 px-3">DAYS UNTIL STOCKOUT</th>
                  <th className="py-3 px-3">AI CONFIDENCE</th>
                  <th className="py-3 px-3">RECOMMENDED REORDER</th>
                  <th className="py-3 px-3">STATUS</th>
                  <th className="py-3 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {forecasts.map((f) => (
                  <tr key={f.skuId} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-mono text-primary-light font-bold text-xs">{f.skuId}</div>
                      <div className="text-white font-medium text-xs">{f.skuTitle}</div>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-gray-200">
                      {f.currentStock} Units
                      <div className="text-[10px] text-gray-400 font-normal">Safety: {f.safetyStock}</div>
                    </td>

                    <td className="py-3 px-3 font-mono text-emerald-400 font-bold text-sm">
                      {f.forecastedDemand} Units
                      <span className="ml-1.5 text-[10px] font-normal text-gray-400">({f.growthTrend})</span>
                    </td>

                    <td className="py-3 px-3 font-mono">
                      <span className={`font-bold ${f.daysUntilStockout <= 7 ? 'text-crimson-light' : (f.daysUntilStockout <= 15 ? 'text-amber-400' : 'text-emerald-400')}`}>
                        {f.daysUntilStockout} Days
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-gray-300">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-primary-light" />
                        <span>{f.confidenceScore}%</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-amber-300">
                      {f.recommendedReorderQty > 0 ? `+${f.recommendedReorderQty} Units` : '0 (Stock Optimal)'}
                    </td>

                    <td className="py-3 px-3">
                      <StatusChip status={f.status} />
                    </td>

                    <td className="py-3 px-3 text-right">
                      {f.recommendedReorderQty > 0 ? (
                        <button
                          onClick={() => onCreatePO(f.skuId)}
                          className="px-3 py-1 rounded bg-primary hover:bg-primary-hover text-white font-mono text-[11px] flex items-center gap-1 ml-auto shadow"
                        >
                          <PlusCircle className="w-3 h-3" />
                          <span>Create PO</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-gray-400">No Action Req.</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
