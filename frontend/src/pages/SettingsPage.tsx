import React, { useState } from 'react';
import type { SystemSettings } from '../types';
import { Key, Bell, Sliders, CheckCircle2 } from 'lucide-react';

interface SettingsPageProps {
  settings: SystemSettings;
  onSaveSettings: (newSettings: Partial<SystemSettings>) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onSaveSettings }) => {
  const [horizon, setHorizon] = useState(settings.forecastHorizonDays || 30);
  const [seasonality, setSeasonality] = useState(settings.seasonalityIndex || 1.25);
  const [emailAlerts, setEmailAlerts] = useState(settings.notifications?.emailAlerts ?? true);
  const [autoPO, setAutoPO] = useState(settings.notifications?.autoCreateDraftPO ?? true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      forecastHorizonDays: Number(horizon),
      seasonalityIndex: Number(seasonality),
      notifications: {
        ...settings.notifications,
        emailAlerts,
        autoCreateDraftPO: autoPO
      }
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">System Configuration & Integrations</h2>
        <p className="text-xs text-gray-400">Configure AI forecast parameters, marketplace API integrations, and notification triggers.</p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>System settings updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Marketplace API Status Toggles */}
        <div className="card-kinetic rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-primary-light" />
              <span>Multi-Channel Integration Status</span>
            </h3>
            <span className="text-[10px] font-mono text-gray-400">API Gateway Version 3.2</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-background rounded-lg border border-border-subtle flex items-center justify-between">
              <div>
                <div className="font-semibold text-white text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Amazon SP-API (India)</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">Last Sync: 10 mins ago</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
                CONNECTED
              </span>
            </div>

            <div className="p-4 bg-background rounded-lg border border-border-subtle flex items-center justify-between">
              <div>
                <div className="font-semibold text-white text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>Flipkart Seller API</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">Last Sync: 15 mins ago</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
                CONNECTED
              </span>
            </div>

            <div className="p-4 bg-background rounded-lg border border-border-subtle flex items-center justify-between">
              <div>
                <div className="font-semibold text-white text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  <span>Meesho Partner API</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">Last Sync: 45 mins ago</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
                CONNECTED
              </span>
            </div>

            <div className="p-4 bg-background rounded-lg border border-border-subtle flex items-center justify-between">
              <div>
                <div className="font-semibold text-white text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-lime-500"></span>
                  <span>Shopify Store Webhook</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">Last Sync: Real-time</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Forecast Engine Defaults */}
        <div className="card-kinetic rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Forecast Engine Default Parameters</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-300 font-mono mb-1">Default Horizon Window (Days)</label>
              <input
                type="number"
                value={horizon}
                onChange={(e) => setHorizon(Number(e.target.value))}
                className="w-full bg-background border border-border-subtle rounded p-2.5 text-white font-mono focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-mono mb-1">Diwali Festive Seasonality Index</label>
              <input
                type="number"
                step="0.05"
                value={seasonality}
                onChange={(e) => setSeasonality(Number(e.target.value))}
                className="w-full bg-background border border-border-subtle rounded p-2.5 text-white font-mono focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Automation */}
        <div className="card-kinetic rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <span>Automations & Notification Rules</span>
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 bg-background rounded-lg border border-border-subtle cursor-pointer">
              <div>
                <div className="font-semibold text-white">Email Digest & Instant Stockout Alerts</div>
                <div className="text-[11px] text-gray-400">Receive instant alerts when an SKU drops below safety stock level</div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-border-subtle bg-surface-hover text-primary focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-background rounded-lg border border-border-subtle cursor-pointer">
              <div>
                <div className="font-semibold text-white">Auto-Create Draft Purchase Orders</div>
                <div className="text-[11px] text-gray-400">Automatically generate draft POs for critical SKUs when reorder point is breached</div>
              </div>
              <input
                type="checkbox"
                checked={autoPO}
                onChange={(e) => setAutoPO(e.target.checked)}
                className="w-4 h-4 rounded border-border-subtle bg-surface-hover text-primary focus:ring-primary"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded bg-primary hover:bg-primary-hover text-white text-xs font-mono font-semibold shadow-lg shadow-primary/20 transition-all"
          >
            Save Configuration Settings
          </button>
        </div>
      </form>
    </div>
  );
};
