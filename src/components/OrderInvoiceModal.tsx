import React, { useState, useEffect } from 'react';
import { X, Printer, MapPin, Phone, Check, SlidersHorizontal, Eye } from 'lucide-react';
import { CartItem, CustomerOrder } from '../types';
import { formatRupiah, formatWeight } from '../utils/formatters';

interface OrderInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  order: CustomerOrder;
  subtotal: number;
  shippingCost: number;
  totalWeight: number;
}

type ModalWidthSize = 'compact' | 'standard' | 'wide';

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  isOpen,
  onClose,
  items,
  order,
  subtotal,
  shippingCost,
  totalWeight
}) => {
  // Allow user to toggle width & scale so it never dominates or covers screen unexpectedly
  const [modalSize, setModalSize] = useState<ModalWidthSize>('standard');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const invoiceNumber = `INV-${new Date().getFullYear()}${String(Date.now()).slice(-5)}`;
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  // Determine width based on chosen view size
  const maxWidthClass =
    modalSize === 'compact'
      ? 'max-w-xl'
      : modalSize === 'wide'
      ? 'max-w-3xl'
      : 'max-w-2xl';

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6"
      onClick={onClose}
    >
      {/* Floating Close Button for Instant Exit regardless of screen width / resolution */}
      <button
        onClick={onClose}
        type="button"
        className="no-print fixed top-3 right-3 sm:top-5 sm:right-5 z-60 bg-neutral-900/90 hover:bg-red-600 text-white p-2.5 rounded-full shadow-2xl border border-neutral-700/80 hover:border-red-500 transition-all cursor-pointer flex items-center gap-1.5 px-3.5 backdrop-blur-md active:scale-95"
        title="Tutup Pratinjau (Esc)"
        aria-label="Tutup Pratinjau Faktur"
      >
        <X className="w-5 h-5 stroke-[2.5]" />
        <span className="text-xs font-bold uppercase tracking-wider hidden xs:inline sm:inline">Tutup</span>
      </button>

      <div
        className={`relative bg-neutral-100 rounded-2xl w-full ${maxWidthClass} max-h-[90vh] flex flex-col border border-neutral-300 shadow-2xl overflow-hidden transition-all duration-200 my-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden on physical print) */}
        <div className="no-print bg-neutral-900 text-white px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2 shrink-0 border-b border-neutral-800">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-xs sm:text-sm font-bold truncate">Pratinjau Nota Resmi</span>
            <span className="text-[11px] text-amber-400 font-mono bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700 shrink-0">
              #{invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* View Size Selector - hidden on small/medium screens to prevent pushing buttons */}
            <div className="hidden md:flex items-center bg-neutral-800 rounded-lg p-0.5 border border-neutral-700 text-[11px]">
              <span className="px-2 text-neutral-400 flex items-center gap-1 font-medium">
                <SlidersHorizontal className="w-3 h-3" />
                <span>Ukuran:</span>
              </span>
              <button
                type="button"
                onClick={() => setModalSize('compact')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer font-medium ${
                  modalSize === 'compact'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                    : 'text-neutral-300 hover:text-white'
                }`}
                title="Ukuran Ringkas (576px)"
              >
                Ringkas
              </button>
              <button
                type="button"
                onClick={() => setModalSize('standard')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer font-medium ${
                  modalSize === 'standard'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                    : 'text-neutral-300 hover:text-white'
                }`}
                title="Ukuran Standar (672px)"
              >
                Standar
              </button>
              <button
                type="button"
                onClick={() => setModalSize('wide')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer font-medium ${
                  modalSize === 'wide'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                    : 'text-neutral-300 hover:text-white'
                }`}
                title="Ukuran Lebar (768px)"
              >
                Lebar
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm active:scale-95 shrink-0"
              title="Cetak Faktur atau Simpan ke PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden xs:inline sm:inline">Cetak / PDF</span>
              <span className="xs:hidden sm:hidden">Cetak</span>
            </button>

            {/* Close Button - prominent, red/neutral contrast, never obscured */}
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-800 hover:bg-red-600 text-neutral-200 hover:text-white rounded-lg border border-neutral-700 hover:border-red-500 transition-all cursor-pointer shrink-0 font-medium text-xs shadow-xs"
              title="Tutup Pratinjau (Esc)"
              aria-label="Tutup jendela pratinjau nota"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
              <span className="text-xs font-bold">Tutup</span>
            </button>
          </div>
        </div>

        {/* Scrollable Document Area (Centered paper like PDF viewer) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-neutral-200/70">
          <div
            id="printable-invoice"
            className="bg-white rounded-xl border border-neutral-300 shadow-sm p-5 sm:p-7 font-sans text-neutral-900 max-w-full mx-auto"
          >
            {/* Company Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-neutral-900 pb-5 mb-5 gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-950 uppercase">
                  TB Mega Bangunan Sentosa
                </h1>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Pusat Grosir Bahan Bangunan & Pasokan Material Konstruksi SNI
                </p>
                <div className="text-[11px] sm:text-xs text-neutral-500 mt-2 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                    <span>Jl. Raya Industri Utama No. 88, Pergudangan Bangunan Mandiri</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-neutral-400 shrink-0" />
                    <span>Hotline: (021) 8899-7711 / WA: 0812-3456-7890</span>
                  </div>
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Surat Pesanan / Faktur
                </div>
                <div className="text-sm sm:text-base font-extrabold font-mono text-neutral-950">
                  {invoiceNumber}
                </div>
                <div className="text-[11px] text-neutral-600 mt-0.5">Tanggal: {currentDate}</div>
                <div className="inline-block mt-1.5 px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-[10px] font-semibold rounded text-neutral-700">
                  Status: Menunggu Konfirmasi Toko
                </div>
              </div>
            </div>

            {/* Customer & Delivery Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-neutral-50 border border-neutral-200 rounded-lg mb-5 text-[11px] sm:text-xs">
              <div>
                <div className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                  Penerima & Lokasi Proyek:
                </div>
                <div className="font-bold text-neutral-900">{order.customerName || 'Pelanggan Toko'}</div>
                <div className="text-neutral-600 mt-0.5">WhatsApp: {order.phone || '-'}</div>
                <div className="text-neutral-600 mt-0.5 leading-relaxed">
                  Alamat: {order.address || 'Pengambilan langsung di toko'}
                </div>
              </div>

              <div>
                <div className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                  Logistik & Ketentuan:
                </div>
                <div>
                  <span className="text-neutral-500">Armada: </span>
                  <span className="font-semibold text-neutral-900">
                    {order.deliveryMethod === 'pickup-store'
                      ? 'Ambil Sendiri di Toko'
                      : order.deliveryMethod === 'fleet-pickup'
                      ? 'Mobil Pick-Up L300'
                      : order.deliveryMethod === 'fleet-engkel'
                      ? 'Truk Engkel 4 Roda'
                      : order.deliveryMethod === 'fleet-double'
                      ? 'Truk Double 6 Roda'
                      : 'Dump Truck'}
                  </span>
                </div>
                <div className="mt-0.5">
                  <span className="text-neutral-500">Metode Bayar: </span>
                  <span className="font-semibold text-neutral-900">
                    {order.paymentMethod === 'transfer'
                      ? 'Transfer Bank'
                      : order.paymentMethod === 'cod'
                      ? 'Cash on Delivery (COD)'
                      : 'Tempo Kontraktor'}
                  </span>
                </div>
                <div className="mt-0.5">
                  <span className="text-neutral-500">Estimasi Berat: </span>
                  <span className="font-mono font-bold text-neutral-800">{formatWeight(totalWeight)}</span>
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-[11px] sm:text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-neutral-900 text-neutral-800 uppercase font-bold text-[10px]">
                    <th className="py-2 px-1.5 w-8">No</th>
                    <th className="py-2 px-2.5">Uraian Material / Merek</th>
                    <th className="py-2 px-1.5 text-center">Jumlah</th>
                    <th className="py-2 px-1.5 text-center">Satuan</th>
                    <th className="py-2 px-2.5 text-right">Harga Satuan</th>
                    <th className="py-2 px-2.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {items.map((item, idx) => (
                    <tr key={item.product.id}>
                      <td className="py-2 px-1.5 font-mono text-neutral-500">{idx + 1}</td>
                      <td className="py-2 px-2.5">
                        <div className="font-semibold text-neutral-900">{item.product.name}</div>
                        <div className="text-[10px] text-neutral-500">
                          {item.product.brand} · {item.product.isSni ? 'SNI' : 'Standar'}
                        </div>
                      </td>
                      <td className="py-2 px-1.5 text-center font-mono font-bold text-neutral-900 tabular-nums">
                        {item.quantity}
                      </td>
                      <td className="py-2 px-1.5 text-center text-neutral-600">{item.product.unit}</td>
                      <td className="py-2 px-2.5 text-right tabular-nums text-neutral-700">
                        {formatRupiah(item.product.price)}
                      </td>
                      <td className="py-2 px-2.5 text-right font-semibold text-neutral-950 tabular-nums">
                        {formatRupiah(item.product.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-t border-neutral-200 pt-3.5 mb-6">
              <div className="text-[11px] text-neutral-500 max-w-xs">
                <div className="font-bold text-neutral-700 mb-0.5">Catatan Pesanan:</div>
                <p className="leading-relaxed">
                  {order.notes ||
                    'Harap periksa kelengkapan fisik dan jumlah muatan saat pembongkaran di lokasi proyek.'}
                </p>
              </div>

              <div className="w-full sm:w-60 space-y-1 text-[11px] sm:text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal Barang:</span>
                  <span className="font-mono tabular-nums">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Ongkir Armada:</span>
                  <span className="font-mono tabular-nums">
                    {shippingCost === 0 ? 'GRATIS' : formatRupiah(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm font-extrabold text-neutral-950 border-t border-neutral-300 pt-1.5">
                  <span>Total Biaya:</span>
                  <span className="font-mono tabular-nums text-amber-700">
                    {formatRupiah(subtotal + shippingCost)}
                  </span>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-4 text-center text-[10px] sm:text-xs text-neutral-600 pt-3 border-t border-neutral-200">
              <div>
                <div>Hormat Kami,</div>
                <div className="font-semibold text-neutral-900 mt-0.5">TB Mega Bangunan Sentosa</div>
                <div className="h-12 sm:h-14 flex items-center justify-center">
                  <span className="text-[10px] font-serif italic text-neutral-400 border border-dashed border-neutral-300 px-2 py-0.5 rounded">
                    [ Stempel & Kasir Toko ]
                  </span>
                </div>
                <div className="border-t border-neutral-400 w-32 sm:w-36 mx-auto pt-0.5 font-semibold text-neutral-900">
                  Bagian Logistik
                </div>
              </div>

              <div>
                <div>Penerima / Pembeli,</div>
                <div className="font-semibold text-neutral-900 mt-0.5">Pihak Proyek</div>
                <div className="h-12 sm:h-14 flex items-center justify-center">
                  <span className="text-[10px] font-serif italic text-neutral-300">
                    ( Tanda Tangan Penerima )
                  </span>
                </div>
                <div className="border-t border-neutral-400 w-32 sm:w-36 mx-auto pt-0.5 font-semibold text-neutral-900">
                  {order.customerName || '...............................'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer (Hidden on print) */}
        <div className="no-print bg-white px-4 sm:px-5 py-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="text-xs text-neutral-500">
            Total <span className="font-bold text-neutral-900">{items.length} item material</span> · Estimasi{' '}
            <span className="font-bold text-neutral-900">{formatWeight(totalWeight)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              Tutup Pratinjau
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
