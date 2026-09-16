import React from 'react';
import { Search, Bell, RefreshCw, Calendar, ChevronDown } from 'lucide-react';

interface NavbarProps {
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
  activeAlertsCount: number;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedChannel,
  setSelectedChannel,
  activeAlertsCount,
  onRefresh,
  isLoading
}) => {
  const channels = ['ALL CHANNELS', 'Amazon', 'Flipkart', 'Meesho', 'Shopify'];

  return (
    <header className="h-16 bg-surface/80 backdrop-blur border-b border-border-subtle fixed top-0 right-0 left-64 z-20 px-6 flex items-center justify-between">
      {/* Search Bar */}
      <div className="relative w-72">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search SKUs, POs, Categories... (Ctrl+K)"
          className="w-full bg-background border border-border-subtle rounded-md pl-9 pr-4 py-1.5 text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans"
        />
      </div>

      {/* Right Tools */}
      <div className="flex items-center gap-4">
        {/* Channel Selector Pills */}
        <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-border-subtle">
          {channels.map((ch) => (
            <button
              key={ch}
              onClick={() => setSelectedChannel(ch)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-all ${
                selectedChannel === ch
                  ? 'bg-primary text-white font-semibold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        {/* Sync / Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-md bg-surface-hover text-gray-300 hover:text-white border border-border-subtle transition-all flex items-center gap-1.5 text-xs font-mono"
          title="Refresh Data & Forecasts"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-primary-light' : ''}`} />
          <span className="hidden sm:inline">Sync</span>
        </button>

        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background border border-border-subtle text-xs text-gray-300 font-mono">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>13 Sep 2026</span>
        </div>

        {/* Alerts Icon Trigger */}
        <div className="relative">
          <button className="p-2 rounded-md bg-surface-hover text-gray-300 hover:text-white border border-border-subtle relative">
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-crimson text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {activeAlertsCount}
              </span>
            )}
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-border-subtle">
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light text-xs font-mono font-bold">
            IN
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-medium text-white flex items-center gap-1">
              Rajesh Kumar <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>
            <span className="text-[10px] text-gray-400 font-mono">Head of Supply Chain</span>
          </div>
        </div>
      </div>
    </header>
  );
};
