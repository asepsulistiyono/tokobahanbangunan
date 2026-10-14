import React, { useState } from 'react';
import { X, Download, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Product } from '../../types';
import { exportProductsToCSV, parseProductsCSV, downloadSampleCSVTemplate } from '../../utils/csv';
import { formatRupiah } from '../../utils/formatters';

interface CsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onImportProducts: (imported: Product[], mode: 'append' | 'overwrite') => void;
}

export const CsvModal: React.FC<CsvModalProps> = ({
  isOpen,
  onClose,
  products,
  onImportProducts
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'template'>('export');
  const [importMode, setImportMode] = useState<'append' | 'overwrite'>('append');
  const [parsedPreview, setParsedPreview] = useState<Product[] | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleExport = () => {
    exportProductsToCSV(products);
    setSuccessNotice(`Berhasil mengekspor ${products.length} produk ke file CSV.`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setImportError(null);
    setParsedPreview(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) {
        setImportError('File kosong atau tidak dapat dibaca.');
        return;
      }

      const result = parseProductsCSV(text);
      if (!result.success) {
        setImportError(result.error || 'Gagal memproses file CSV.');
      } else {
        setParsedPreview(result.products);
      }
    };
    reader.onerror = () => {
      setImportError('Gagal membaca file dari perangkat.');
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!parsedPreview || parsedPreview.length === 0) return;
    onImportProducts(parsedPreview, importMode);
    setSuccessNotice(`Berhasil mengimpor ${parsedPreview.length} produk ke dalam katalog!`);
    setTimeout(() => {
      setSuccessNotice(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full border border-neutral-200 shadow-2xl overflow-hidden my-8 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold">Import / Export CSV (Excel)</h3>
              <p className="text-xs text-neutral-400">Sinkronisasi data massal bahan bangunan</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 text-xs font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTab === 'export'
                ? 'border-amber-600 text-neutral-950 bg-white rounded-t-lg'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Ekspor ke CSV
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 text-xs font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTab === 'import'
                ? 'border-amber-600 text-neutral-950 bg-white rounded-t-lg'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Impor dari CSV
          </button>
          <button
            onClick={() => setActiveTab('template')}
            className={`px-4 py-2 text-xs font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTab === 'template'
                ? 'border-amber-600 text-neutral-950 bg-white rounded-t-lg'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Format & Template
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {successNotice && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* TAB 1: EXPORT */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2 text-xs">
                <h4 className="font-bold text-neutral-900">Ekspor Seluruh Database Produk Toko</h4>
                <p className="text-neutral-600">
                  Data yang diekspor berformat <strong>.CSV</strong> standar UTF-8 dengan BOM (Byte Order Mark), sehingga langsung terbuka rapi di Microsoft Excel tanpa masalah karakter ataupun angka terpotong.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="bg-white p-2.5 rounded border border-neutral-200">
                    <span className="text-neutral-500">Jumlah Produk yang Diekspor:</span>
                    <div className="text-base font-bold text-neutral-900 font-mono tabular-nums">
                      {products.length} SKU
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-neutral-200">
                    <span className="text-neutral-500">Kelengkapan Kolom:</span>
                    <div className="text-xs font-bold text-neutral-800">
                      ID, Nama, Merek, Harga, Stok, SNI, Satuan
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Unduh File CSV ({products.length} Produk)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: IMPORT */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center bg-neutral-50 hover:bg-neutral-100 transition-colors">
                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-neutral-800">Pilih Berkas CSV dari Perangkat</h4>
                <p className="text-[11px] text-neutral-500 mt-1 mb-3">
                  Mendukung file .csv hasil ekspor dari Excel atau Google Sheets
                </p>

                <label className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                  <span>Pilih Berkas CSV</span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {fileName && (
                  <div className="text-xs text-amber-800 font-semibold mt-2">
                    Berkas terpilih: {fileName}
                  </div>
                )}
              </div>

              {importError && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {parsedPreview && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-800">
                      Pratinjau Data ({parsedPreview.length} Produk Terbaca):
                    </span>
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Format Valid
                    </span>
                  </div>

                  {/* Mode radio */}
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2 text-xs">
                    <span className="font-semibold text-neutral-700">Metode Penulisan Data:</span>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'append'}
                          onChange={() => setImportMode('append')}
                          className="accent-amber-600"
                        />
                        <span>Tambahkan ke Produk Saat Ini (Gabung)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'overwrite'}
                          onChange={() => setImportMode('overwrite')}
                          className="accent-amber-600"
                        />
                        <span className="text-red-700 font-semibold">Gantikan Seluruh Katalog (Timpa)</span>
                      </label>
                    </div>
                  </div>

                  {/* Preview Table */}
                  <div className="border border-neutral-200 rounded-lg overflow-x-auto max-h-48 text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-neutral-100 text-[11px] font-bold text-neutral-700 sticky top-0">
                        <tr>
                          <th className="p-2">Nama Produk</th>
                          <th className="p-2">Merek</th>
                          <th className="p-2">Harga</th>
                          <th className="p-2">Stok</th>
                          <th className="p-2">Satuan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 bg-white">
                        {parsedPreview.slice(0, 10).map((p, idx) => (
                          <tr key={idx} className="hover:bg-neutral-50">
                            <td className="p-2 font-medium truncate max-w-[180px]">{p.name}</td>
                            <td className="p-2 text-neutral-600">{p.brand}</td>
                            <td className="p-2 font-mono tabular-nums">{formatRupiah(p.price)}</td>
                            <td className="p-2 font-mono tabular-nums">{p.stock}</td>
                            <td className="p-2 text-neutral-500">{p.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {parsedPreview.length > 10 && (
                    <div className="text-[11px] text-neutral-500 text-center">
                      ...dan {parsedPreview.length - 10} produk lainnya.
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleConfirmImport}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Konfirmasi Impor {parsedPreview.length} Produk</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TEMPLATE */}
          {activeTab === 'template' && (
            <div className="space-y-4 text-xs">
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2">
                <h4 className="font-bold text-neutral-900">Petunjuk Format Kolom CSV</h4>
                <p className="text-neutral-600">
                  Untuk mengimpor data produk dalam jumlah ratusan sekaligus dari Microsoft Excel, gunakan format kolom berikut:
                </p>

                <div className="bg-white p-3 rounded border border-neutral-200 font-mono text-[11px] text-neutral-800 space-y-1">
                  <div><strong>ID Produk:</strong> smn-01 (opsional, otomatis dibuat jika kosong)</div>
                  <div><strong>Nama Produk:</strong> Semen Gresik 40kg (wajib)</div>
                  <div><strong>Kategori ID:</strong> semen-mortar / besi-baja / bata-pasir</div>
                  <div><strong>Merek:</strong> Gresik / Tiga Roda / KS</div>
                  <div><strong>Harga (Rp):</strong> 56500 (angka tanpa titik)</div>
                  <div><strong>Satuan:</strong> sak / batang / dus / m3</div>
                  <div><strong>Stok Gudang:</strong> 150 (angka stok riil)</div>
                  <div><strong>Standar SNI:</strong> Ya / Tidak</div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={downloadSampleCSVTemplate}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Unduh Contoh File Template Excel (.CSV)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-xs font-semibold hover:bg-neutral-100"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
