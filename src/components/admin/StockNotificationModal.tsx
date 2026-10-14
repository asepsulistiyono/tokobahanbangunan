import React from 'react';
import { X, AlertTriangle, Boxes, PackagePlus, ArrowRight, Share2, Printer, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { formatRupiah, formatWeight } from '../../utils/formatters';

interface StockNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onQuickRestock: (product: Product) => void;
}

export const StockNotificationModal: React.FC<StockNotificationModalProps> = ({
  isOpen,
  onClose,
  products,
  onQuickRestock
}) => {
  if (!isOpen) return null;

  // Filter items where stock <= minStockAlert (default 10)
  const alertProducts = products.filter(p => {
    const currentStock = p.stock ?? (p.inStock ? 50 : 0);
    const threshold = p.minStockAlert ?? 10;
    return currentStock <= threshold;
  }).sort((a, b) => {
    const stockA = a.stock ?? 0;
    const stockB = b.stock ?? 0;
    return stockA - stockB; // zero stock first
  });

  const outOfStockItems = alertProducts.filter(p => (p.stock ?? 0) === 0);
  const lowStockItems = alertProducts.filter(p => (p.stock ?? 0) > 0);

  // Generate Purchase Order WhatsApp message for suppliers
  const handleShareSupplierWA = () => {
    let msg = `*DAFTAR PERMINTAAN RESTOCK BAHAN BANGUNAN (PO)*\n`;
    msg += `TB Mega Bangunan Sentosa\n`;
    msg += `Tanggal: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}\n`;
    msg += `--------------------------------------\n`;
    msg += `Daftar Material Mendesak / Menipis:\n\n`;

    alertProducts.forEach((p, idx) => {
      const stock = p.stock ?? 0;
      const targetMin = p.minStockAlert ?? 10;
      const need = Math.max(p.minOrder * 5, targetMin * 3);
      msg += `${idx + 1}. ${p.name} (${p.brand})\n`;
      msg += `   Sisa Stok: ${stock} ${p.unit} | Usulan Order: ${need} ${p.unit}\n`;
    });

    msg += `\n--------------------------------------\n`;
    msg += `Mohon konfirmasi harga dan jadwal pengiriman dari distributor. Terima kasih.`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full border border-neutral-200 shadow-2xl overflow-hidden my-8 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Pusat Notifikasi Stok Minimum</h3>
              <p className="text-xs text-neutral-400">
                Peringatan dini material habis atau di bawah batas ambang persediaan
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {alertProducts.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-neutral-900">Semua Persediaan Aman</h4>
              <p className="text-xs text-neutral-600 mt-1 max-w-md mx-auto">
                Tidak ada material bangunan yang menyentuh batas minimum stok saat ini. Seluruh SKU di atas ambang batas aman.
              </p>
            </div>
          ) : (
            <>
              {/* Summary Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-red-700 font-bold">Stok Habis (0 Unit):</span>
                    <p className="text-[11px] text-red-600 mt-0.5">Penjualan etalase dinonaktifkan otomatis</p>
                  </div>
                  <span className="text-xl font-black font-mono text-red-700 tabular-nums">
                    {outOfStockItems.length} SKU
                  </span>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-amber-800 font-bold">Stok Kritis / Menipis:</span>
                    <p className="text-[11px] text-amber-700 mt-0.5">Mendekati ambang batas minimum</p>
                  </div>
                  <span className="text-xl font-black font-mono text-amber-900 tabular-nums">
                    {lowStockItems.length} SKU
                  </span>
                </div>
              </div>

              {/* Table of low stock items */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-50 text-[11px] font-bold text-neutral-700 uppercase tracking-wider border-b border-neutral-200">
                    <tr>
                      <th className="py-2.5 px-3">Produk Material</th>
                      <th className="py-2.5 px-3">Kategori</th>
                      <th className="py-2.5 px-3 text-center">Stok Saat Ini</th>
                      <th className="py-2.5 px-3 text-center">Batas Minimum</th>
                      <th className="py-2.5 px-3 text-right">Tindakan Restock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 bg-white">
                    {alertProducts.map((p) => {
                      const stock = p.stock ?? 0;
                      const minAlert = p.minStockAlert ?? 10;
                      const isZero = stock === 0;

                      return (
                        <tr key={p.id} className="hover:bg-neutral-50">
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-neutral-900 truncate max-w-xs">{p.name}</div>
                            <div className="text-[11px] text-neutral-500">{p.brand} · ID: {p.id}</div>
                          </td>

                          <td className="py-2.5 px-3 text-neutral-600">
                            {p.categoryName}
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <span className={`font-mono font-extrabold px-2 py-0.5 rounded text-xs ${
                              isZero 
                                ? 'bg-red-100 text-red-700 font-bold' 
                                : 'bg-amber-100 text-amber-900 font-bold'
                            }`}>
                              {stock} {p.unit}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-center font-mono text-neutral-500">
                            ≤ {minAlert} {p.unit}
                          </td>

                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                onClose();
                                onQuickRestock(p);
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              <PackagePlus className="w-3.5 h-3.5 text-amber-400" />
                              <span>Restock</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-neutral-500">
            Total {alertProducts.length} material bangunan perlu dipantau persediaannya.
          </div>

          <div className="flex items-center gap-2">
            {alertProducts.length > 0 && (
              <button
                onClick={handleShareSupplierWA}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Kirim List PO ke WA Supplier</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 border border-neutral-300 text-neutral-700 rounded-lg text-xs font-semibold hover:bg-neutral-100"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
