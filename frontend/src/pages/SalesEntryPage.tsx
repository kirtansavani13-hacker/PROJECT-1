import React, { useState } from 'react';
import type { SalesLog, Product } from '../types';
import { BadgeIndianRupee, Plus, Upload, CheckCircle2, FileSpreadsheet } from 'lucide-react';

interface SalesEntryPageProps {
  salesLogs: SalesLog[];
  products: Product[];
  onAddSale: (sale: { skuId: string; channel: string; unitsSold: number; revenue?: number; date?: string }) => void;
}

export const SalesEntryPage: React.FC<SalesEntryPageProps> = ({
  salesLogs,
  products,
  onAddSale
}) => {
  const [selectedSkuId, setSelectedSkuId] = useState(products[0]?.id || '');
  const [channel, setChannel] = useState('Amazon');
  const [unitsSold, setUnitsSold] = useState(10);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [successMessage, setSuccessMessage] = useState('');

  const selectedProduct = products.find(p => p.id === selectedSkuId);
  const estimatedRevenue = selectedProduct ? selectedProduct.unitPrice * unitsSold : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSale({
      skuId: selectedSkuId,
      channel,
      unitsSold: Number(unitsSold),
      revenue: estimatedRevenue,
      date
    });

    setSuccessMessage(`Logged ${unitsSold} units for ${selectedProduct?.title || selectedSkuId} on ${channel}`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Daily Multi-Channel Sales Entry</h2>
        <p className="text-xs text-gray-400">Log channel sales manually or bulk import marketplace reports to update inventory levels instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manual Sales Log Form */}
        <div className="card-kinetic rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BadgeIndianRupee className="w-4 h-4 text-emerald-light" />
              <span>Log Daily Channel Sale</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">Real-time Sync</span>
          </div>

          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-mono mb-1">Select Product SKU</label>
              <select
                value={selectedSkuId}
                onChange={(e) => setSelectedSkuId(e.target.value)}
                className="w-full bg-background border border-border-subtle rounded p-2.5 text-white font-mono focus:outline-none focus:border-primary"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.id} - {p.title} (Stock: {p.currentStock})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-mono mb-1">Channel Source</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded p-2.5 text-white font-mono focus:outline-none focus:border-primary"
                >
                  <option value="Amazon">Amazon.in</option>
                  <option value="Flipkart">Flipkart</option>
                  <option value="Meesho">Meesho</option>
                  <option value="Shopify">Shopify Store</option>
                  <option value="Offline Store">Retail / Offline</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-mono mb-1">Units Sold</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={unitsSold}
                  onChange={(e) => setUnitsSold(Number(e.target.value))}
                  className="w-full bg-background border border-border-subtle rounded p-2.5 text-white font-mono focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-mono mb-1">Transaction Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-background border border-border-subtle rounded p-2.5 text-white font-mono focus:outline-none focus:border-primary"
              />
            </div>

            <div className="p-3 bg-background rounded-lg border border-border-subtle font-mono text-[11px] space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>Calculated Unit Price:</span>
                <span>₹{selectedProduct?.unitPrice || 0}</span>
              </div>
              <div className="flex justify-between text-white font-bold pt-1 border-t border-border-subtle">
                <span>Total Order Revenue:</span>
                <span className="text-emerald-400">₹{estimatedRevenue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded bg-primary hover:bg-primary-hover text-white text-xs font-mono font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Record Sale & Deduct Stock</span>
            </button>
          </form>
        </div>

        {/* CSV Batch Upload & Recent Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* CSV Drag & Drop Upload */}
          <div className="card-kinetic rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-primary-light" />
                <span>Bulk CSV / Excel Order Import</span>
              </h3>
              <span className="text-[10px] font-mono text-gray-400">Supported: Amazon Order Report, Flipkart Settlement</span>
            </div>

            <div className="border-2 border-dashed border-border-subtle hover:border-primary rounded-xl p-6 text-center space-y-2 cursor-pointer transition-all bg-background/50">
              <Upload className="w-8 h-8 text-primary-light mx-auto animate-bounce" />
              <p className="text-xs font-semibold text-white">Drag and drop your marketplace CSV report here</p>
              <p className="text-[11px] text-gray-400">or click to browse from file explorer (.csv, .xlsx)</p>
            </div>
          </div>

          {/* Sales History Log Table */}
          <div className="card-kinetic rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Recent Sales Log Activity</h3>
              <span className="text-xs font-mono text-gray-400">Total Entries: {salesLogs.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle bg-background text-gray-400 font-mono text-[11px]">
                    <th className="py-2.5 px-3">LOG ID</th>
                    <th className="py-2.5 px-3">SKU & ITEM NAME</th>
                    <th className="py-2.5 px-3">CHANNEL</th>
                    <th className="py-2.5 px-3">UNITS SOLD</th>
                    <th className="py-2.5 px-3">REVENUE</th>
                    <th className="py-2.5 px-3">DATE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {salesLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface-hover/50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-gray-300">{log.id}</td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-white text-xs">{log.skuTitle}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{log.skuId}</div>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-surface-hover text-primary-light border border-border-subtle">
                          {log.channel}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-white">{log.unitsSold} Units</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        ₹{log.revenue.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-400">{log.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
