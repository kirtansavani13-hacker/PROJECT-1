import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/Dashboard';
import { ForecastPage } from './pages/ForecastPage';
import { InventoryPage } from './pages/InventoryPage';
import { PurchaseOrdersPage } from './pages/PurchaseOrdersPage';
import { SalesEntryPage } from './pages/SalesEntryPage';
import { AlertsPage } from './pages/AlertsPage';
import { SettingsPage } from './pages/SettingsPage';

import type { Product, DashboardSummary, SalesLog, PurchaseOrder, SystemAlert, SystemSettings } from './types';
import { api } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL CHANNELS');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // App Centralized State
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [salesLogs, setSalesLogs] = useState<SalesLog[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  // Preset SKU for Quick PO trigger
  const [presetSkuId, setPresetSkuId] = useState<string | null>(null);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [sumData, prodData, salesData, poData, alertData, settingsData] = await Promise.all([
        api.getDashboardSummary(),
        api.getProducts(),
        api.getSales(),
        api.getPurchaseOrders(),
        api.getAlerts(),
        api.getSettings()
      ]);

      setSummary(sumData);
      setProducts(prodData);
      setSalesLogs(salesData);
      setPurchaseOrders(poData);
      setAlerts(alertData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Failed to load application state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Action Handlers
  const handleCreatePOTrigger = (skuId: string) => {
    setPresetSkuId(skuId);
    setActiveTab('orders');
  };

  const handleAddProduct = async (newProd: Partial<Product>) => {
    const added = await api.addProduct(newProd);
    setProducts(prev => [added, ...prev]);
    loadAllData();
  };

  const handleUpdateStock = async (id: string, newStock: number) => {
    const updated = await api.updateProduct(id, { currentStock: newStock });
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
    loadAllData();
  };

  const handleAddSale = async (sale: { skuId: string; channel: string; unitsSold: number; revenue?: number; date?: string }) => {
    const newLog = await api.addSale(sale);
    setSalesLogs(prev => [newLog, ...prev]);
    loadAllData();
  };

  const handleCreatePO = async (po: Partial<PurchaseOrder>) => {
    const created = await api.createPurchaseOrder(po);
    setPurchaseOrders(prev => [created, ...prev]);
    setPresetSkuId(null);
    loadAllData();
  };

  const handleReceivePO = async (id: string) => {
    const received = await api.receivePurchaseOrder(id);
    setPurchaseOrders(prev => prev.map(p => p.id === id ? received : p));
    loadAllData();
  };

  const handleResolveAlert = async (id: string) => {
    const resolved = await api.resolveAlert(id);
    setAlerts(prev => prev.map(a => a.id === id ? resolved : a));
  };

  const handleSaveSettings = async (newSettings: Partial<SystemSettings>) => {
    const updated = await api.updateSettings(newSettings);
    setSettings(updated);
  };

  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-background text-gray-200 flex font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeAlertsCount={activeAlertsCount}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar
          selectedChannel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
          activeAlertsCount={activeAlertsCount}
          onRefresh={loadAllData}
          isLoading={isLoading}
        />

        {/* Page Content Router */}
        <main className="flex-1 p-6 pt-22 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardPage
              summary={summary}
              products={products}
              alerts={alerts}
              purchaseOrders={purchaseOrders}
              onNavigate={setActiveTab}
              onCreatePO={handleCreatePOTrigger}
            />
          )}

          {activeTab === 'forecast' && (
            <ForecastPage onCreatePO={handleCreatePOTrigger} />
          )}

          {activeTab === 'inventory' && (
            <InventoryPage
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateStock={handleUpdateStock}
              onCreatePO={handleCreatePOTrigger}
            />
          )}

          {activeTab === 'orders' && (
            <PurchaseOrdersPage
              purchaseOrders={purchaseOrders}
              products={products}
              onCreatePO={handleCreatePO}
              onReceivePO={handleReceivePO}
              presetSkuId={presetSkuId}
            />
          )}

          {activeTab === 'sales' && (
            <SalesEntryPage
              salesLogs={salesLogs}
              products={products}
              onAddSale={handleAddSale}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsPage
              alerts={alerts}
              onResolveAlert={handleResolveAlert}
              onCreatePO={handleCreatePOTrigger}
            />
          )}

          {activeTab === 'settings' && settings && (
            <SettingsPage
              settings={settings}
              onSaveSettings={handleSaveSettings}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
