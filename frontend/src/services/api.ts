import type { DashboardSummary, Product, AIForecastItem, SalesLog, PurchaseOrder, SystemAlert, SystemSettings } from '../types';

const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Dashboard Summary
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const res = await fetch(`${API_BASE}/dashboard/summary`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return {
        totalSKUs: 7,
        criticalCount: 2,
        totalStockValue: 1845000,
        pendingPOValue: 539000,
        totalForecasted30DayDemand: 4280,
        activeAlertsCount: 3,
        recentSalesTotal: 245240
      };
    }
  },

  // Products
  async getProducts(params?: { status?: string; category?: string; search?: string }): Promise<Product[]> {
    try {
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.category) query.append('category', params.category);
      if (params?.search) query.append('search', params.search);

      const res = await fetch(`${API_BASE}/products?${query.toString()}`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return [];
    }
  },

  async addProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return await res.json();
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  },

  // AI Forecast
  async getForecast(horizon: number = 30, seasonality: number = 1.25): Promise<{ horizonDays: number; seasonalityMultiplier: number; forecasts: AIForecastItem[] }> {
    try {
      const res = await fetch(`${API_BASE}/forecast?horizon=${horizon}&seasonality=${seasonality}`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return { horizonDays: horizon, seasonalityMultiplier: seasonality, forecasts: [] };
    }
  },

  // Sales
  async getSales(): Promise<SalesLog[]> {
    try {
      const res = await fetch(`${API_BASE}/sales`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return [];
    }
  },

  async addSale(sale: { skuId: string; channel: string; unitsSold: number; revenue?: number; date?: string }): Promise<SalesLog> {
    const res = await fetch(`${API_BASE}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sale)
    });
    return await res.json();
  },

  // Purchase Orders
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    try {
      const res = await fetch(`${API_BASE}/purchase-orders`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return [];
    }
  },

  async createPurchaseOrder(po: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    const res = await fetch(`${API_BASE}/purchase-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(po)
    });
    return await res.json();
  },

  async receivePurchaseOrder(id: string): Promise<PurchaseOrder> {
    const res = await fetch(`${API_BASE}/purchase-orders/${id}/receive`, {
      method: 'PATCH'
    });
    return await res.json();
  },

  // Alerts
  async getAlerts(): Promise<SystemAlert[]> {
    try {
      const res = await fetch(`${API_BASE}/alerts`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return [];
    }
  },

  async resolveAlert(id: string): Promise<SystemAlert> {
    const res = await fetch(`${API_BASE}/alerts/${id}/resolve`, {
      method: 'POST'
    });
    return await res.json();
  },

  // Settings
  async getSettings(): Promise<SystemSettings> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return {
        forecastHorizonDays: 30,
        seasonalityIndex: 1.25,
        defaultLeadTimeBufferDays: 3,
        zScoreSafetyStock: 1.65,
        channels: {
          amazon: { connected: true, lastSync: '10 min ago', syncIntervalMin: 15 },
          flipkart: { connected: true, lastSync: '15 min ago', syncIntervalMin: 30 },
          meesho: { connected: true, lastSync: '45 min ago', syncIntervalMin: 60 },
          shopify: { connected: true, lastSync: '2 min ago', syncIntervalMin: 5 }
        },
        notifications: { emailAlerts: true, smsAlerts: false, autoCreateDraftPO: true }
      };
    }
  },

  async updateSettings(newSettings: Partial<SystemSettings>): Promise<SystemSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
    return await res.json();
  }
};
