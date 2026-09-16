import React, { useState } from 'react';
import type { Product } from '../types';
import { StatusChip } from '../components/StatusChip';
import { Search, Plus, Filter, Edit3, MapPin, Package } from 'lucide-react';

interface InventoryPageProps {
  products: Product[];
  onAddProduct: (newProduct: Partial<Product>) => void;
  onUpdateStock: (id: string, newStock: number) => void;
  onCreatePO: (skuId: string) => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  products,
  onAddProduct,
  onUpdateStock,
  onCreatePO
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for New Product
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Gourmet & Spices');
  const [newStock, setNewStock] = useState(250);
  const [newSafetyStock, setNewSafetyStock] = useState(80);
  const [newPrice, setNewPrice] = useState(499);
  const [newWarehouse, setNewWarehouse] = useState('BHW-FC-02 (Bhiwandi)');

  const categories = ['ALL', 'Gourmet & Spices', 'Wellness & Oils', 'Personal Care', 'Dairy & Essentials', 'Beverages'];
  const statuses = ['ALL', 'OPTIMAL', 'LOW_STOCK', 'CRITICAL', 'OVERSTOCKED'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct({
      title: newTitle,
      category: newCategory,
      currentStock: Number(newStock),
      safetyStock: Number(newSafetyStock),
      reorderPoint: Number(newSafetyStock) * 2,
      unitPrice: Number(newPrice),
      leadTimeDays: 7,
      warehouse: newWarehouse
    });
    setIsAddModalOpen(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Product & SKU Inventory Directory</h2>
          <p className="text-xs text-gray-400">Manage SKU levels, safety stock buffers, unit costs, and warehouse locations.</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all self-start sm:self-auto font-mono"
        >
          <Plus className="w-4 h-4" />
          <span>Add New SKU</span>
        </button>
      </div>

      {/* Filter & Controls Bar */}
      <div className="card-kinetic rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by SKU Code or Product Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-border-subtle rounded-md pl-9 pr-4 py-2 text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-primary font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-mono text-gray-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-background border border-border-subtle rounded px-2.5 py-1.5 text-xs text-gray-200 font-mono focus:outline-none focus:border-primary"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-background border border-border-subtle rounded px-2.5 py-1.5 text-xs text-gray-200 font-mono focus:outline-none focus:border-primary"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* SKU Table */}
      <div className="card-kinetic rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-gray-400">Displaying {filteredProducts.length} of {products.length} SKUs</span>
          <span className="text-xs font-mono text-primary-light">Currency: INR (₹)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-background text-gray-400 font-mono text-[11px]">
                <th className="py-3 px-3">SKU CODE</th>
                <th className="py-3 px-3">PRODUCT TITLE & CATEGORY</th>
                <th className="py-3 px-3">CURRENT STOCK</th>
                <th className="py-3 px-3">SAFETY STOCK</th>
                <th className="py-3 px-3">UNIT PRICE</th>
                <th className="py-3 px-3">FULFILLMENT FC</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-surface-hover/50 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-primary-light">{p.id}</td>
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-white text-xs">{p.title}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{p.category}</div>
                  </td>

                  <td className="py-3.5 px-3 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{p.currentStock} Units</span>
                      <button
                        onClick={() => {
                          const val = prompt(`Update stock level for ${p.title}:`, p.currentStock.toString());
                          if (val !== null && !isNaN(Number(val))) {
                            onUpdateStock(p.id, Number(val));
                          }
                        }}
                        className="text-gray-400 hover:text-primary-light"
                        title="Quick edit stock"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-gray-300">{p.safetyStock} Units</td>

                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                    ₹{p.unitPrice.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-3 font-mono text-gray-400 text-[11px]">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{p.warehouse.split(' ')[0]}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <StatusChip status={p.status} />
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => onCreatePO(p.id)}
                      className="px-2.5 py-1 rounded bg-surface-hover hover:bg-primary text-gray-300 hover:text-white font-mono text-[11px] border border-border-subtle transition-all"
                    >
                      + Order Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-kinetic rounded-xl max-w-md w-full p-6 space-y-4 border border-border-active shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-primary-light" />
                <span>Add New Product SKU</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-mono mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Ashwagandha Powder 250g"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded p-2 text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-mono mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded p-2 text-white font-mono focus:outline-none"
                  >
                    {categories.filter(c => c !== 'ALL').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-mono mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-background border border-border-subtle rounded p-2 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-mono mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full bg-background border border-border-subtle rounded p-2 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-mono mb-1">Safety Stock</label>
                  <input
                    type="number"
                    required
                    value={newSafetyStock}
                    onChange={(e) => setNewSafetyStock(Number(e.target.value))}
                    className="w-full bg-background border border-border-subtle rounded p-2 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-mono mb-1">Fulfillment Warehouse</label>
                <select
                  value={newWarehouse}
                  onChange={(e) => setNewWarehouse(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded p-2 text-white font-mono focus:outline-none"
                >
                  <option value="BHW-FC-02 (Bhiwandi)">BHW-FC-02 (Bhiwandi, MH)</option>
                  <option value="BLR-FC-01 (Bengaluru)">BLR-FC-01 (Bengaluru, KA)</option>
                  <option value="DEL-FC-03 (Gurugram)">DEL-FC-03 (Gurugram, HR)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-hover text-gray-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-primary hover:bg-primary-hover text-white text-xs font-mono font-semibold"
                >
                  Save Product SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
