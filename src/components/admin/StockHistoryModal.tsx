import React, { useState, useMemo } from 'react';
import { 
  X, 
  History, 
  Download, 
  Search, 
  Filter, 
  PackagePlus, 
  PackageMinus, 
  AlertOctagon, 
  SlidersHorizontal, 
  Trash2,
  Calendar
} from 'lucide-react';
import { StockLog, StockChangeType } from '../../types';

interface StockHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: StockLog[];
  onClearLogs?: () => void;
}

export const StockHistoryModal: React.FC<StockHistoryModalProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Type filter
      if (selectedType !== 'all' && log.changeType !== selectedType) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = log.productName.toLowerCase().includes(q);
        const matchNotes = log.notes.toLowerCase().includes(q);
        const matchActor = log.actor.toLowerCase().includes(q);
        if (!matchName && !matchNotes && !matchActor) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [logs, selectedType, searchQuery, sortOrder]);

  // Export Stock Logs to CSV
  const handleExportCSV = () => {
    const headers = ['ID Log', 'Tanggal & Waktu', 'Nama Produk', 'Tipe Mutasi', 'Perubahan', 'Satuan', 'Stok Awal', 'Stok Akhir', 'Alasan / Keterangan', 'Petugas'];
    const rows = filteredLogs.map((l) => [
      l.id,
      new Date(l.timestamp).toLocaleString('id-ID'),
      l.productName,
      l.changeType === 'restock' ? 'Barang Masuk (Restock)' :
      l.changeType === 'sale' ? 'Barang Keluar (Terjual)' :
      l.changeType === 'damaged' ? 'Rusak / Afkir' :
      l.changeType === 'adjustment' ? 'Stock Opname' : 'Inisialisasi',
      l.difference > 0 ? `+${l.difference}` : `${l.difference}`,
      l.unit,
      l.previousStock,
      l.newStock,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      l.actor
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Riwayat_Mutasi_Stok_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getBadgeForType = (type: StockChangeType) => {
    switch (type) {
      case 'restock':
        return {
          label: 'Barang Masuk',
          className: 'bg-emerald-50 text-emerald-800 border-emerald-200'
        };
      case 'sale':
        return {
          label: 'Barang Keluar',
          className: 'bg-rose-50 text-rose-800 border-rose-200'
        };
      case 'damaged':
        return {
          label: 'Rusak / Afkir',
          className: 'bg-amber-50 text-amber-900 border-amber-200'
        };
      case 'adjustment':
        return {
          label: 'Stock Opname',
          className: 'bg-blue-50 text-blue-800 border-blue-200'
        };
      default:
        return {
          label: 'Inisialisasi',
          className: 'bg-neutral-50 text-neutral-700 border-neutral-200'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full border border-neutral-200 shadow-2xl overflow-hidden my-8 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-neutral-800 rounded-lg text-amber-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Riwayat & Log Mutasi Perubahan Stok</h3>
              <p className="text-xs text-neutral-400">
                Pencatatan kronologis arus barang masuk, barang keluar, dan penyesuaian fisik gudang
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari nama produk, alasan, atau petugas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">Semua Tipe Mutasi ({logs.length})</option>
              <option value="restock">Barang Masuk (Restock)</option>
              <option value="sale">Barang Keluar (Terjual)</option>
              <option value="adjustment">Stock Opname / Koreksi</option>
              <option value="damaged">Rusak / Afkir</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="newest">Waktu: Paling Baru</option>
              <option value="oldest">Waktu: Paling Lama</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              title="Unduh seluruh catatan mutasi ke Excel"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-neutral-500">
              <History className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-neutral-700">Tidak ada riwayat mutasi yang cocok.</p>
              <p className="text-xs text-neutral-500 mt-0.5">Coba ubah kata kunci pencarian atau ganti filter tipe.</p>
            </div>
          ) : (
            <div className="border border-neutral-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 text-[11px] font-bold text-neutral-700 uppercase tracking-wider border-b border-neutral-200">
                  <tr>
                    <th className="py-2.5 px-3">Tanggal & Waktu</th>
                    <th className="py-2.5 px-3">Produk Material</th>
                    <th className="py-2.5 px-3">Tipe Mutasi</th>
                    <th className="py-2.5 px-3 text-center">Perubahan</th>
                    <th className="py-2.5 px-3 text-center">Stok (Awal → Akhir)</th>
                    <th className="py-2.5 px-3">Alasan & Petugas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {filteredLogs.map((log) => {
                    const badge = getBadgeForType(log.changeType);
                    const isPositive = log.difference > 0;
                    const dateFormatted = new Date(log.timestamp).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    });
                    const timeFormatted = new Date(log.timestamp).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <tr key={log.id} className="hover:bg-neutral-50">
                        {/* Date */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="font-semibold text-neutral-900">{dateFormatted}</div>
                          <div className="text-[11px] text-neutral-500 font-mono">{timeFormatted} WIB</div>
                        </td>

                        {/* Product */}
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-neutral-900 truncate max-w-xs">{log.productName}</div>
                          <div className="text-[11px] font-mono text-neutral-400">ID: {log.productId}</div>
                        </td>

                        {/* Badge Type */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${badge.className}`}>
                            {badge.label}
                          </span>
                        </td>

                        {/* Difference (+ or -) */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span className={`font-mono font-black text-xs ${
                            isPositive ? 'text-emerald-700' : 'text-rose-700'
                          }`}>
                            {isPositive ? `+${log.difference}` : log.difference} {log.unit}
                          </span>
                        </td>

                        {/* Stock range */}
                        <td className="py-2.5 px-3 text-center font-mono tabular-nums text-neutral-700 whitespace-nowrap">
                          <span className="text-neutral-500">{log.previousStock}</span>
                          <span className="text-neutral-400 mx-1">→</span>
                          <span className="font-bold text-neutral-900">{log.newStock}</span>
                        </td>

                        {/* Reason / Notes */}
                        <td className="py-2.5 px-3">
                          <div className="text-neutral-800 text-xs leading-relaxed">
                            {log.notes || 'Penyesuaian stok sistem'}
                          </div>
                          <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                            Oleh: <strong className="text-neutral-700">{log.actor}</strong>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs">
          <div className="text-neutral-500">
            Menampilkan {filteredLogs.length} dari total {logs.length} catatan mutasi.
          </div>

          <div className="flex items-center gap-2">
            {onClearLogs && logs.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Apakah Anda yakin ingin mengosongkan seluruh riwayat log mutasi stok? Tindakan ini tidak dapat dibatalkan.')) {
                    onClearLogs();
                  }
                }}
                className="text-neutral-400 hover:text-rose-600 underline text-xs cursor-pointer mr-2"
              >
                Kosongkan Log
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 border border-neutral-300 text-neutral-700 rounded-lg text-xs font-semibold hover:bg-neutral-100 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
