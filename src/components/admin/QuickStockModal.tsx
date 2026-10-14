import React, { useState } from 'react';
import { X, PackagePlus, PackageMinus, Check, ArrowRight, AlertTriangle } from 'lucide-react';
import { Product, StockChangeType } from '../../types';

interface QuickStockModalProps {
  product: Product | null;
  onClose: () => void;
  onUpdateStock: (productId: string, newStock: number, changeType?: StockChangeType, notes?: string) => void;
}

export const QuickStockModal: React.FC<QuickStockModalProps> = ({
  product,
  onClose,
  onUpdateStock
}) => {
  if (!product) return null;

  const currentStock = product.stock ?? (product.inStock ? 50 : 0);
  const [mode, setMode] = useState<StockChangeType>('restock');
  const [amount, setAmount] = useState<number>(20);
  const [notes, setNotes] = useState<string>('');

  const calculateNewStock = () => {
    if (mode === 'restock') return currentStock + amount;
    if (mode === 'sale' || mode === 'damaged') return Math.max(0, currentStock - amount);
    return Math.max(0, amount); // adjustment
  };

  const newStock = calculateNewStock();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNotes = notes.trim() || (
      mode === 'restock' ? `Restock masuk ${amount} ${product.unit}` :
      mode === 'sale' ? `Penjualan ${amount} ${product.unit}` :
      mode === 'damaged' ? `Barang rusak/afkir ${amount} ${product.unit}` :
      `Penyesuaian stock opname fisik ke ${amount} ${product.unit}`
    );

    onUpdateStock(product.id, newStock, mode, finalNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-2xl max-w-md w-full border border-neutral-200 shadow-2xl overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800">
          <div>
            <h3 className="text-sm font-bold">Penyesuaian & Mutasi Stok</h3>
            <p className="text-xs text-neutral-400 mt-0.5">{product.name}</p>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 flex items-center justify-between">
            <span className="text-xs text-neutral-600 font-medium">Stok Fisik Saat Ini:</span>
            <span className="text-base font-extrabold font-mono text-neutral-900">
              {currentStock} {product.unit}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-2">
              Jenis Perubahan Mutasi:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setMode('restock'); setAmount(20); setNotes('Penerimaan DO distributor pabrik'); }}
                className={`py-2 px-2 text-xs font-bold rounded border cursor-pointer text-left ${
                  mode === 'restock'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                + Restock (Masuk)
              </button>
              <button
                type="button"
                onClick={() => { setMode('sale'); setAmount(10); setNotes('Penjualan offline / borongan proyek'); }}
                className={`py-2 px-2 text-xs font-bold rounded border cursor-pointer text-left ${
                  mode === 'sale'
                    ? 'border-rose-600 bg-rose-50 text-rose-900'
                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                - Penjualan (Keluar)
              </button>
              <button
                type="button"
                onClick={() => { setMode('damaged'); setAmount(2); setNotes('Pecah / retak saat bongkar muat'); }}
                className={`py-2 px-2 text-xs font-bold rounded border cursor-pointer text-left ${
                  mode === 'damaged'
                    ? 'border-amber-600 bg-amber-50 text-amber-900'
                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                - Rusak / Afkir
              </button>
              <button
                type="button"
                onClick={() => { setMode('adjustment'); setAmount(currentStock); setNotes('Stock opname fisik gudang mingguan'); }}
                className={`py-2 px-2 text-xs font-bold rounded border cursor-pointer text-left ${
                  mode === 'adjustment'
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                = Stock Opname
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              {mode === 'restock' ? 'Jumlah Stok Masuk:' :
               mode === 'sale' ? 'Jumlah Terjual:' :
               mode === 'damaged' ? 'Jumlah Barang Rusak:' : 'Atur Stok Fisik Menjadi:'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-mono font-bold bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
              />
              <span className="text-xs text-neutral-600 font-semibold">{product.unit}</span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex gap-2">
            {[10, 25, 50, 100].map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setAmount(v)}
                className="flex-1 py-1 text-xs border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 rounded text-neutral-700 cursor-pointer"
              >
                {mode === 'restock' ? `+${v}` : mode === 'adjustment' ? `${v}` : `-${v}`}
              </button>
            ))}
          </div>

          {/* Mutation notes / reason */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Alasan Mutasi & Nomor Bukti (Surat Jalan / PO)
            </label>
            <input
              type="text"
              placeholder="Misal: DO Pabrik No. 9811 / Retur borongan"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center justify-between text-xs">
            <span className="text-amber-800 font-medium">Hasil Akhir Stok:</span>
            <span className="text-lg font-black font-mono text-amber-950 tabular-nums">
              {newStock} {product.unit}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-semibold rounded-lg hover:bg-neutral-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Simpan & Catat Log Mutasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
