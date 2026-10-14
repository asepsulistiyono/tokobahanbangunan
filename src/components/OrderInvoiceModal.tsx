import React from 'react';
import { X, Printer, Download, CheckCircle2, Building, Phone, MapPin, Truck } from 'lucide-react';
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

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  isOpen,
  onClose,
  items,
  order,
  subtotal,
  shippingCost,
  totalWeight
}) => {
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full border border-neutral-300 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print bg-neutral-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">Pratinjau Nota & Surat Pesanan Resmi</span>
            <span className="text-xs text-neutral-400 font-mono">#{invoiceNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div className="p-8 sm:p-10 font-sans text-neutral-900 bg-white" id="printable-invoice">
          {/* Company Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-neutral-900 pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-neutral-950 uppercase">
                TB Mega Bangunan Sentosa
              </h1>
              <p className="text-xs text-neutral-600 mt-1">
                Pusat Grosir Bahan Bangunan & Pasokan Material Konstruksi SNI
              </p>
              <div className="text-xs text-neutral-500 mt-2 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-neutral-400" />
                  <span>Jl. Raya Industri Utama No. 88, Pergudangan Bangunan Mandiri</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-neutral-400" />
                  <span>Hotline: (021) 8899-7711 / WA: 0812-3456-7890</span>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-0 text-left sm:text-right">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Surat Pesanan / Faktur
              </div>
              <div className="text-base font-extrabold font-mono text-neutral-950">
                {invoiceNumber}
              </div>
              <div className="text-xs text-neutral-600 mt-1">Tanggal: {currentDate}</div>
              <div className="inline-block mt-2 px-2.5 py-0.5 bg-neutral-100 border border-neutral-300 text-[11px] font-semibold rounded text-neutral-700">
                Status: Menunggu Konfirmasi Toko
              </div>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-neutral-50 border border-neutral-200 rounded-lg mb-6 text-xs">
            <div>
              <div className="font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Penerima & Lokasi Proyek:
              </div>
              <div className="font-bold text-sm text-neutral-900">{order.customerName || 'Pelanggan Toko'}</div>
              <div className="text-neutral-600 mt-0.5">WhatsApp: {order.phone || '-'}</div>
              <div className="text-neutral-600 mt-1 leading-relaxed">
                Alamat: {order.address || 'Pengambilan langsung di toko'}
              </div>
            </div>

            <div>
              <div className="font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Logistik & Ketentuan:
              </div>
              <div>
                <span className="text-neutral-500">Armada Pengiriman: </span>
                <span className="font-semibold text-neutral-900">
                  {order.deliveryMethod === 'pickup-store' ? 'Ambil Sendiri di Toko' :
                   order.deliveryMethod === 'fleet-pickup' ? 'Mobil Pick-Up L300' :
                   order.deliveryMethod === 'fleet-engkel' ? 'Truk Engkel 4 Roda' :
                   order.deliveryMethod === 'fleet-double' ? 'Truk Double 6 Roda' : 'Dump Truck'}
                </span>
              </div>
              <div className="mt-1">
                <span className="text-neutral-500">Metode Bayar: </span>
                <span className="font-semibold text-neutral-900">
                  {order.paymentMethod === 'transfer' ? 'Transfer Bank' :
                   order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Tempo Kontraktor'}
                </span>
              </div>
              <div className="mt-1">
                <span className="text-neutral-500">Estimasi Berat: </span>
                <span className="font-mono font-bold text-neutral-800">{formatWeight(totalWeight)}</span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-neutral-900 text-neutral-800 uppercase font-bold text-[11px]">
                  <th className="py-2.5 px-2">No</th>
                  <th className="py-2.5 px-3">Uraian Material / Merek</th>
                  <th className="py-2.5 px-2 text-center">Jumlah</th>
                  <th className="py-2.5 px-2 text-center">Satuan</th>
                  <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                  <th className="py-2.5 px-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {items.map((item, idx) => (
                  <tr key={item.product.id}>
                    <td className="py-2.5 px-2 font-mono text-neutral-500">{idx + 1}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-neutral-900">{item.product.name}</div>
                      <div className="text-[10px] text-neutral-500">{item.product.brand} · {item.product.isSni ? 'SNI' : 'Standar'}</div>
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono font-bold text-neutral-900 tabular-nums">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-2 text-center text-neutral-600">{item.product.unit}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-neutral-700">
                      {formatRupiah(item.product.price)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-neutral-950 tabular-nums">
                      {formatRupiah(item.product.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-neutral-200 pt-4 mb-8">
            <div className="text-xs text-neutral-500 max-w-xs">
              <div className="font-bold text-neutral-700 mb-1">Catatan Pesanan:</div>
              <p>{order.notes || 'Harap periksa kelengkapan fisik dan jumlah muatan saat pembongkaran di lokasi proyek.'}</p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs">
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
              <div className="flex justify-between text-sm font-extrabold text-neutral-950 border-t border-neutral-300 pt-2">
                <span>Total Biaya:</span>
                <span className="font-mono tabular-nums text-amber-700">{formatRupiah(subtotal + shippingCost)}</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 text-center text-xs text-neutral-600 pt-4 border-t border-neutral-200">
            <div>
              <div>Hormat Kami,</div>
              <div className="font-semibold text-neutral-900 mt-0.5">TB Mega Bangunan Sentosa</div>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[11px] font-serif italic text-neutral-400 border border-dashed border-neutral-300 px-3 py-1 rounded">
                  [ Stempel & Kasir Toko ]
                </span>
              </div>
              <div className="border-t border-neutral-400 w-36 mx-auto pt-1 font-semibold text-neutral-900">
                Bagian Logistik
              </div>
            </div>

            <div>
              <div>Penerima / Pembeli,</div>
              <div className="font-semibold text-neutral-900 mt-0.5">Pihak Proyek</div>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[11px] font-serif italic text-neutral-300">
                  ( Tanda Tangan Penerima )
                </span>
              </div>
              <div className="border-t border-neutral-400 w-36 mx-auto pt-1 font-semibold text-neutral-900">
                {order.customerName || '...............................'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
