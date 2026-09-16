const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ================= INITIAL SEED DATA =================
let products = [
  {
    id: 'SKU-D2C-101',
    title: 'Kashmiri Saffron Premium 1g',
    category: 'Gourmet & Spices',
    currentStock: 45,
    safetyStock: 120,
    reorderPoint: 200,
    unitPrice: 650,
    leadTimeDays: 10,
    warehouse: 'BLR-FC-01 (Bengaluru)',
    channels: ['Amazon', 'Shopify', 'Flipkart'],
    status: 'STOCKOUT_RISK',
    growthFactor: 1.25,
    supplier: 'Valley Spices Pvt Ltd'
  },
  {
    id: 'SKU-D2C-102',
    title: 'Cold Pressed Virgin Coconut Oil 1L',
    category: 'Wellness & Oils',
    currentStock: 680,
    safetyStock: 300,
    reorderPoint: 450,
    unitPrice: 480,
    leadTimeDays: 5,
    warehouse: 'BHW-FC-02 (Bhiwandi)',
    channels: ['Amazon', 'Meesho', 'Shopify'],
    status: 'OPTIMAL',
    growthFactor: 1.10,
    supplier: 'Kerala Organics'
  },
  {
    id: 'SKU-D2C-103',
    title: 'Ayurvedic Hair Vitalizer Serum 100ml',
    category: 'Personal Care',
    currentStock: 18,
    safetyStock: 150,
    reorderPoint: 250,
    unitPrice: 890,
    leadTimeDays: 7,
    warehouse: 'DEL-FC-03 (Gurugram)',
    channels: ['Shopify', 'Amazon', 'Flipkart', 'Meesho'],
    status: 'CRITICAL',
    growthFactor: 1.45,
    supplier: 'HerbCraft Labs'
  },
  {
    id: 'SKU-D2C-104',
    title: 'Organic A2 Desi Cow Ghee 500ml',
    category: 'Dairy & Essentials',
    currentStock: 1250,
    safetyStock: 400,
    reorderPoint: 600,
    unitPrice: 750,
    leadTimeDays: 4,
    warehouse: 'BHW-FC-02 (Bhiwandi)',
    channels: ['Amazon', 'Shopify'],
    status: 'OPTIMAL',
    growthFactor: 1.05,
    supplier: 'Gir Gaushala Producer Co'
  },
  {
    id: 'SKU-D2C-105',
    title: 'Matcha Green Tea Ceremonial Grade 100g',
    category: 'Beverages',
    currentStock: 92,
    safetyStock: 100,
    reorderPoint: 160,
    unitPrice: 1200,
    leadTimeDays: 14,
    warehouse: 'BLR-FC-01 (Bengaluru)',
    channels: ['Shopify', 'Amazon'],
    status: 'LOW_STOCK',
    growthFactor: 1.15,
    supplier: 'Nippon Tea Exports'
  },
  {
    id: 'SKU-D2C-106',
    title: 'Raw Wildflower Forest Honey 500g',
    category: 'Gourmet & Spices',
    currentStock: 2100,
    safetyStock: 500,
    reorderPoint: 800,
    unitPrice: 390,
    leadTimeDays: 6,
    warehouse: 'DEL-FC-03 (Gurugram)',
    channels: ['Amazon', 'Flipkart', 'Meesho'],
    status: 'OVERSTOCKED',
    growthFactor: 0.95,
    supplier: 'Himalayan Bee Keepers'
  },
  {
    id: 'SKU-D2C-107',
    title: 'Active Charcoal Clay Face Mask 150g',
    category: 'Personal Care',
    currentStock: 240,
    safetyStock: 200,
    reorderPoint: 350,
    unitPrice: 450,
    leadTimeDays: 8,
    warehouse: 'BHW-FC-02 (Bhiwandi)',
    channels: ['Shopify', 'Meesho', 'Flipkart'],
    status: 'LOW_STOCK',
    growthFactor: 1.30,
    supplier: 'HerbCraft Labs'
  }
];

let salesLogs = [
  { id: 'SL-9901', skuId: 'SKU-D2C-101', skuTitle: 'Kashmiri Saffron Premium 1g', channel: 'Amazon', unitsSold: 42, revenue: 27300, date: '2026-09-12' },
  { id: 'SL-9902', skuId: 'SKU-D2C-103', skuTitle: 'Ayurvedic Hair Vitalizer Serum 100ml', channel: 'Shopify', unitsSold: 65, revenue: 57850, date: '2026-09-12' },
  { id: 'SL-9903', skuId: 'SKU-D2C-102', skuTitle: 'Cold Pressed Virgin Coconut Oil 1L', channel: 'Flipkart', unitsSold: 88, revenue: 42240, date: '2026-09-12' },
  { id: 'SL-9904', skuId: 'SKU-D2C-104', skuTitle: 'Organic A2 Desi Cow Ghee 500ml', channel: 'Amazon', unitsSold: 110, revenue: 82500, date: '2026-09-11' },
  { id: 'SL-9905', skuId: 'SKU-D2C-105', skuTitle: 'Matcha Green Tea Ceremonial Grade 100g', channel: 'Shopify', unitsSold: 18, revenue: 21600, date: '2026-09-11' },
  { id: 'SL-9906', skuId: 'SKU-D2C-107', skuTitle: 'Active Charcoal Clay Face Mask 150g', channel: 'Meesho', unitsSold: 75, revenue: 33750, date: '2026-09-10' }
];

let purchaseOrders = [
  {
    id: 'PO-2026-0881',
    skuId: 'SKU-D2C-103',
    skuTitle: 'Ayurvedic Hair Vitalizer Serum 100ml',
    supplierName: 'HerbCraft Labs',
    unitsOrdered: 500,
    unitCost: 520,
    totalAmount: 260000,
    status: 'IN_TRANSIT',
    orderDate: '2026-09-08',
    expectedDelivery: '2026-09-15',
    destinationWarehouse: 'DEL-FC-03 (Gurugram)'
  },
  {
    id: 'PO-2026-0882',
    skuId: 'SKU-D2C-101',
    skuTitle: 'Kashmiri Saffron Premium 1g',
    supplierName: 'Valley Spices Pvt Ltd',
    unitsOrdered: 300,
    unitCost: 410,
    totalAmount: 123000,
    status: 'ISSUED',
    orderDate: '2026-09-10',
    expectedDelivery: '2026-09-20',
    destinationWarehouse: 'BLR-FC-01 (Bengaluru)'
  },
  {
    id: 'PO-2026-0883',
    skuId: 'SKU-D2C-105',
    skuTitle: 'Matcha Green Tea Ceremonial Grade 100g',
    supplierName: 'Nippon Tea Exports',
    unitsOrdered: 200,
    unitCost: 780,
    totalAmount: 156000,
    status: 'DRAFT',
    orderDate: '2026-09-12',
    expectedDelivery: '2026-09-26',
    destinationWarehouse: 'BLR-FC-01 (Bengaluru)'
  }
];

let alerts = [
  {
    id: 'ALT-1001',
    skuId: 'SKU-D2C-103',
    severity: 'CRITICAL',
    type: 'STOCKOUT_IMMINENT',
    title: 'Critical Stockout Risk (2 Days Left)',
    description: 'Current stock (18 units) will deplete within 48 hours based on recent 1.45x sales surge on Shopify.',
    recommendedAction: 'Expedite PO-2026-0881 or initiate air freight dispatch from supplier.',
    createdAt: '2026-09-13T08:30:00Z',
    status: 'ACTIVE'
  },
  {
    id: 'ALT-1002',
    skuId: 'SKU-D2C-101',
    severity: 'HIGH',
    type: 'REORDER_POINT_REACHED',
    title: 'Reorder Point Breached',
    description: 'Stock (45 units) fallen below reorder threshold (200 units). Upcoming Diwali festival surge predicted.',
    recommendedAction: 'Issue pending PO-2026-0882 to Valley Spices.',
    createdAt: '2026-09-13T07:15:00Z',
    status: 'ACTIVE'
  },
  {
    id: 'ALT-1003',
    skuId: 'SKU-D2C-107',
    severity: 'MEDIUM',
    type: 'RTO_SURGE_DETECTED',
    title: 'High RTO Spike on Meesho Channel',
    description: 'Return-to-origin rates for Charcoal Mask spiked to 14.2% in North region dispatches.',
    recommendedAction: 'Trigger COD pre-verification IVR for orders > ₹1,000.',
    createdAt: '2026-09-12T16:40:00Z',
    status: 'ACTIVE'
  }
];

let settings = {
  forecastHorizonDays: 30,
  seasonalityIndex: 1.25, // Festive season multiplier
  defaultLeadTimeBufferDays: 3,
  zScoreSafetyStock: 1.65, // 95% service level
  channels: {
    amazon: { connected: true, lastSync: '2026-09-13 11:30 AM', syncIntervalMin: 15 },
    flipkart: { connected: true, lastSync: '2026-09-13 11:25 AM', syncIntervalMin: 30 },
    meesho: { connected: true, lastSync: '2026-09-13 10:50 AM', syncIntervalMin: 60 },
    shopify: { connected: true, lastSync: '2026-09-13 11:42 AM', syncIntervalMin: 5 }
  },
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    autoCreateDraftPO: true
  }
};

// ================= API ENDPOINTS =================

// 1. Overview / Dashboard Summary
app.get('/api/dashboard/summary', (req, res) => {
  const totalSKUs = products.length;
  const criticalCount = products.filter(p => p.currentStock <= p.safetyStock).length;
  const totalStockValue = products.reduce((acc, p) => acc + (p.currentStock * p.unitPrice), 0);
  const pendingPOValue = purchaseOrders.filter(po => po.status !== 'RECEIVED').reduce((acc, po) => acc + po.totalAmount, 0);
  
  // Dynamic forecast calculations
  const totalForecasted30DayDemand = products.reduce((acc, p) => {
    const dailyAvg = (p.reorderPoint / (p.leadTimeDays || 7)) * p.growthFactor;
    return acc + Math.round(dailyAvg * settings.forecastHorizonDays * settings.seasonalityIndex);
  }, 0);

  res.json({
    totalSKUs,
    criticalCount,
    totalStockValue,
    pendingPOValue,
    totalForecasted30DayDemand,
    activeAlertsCount: alerts.filter(a => a.status === 'ACTIVE').length,
    recentSalesTotal: salesLogs.reduce((acc, s) => acc + s.revenue, 0)
  });
});

// 2. Products / Inventory APIs
app.get('/api/products', (req, res) => {
  const { status, category, search } = req.query;
  let filtered = [...products];

  if (status && status !== 'ALL') {
    filtered = filtered.filter(p => p.status === status);
  }
  if (category && category !== 'ALL') {
    filtered = filtered.filter(p => p.category === category);
  }
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(p => p.title.toLowerCase().includes(term) || p.id.toLowerCase().includes(term));
  }

  res.json(filtered);
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    id: `SKU-D2C-${Math.floor(100 + Math.random() * 900)}`,
    title: req.body.title || 'New D2C Product',
    category: req.body.category || 'General',
    currentStock: Number(req.body.currentStock) || 100,
    safetyStock: Number(req.body.safetyStock) || 50,
    reorderPoint: Number(req.body.reorderPoint) || 100,
    unitPrice: Number(req.body.unitPrice) || 299,
    leadTimeDays: Number(req.body.leadTimeDays) || 7,
    warehouse: req.body.warehouse || 'BHW-FC-02 (Bhiwandi)',
    channels: req.body.channels || ['Shopify'],
    status: req.body.currentStock <= req.body.safetyStock ? 'CRITICAL' : 'OPTIMAL',
    growthFactor: 1.1,
    supplier: req.body.supplier || 'Standard Supplier'
  };

  products.unshift(newProduct);
  res.status(201).json(newProduct);
});

app.patch('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  products[index] = { ...products[index], ...req.body };
  // Recalculate status
  const p = products[index];
  if (p.currentStock <= 0) p.status = 'STOCKOUT';
  else if (p.currentStock <= p.safetyStock) p.status = 'CRITICAL';
  else if (p.currentStock <= p.reorderPoint) p.status = 'LOW_STOCK';
  else if (p.currentStock > p.reorderPoint * 2.5) p.status = 'OVERSTOCKED';
  else p.status = 'OPTIMAL';

  res.json(products[index]);
});

// 3. AI Demand Forecasting Engine
app.get('/api/forecast', (req, res) => {
  const horizon = Number(req.query.horizon) || settings.forecastHorizonDays;
  const seasonality = Number(req.query.seasonality) || settings.seasonalityIndex;

  const forecastData = products.map(p => {
    const baseDailyDemand = Math.round((p.reorderPoint / (p.leadTimeDays || 7)) * 0.85);
    const forecastedDemand = Math.round(baseDailyDemand * horizon * p.growthFactor * seasonality);
    const confidenceScore = Math.round(88 + Math.random() * 10);
    const daysUntilStockout = Math.max(1, Math.round(p.currentStock / (baseDailyDemand * p.growthFactor || 1)));
    const recommendedReorderQty = Math.max(0, forecastedDemand + p.safetyStock - p.currentStock);

    return {
      skuId: p.id,
      skuTitle: p.title,
      category: p.category,
      currentStock: p.currentStock,
      safetyStock: p.safetyStock,
      baseDailyDemand,
      forecastedDemand,
      confidenceScore,
      daysUntilStockout,
      recommendedReorderQty,
      growthTrend: `${p.growthFactor > 1 ? '+' : ''}${Math.round((p.growthFactor - 1) * 100)}%`,
      status: daysUntilStockout <= p.leadTimeDays ? 'IMMINENT_STOCKOUT' : (daysUntilStockout <= 15 ? 'LOW_BUFFER' : 'HEALTHY')
    };
  });

  res.json({
    horizonDays: horizon,
    seasonalityMultiplier: seasonality,
    forecasts: forecastData
  });
});

// 4. Sales Entry & CSV Logging
app.get('/api/sales', (req, res) => {
  res.json(salesLogs);
});

app.post('/api/sales', (req, res) => {
  const { skuId, channel, unitsSold, revenue, date } = req.body;
  const sku = products.find(p => p.id === skuId);

  const newLog = {
    id: `SL-${Math.floor(1000 + Math.random() * 9000)}`,
    skuId,
    skuTitle: sku ? sku.title : 'Custom Item',
    channel: channel || 'Shopify',
    unitsSold: Number(unitsSold) || 1,
    revenue: Number(revenue) || (sku ? sku.unitPrice * unitsSold : 0),
    date: date || new Date().toISOString().split('T')[0]
  };

  salesLogs.unshift(newLog);

  // Update inventory stock
  if (sku) {
    sku.currentStock = Math.max(0, sku.currentStock - newLog.unitsSold);
  }

  res.status(201).json(newLog);
});

// 5. Purchase Orders API
app.get('/api/purchase-orders', (req, res) => {
  res.json(purchaseOrders);
});

app.post('/api/purchase-orders', (req, res) => {
  const { skuId, unitsOrdered, supplierName, unitCost, warehouse } = req.body;
  const sku = products.find(p => p.id === skuId);

  const newPO = {
    id: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    skuId,
    skuTitle: sku ? sku.title : req.body.skuTitle || 'Inventory Item',
    supplierName: supplierName || (sku ? sku.supplier : 'Primary Vendor'),
    unitsOrdered: Number(unitsOrdered) || 100,
    unitCost: Number(unitCost) || (sku ? Math.round(sku.unitPrice * 0.6) : 200),
    totalAmount: Number(unitsOrdered) * (Number(unitCost) || (sku ? Math.round(sku.unitPrice * 0.6) : 200)),
    status: 'ISSUED',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    destinationWarehouse: warehouse || (sku ? sku.warehouse : 'BLR-FC-01')
  };

  purchaseOrders.unshift(newPO);
  res.status(201).json(newPO);
});

app.patch('/api/purchase-orders/:id/receive', (req, res) => {
  const po = purchaseOrders.find(p => p.id === req.params.id);
  if (!po) return res.status(404).json({ error: 'PO not found' });

  po.status = 'RECEIVED';
  // Replenish stock in inventory
  const sku = products.find(p => p.id === po.skuId);
  if (sku) {
    sku.currentStock += po.unitsOrdered;
    sku.status = 'OPTIMAL';
  }

  res.json(po);
});

// 6. Alerts API
app.get('/api/alerts', (req, res) => {
  res.json(alerts);
});

app.post('/api/alerts/:id/resolve', (req, res) => {
  const alert = alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });

  alert.status = 'RESOLVED';
  res.json(alert);
});

// 7. Settings API
app.get('/api/settings', (req, res) => {
  res.json(settings);
});

app.post('/api/settings', (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

app.listen(PORT, () => {
  console.log(`OptiStock AI Backend Server listening on port ${PORT}`);
});
