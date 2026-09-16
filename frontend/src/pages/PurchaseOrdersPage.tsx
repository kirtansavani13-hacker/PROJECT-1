import React, { useState } from 'react';
import type { PurchaseOrder, Product } from '../types';
import { StatusChip } from '../components/StatusChip';
import { ShoppingBag, Plus, CheckCircle2, Calendar } from 'lucide-react';

interface PurchaseOrdersPageProps {
  purchaseOrders: PurchaseOrder[];
  products: Product[];
  onCreatePO: (po: Partial<PurchaseOrder>) => void;
  onReceivePO: (id: string) => void;
  presetSkuId?: string | null;
}

export const PurchaseOrdersPage: React.FC<PurchaseOrdersPageProps> = ({
  purchaseOrders,
  products,
  onCreatePO,
  onReceivePO,
  presetSkuId
}) => {
  const [isModalOpen, setIsModalOpen] = useState(!!presetSkuId);
  const [selectedSkuId, setSelectedSkuId] = useState(presetSkuId || (products[0]?.id || ''));
  const [units, setUnits] = useState(250);
  const [supplier, setSupplier] = useState('Standard Vendor');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const selectedProduct = products.find(p => p.id === selectedSkuId);

  const filteredPOs = filterStatus === 'ALL'
    ? purchaseOrders
    : purchaseOrders.filter(p => p.status === filterStatus);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePO({
      skuId: selectedSkuId,
      skuTitle: selectedProduct ? selectedProduct.title : 'Inventory Item',
      supplierName: supplier || (selectedProduct ? selectedProduct.supplier : 'Primary Vendor'),
      unitsOrdered: Number(units),
      unitCost: selectedProduct ? Math.round(selectedProduct.unitPrice * 0.6) : 250,
      destinationWarehouse: selectedProduct ? selectedProduct.warehouse : 'BLR-FC-01'
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Purchase Order Management & Procurement</h2>
          <p className="text-xs text-gray-400">Track purchase order lifecycle, vendor lead times, and warehouse receiving dispatches.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all font-mono"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New Purchase Order</span>
        </button>
      </div>

      {/* Pipeline Status Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`p-4 rounded-xl card-kinetic border transition-all text-left ${filterStatus === 'ALL' ? 'border-primary' : 'border-border-subtle'}`}
        >
          <span className="text-[10px] font-mono text-gray-400 uppercase">Total PO Pipeline</span>
          <div className="text-xl font-bold text-white font-mono mt-1">{purchaseOrders.length} Orders</div>
        </button>

        <button
          onClick={() => setFilterStatus('ISSUED')}
          className={`p-4 rounded-xl card-kinetic border transition-all text-left ${filterStatus === 'ISSUED' ? 'border-amber-500' : 'border-border-subtle'}`}
        >
          <span className="text-[10px] font-mono text-amber-400 uppercase">Issued / Awaiting Vendor</span>
          <div className="text-xl font-bold text-amber-400 font-mono mt-1">
            {purchaseOrders.filter(p => p.status === 'ISSUED').length} Orders
          </div>
        </button>

        <button
          onClick={() => setFilterStatus('IN_TRANSIT')}
          className={`p-4 rounded-xl card-kinetic border transition-all text-left ${filterStatus === 'IN_TRANSIT' ? 'border-blue-500' : 'border-border-subtle'}`}
        >
          <span className="text-[10px] font-mono text-blue-400 uppercase">In-Transit Freight</span>
          <div className="text-xl font-bold text-blue-400 font-mono mt-1">
            {purchaseOrders.filter(p => p.status === 'IN_TRANSIT').length} Orders
          </div>
        </button>

        <button
          onClick={() => setFilterStatus('RECEIVED')}
          className={`p-4 rounded-xl card-kinetic border transition-all text-left ${filterStatus === 'RECEIVED' ? 'border-emerald-500' : 'border-border-subtle'}`}
        >
          <span className="text-[10px] font-mono text-emerald-400 uppercase">Received & Restocked</span>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            {purchaseOrders.filter(p => p.status === 'RECEIVED').length} Orders
          </div>
        </button>
      </div>

      {/* PO Data Table */}
      <div className="card-kinetic rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Purchase Orders List</h3>
          <span className="text-xs font-mono text-gray-400">Total Investment: ₹{purchaseOrders.reduce((a, b) => a + b.totalAmount, 0).toLocaleString('en-IN')}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-background text-gray-400 font-mono text-[11px]">
                <th className="py-3 px-3">PO NUMBER</th>
                <th className="py-3 px-3">SKU & ITEM NAME</th>
                <th className="py-3 px-3">SUPPLIER VENDOR</th>
                <th className="py-3 px-3">UNITS ORDERED</th>
                <th className="py-3 px-3">TOTAL VALUE</th>
                <th className="py-3 px-3">EXPECTED DELIVERY</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredPOs.map((po) => (
                <tr key={po.id} className="hover:bg-surface-hover/50 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-primary-light">{po.id}</td>

                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-white text-xs">{po.skuTitle}</div>
                    <div className="text-[10px] text-gray-400 font-mono">SKU: {po.skuId}</div>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-gray-300">{po.supplierName}</td>

                  <td className="py-3.5 px-3 font-mono font-bold text-white">{po.unitsOrdered} Units</td>

                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                    ₹{po.totalAmount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-3 font-mono text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>{po.expectedDelivery}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <StatusChip status={po.status} />
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    {po.status !== 'RECEIVED' ? (
                      <button
                        onClick={() => onReceivePO(po.id)}
                        className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-mono text-[11px] flex items-center gap-1 ml-auto shadow"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Receive Stock</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">Stock Deposited</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to Create PO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-kinetic rounded-xl max-w-md w-full p-6 space-y-4 border border-border-active shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary-light" />
                <span>Create Purchase Order</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-mono mb-1">Target Product SKU</label>
                <select
                  value={selectedSkuId}
                  onChange={(e) => setSelectedSkuId(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded p-2 text-white font-mono focus:outline-none"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.title} (Stock: {p.currentStock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-mono mb-1">Quantity to Order (Units)</label>
                <input
                  type="number"
                  required
                  min="10"
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                  className="w-full bg-background border border-border-subtle rounded p-2 text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-mono mb-1">Supplier / Manufacturer</label>
                <input
                  type="text"
                  required
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded p-2 text-white focus:outline-none"
                />
              </div>

              <div className="p-3 bg-background rounded border border-border-subtle font-mono text-[11px] space-y-1">
                <div className="flex justify-between text-gray-400">
                  <span>Unit Cost Estimate:</span>
                  <span>₹{selectedProduct ? Math.round(selectedProduct.unitPrice * 0.6) : 250}</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-1 border-t border-border-subtle">
                  <span>Total Order Amount:</span>
                  <span className="text-emerald-400">₹{((selectedProduct ? Math.round(selectedProduct.unitPrice * 0.6) : 250) * units).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-hover text-gray-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-primary hover:bg-primary-hover text-white text-xs font-mono font-semibold"
                >
                  Issue PO Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
