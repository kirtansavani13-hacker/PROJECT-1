import React from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Package, 
  ShoppingBag, 
  BadgeIndianRupee, 
  Bell, 
  Settings, 
  Zap,
  Boxes
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, activeAlertsCount }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'forecast', label: 'AI Demand Forecast', icon: BrainCircuit, badge: 'AI Model' },
    { id: 'inventory', label: 'Product & Inventory', icon: Package, badge: null },
    { id: 'orders', label: 'Purchase Orders', icon: ShoppingBag, badge: null },
    { id: 'sales', label: 'Daily Sales Entry', icon: BadgeIndianRupee, badge: null },
    { id: 'alerts', label: 'System Alerts', icon: Bell, badge: activeAlertsCount > 0 ? `${activeAlertsCount} New` : null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside className="w-64 bg-background border-r border-border-subtle flex flex-col justify-between h-screen fixed left-0 top-0 z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-border-subtle">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-wide text-sm leading-none">OptiStock AI</h1>
            <span className="text-[10px] font-mono text-gray-400 tracking-wider">D2C INVENTORY ENGINE</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-gray-400">
            Analytics & Operations
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/25 font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-surface-hover'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    item.id === 'alerts' && activeAlertsCount > 0 
                      ? 'bg-crimson text-white animate-pulse'
                      : (isActive ? 'bg-white/20 text-white' : 'bg-surface-hover text-primary-light')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-border-subtle bg-surface/50">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-mono text-gray-300 text-[11px]">Sync Active</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-[10px]">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>v2.4 Live</span>
          </div>
        </div>
        <p className="mt-2 text-[10px] text-gray-400 font-mono">Marketplace: AMZ, FK, MSH, SHPF</p>
      </div>
    </aside>
  );
};
