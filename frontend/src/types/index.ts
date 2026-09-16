export type ProductStatus = 'OPTIMAL' | 'LOW_STOCK' | 'CRITICAL' | 'STOCKOUT' | 'OVERSTOCKED' | 'STOCKOUT_RISK';

export interface Product {
  id: string;
  title: string;
  category: string;
  currentStock: number;
  safetyStock: number;
  reorderPoint: number;
  unitPrice: number;
  leadTimeDays: number;
  warehouse: string;
  channels: string[];
  status: ProductStatus;
  growthFactor: number;
  supplier: string;
}

export interface DashboardSummary {
  totalSKUs: number;
  criticalCount: number;
  totalStockValue: number;
  pendingPOValue: number;
  totalForecasted30DayDemand: number;
  activeAlertsCount: number;
  recentSalesTotal: number;
}

export interface AIForecastItem {
  skuId: string;
  skuTitle: string;
  category: string;
  currentStock: number;
  safetyStock: number;
  baseDailyDemand: number;
  forecastedDemand: number;
  confidenceScore: number;
  daysUntilStockout: number;
  recommendedReorderQty: number;
  growthTrend: string;
  status: 'IMMINENT_STOCKOUT' | 'LOW_BUFFER' | 'HEALTHY';
}

export interface SalesLog {
  id: string;
  skuId: string;
  skuTitle: string;
  channel: string;
  unitsSold: number;
  revenue: number;
  date: string;
}

export type POStatus = 'DRAFT' | 'ISSUED' | 'IN_TRANSIT' | 'RECEIVED' | 'CANCELLED';

export interface PurchaseOrder {
  id: string;
  skuId: string;
  skuTitle: string;
  supplierName: string;
  unitsOrdered: number;
  unitCost: number;
  totalAmount: number;
  status: POStatus;
  orderDate: string;
  expectedDelivery: string;
  destinationWarehouse: string;
  warehouse?: string;
}

export interface SystemAlert {
  id: string;
  skuId: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
  title: string;
  description: string;
  recommendedAction: string;
  createdAt: string;
  status: 'ACTIVE' | 'RESOLVED';
}

export interface SystemSettings {
  forecastHorizonDays: number;
  seasonalityIndex: number;
  defaultLeadTimeBufferDays: number;
  zScoreSafetyStock: number;
  channels: {
    amazon: { connected: boolean; lastSync: string; syncIntervalMin: number };
    flipkart: { connected: boolean; lastSync: string; syncIntervalMin: number };
    meesho: { connected: boolean; lastSync: string; syncIntervalMin: number };
    shopify: { connected: boolean; lastSync: string; syncIntervalMin: number };
  };
  notifications: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    autoCreateDraftPO: boolean;
  };
}
