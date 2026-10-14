import React, { useState } from 'react';
import { X, Trash2, ArrowRight, Truck, ShoppingBag, FileText, Send, AlertTriangle } from 'lucide-react';
import { CartItem, CustomerOrder, DeliveryMethod } from '../types';
import { DELIVERY_FLEETS } from '../data/products';
import { formatRupiah, formatWeight, generateWhatsAppMessage } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenInvoice: (order: CustomerOrder, shippingCost: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenInvoice
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'items' | 'checkout'>('items');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('fleet-pickup');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'cod' | 'tempo'>('cod');
  const [notes, setNotes] = useState('');

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalWeight = items.reduce((acc, item) => acc + item.product.weightKg * item.quantity, 0);

  // Delivery Cost Calculation
  const selectedFleet = DELIVERY_FLEETS.find(f => f.id === deliveryMethod);
  let shippingCost = 0;
  if (deliveryMethod === 'pickup-store') {
    shippingCost = 0;
  } else if (selectedFleet) {
    if (selectedFleet.freeThreshold > 0 && subtotal >= selectedFleet.freeThreshold) {
      shippingCost = 0;
    } else {
      shippingCost = selectedFleet.basePrice;
    }
  }

  // Weight fleet advisory
  const getWeightAdvice = () => {
    if (totalWeight > 3500) {
      return {
        fleet: 'Truk Double (6 Roda)',
        warning: 'Total muatan berat (>3.5 Ton). Disarankan pengiriman dengan Truk Double atau dibagi 2 rit.'
      };
    } else if (totalWeight > 1200) {
      return {
        fleet: 'Truk Engkel (4 Roda)',
        warning: 'Total berat melebihi kapasitas pick-up kecil. Gunakan Truk Engkel.'
      };
    }
    return {
      fleet: 'Mobil Pick-Up (L300/GranMax)',
      warning: null
    };
  };

  const advice = getWeightAdvice();

  const handleWhatsAppCheckout = () => {
    if (!customerName.trim() || !phone.trim() || (!address.trim() && deliveryMethod !== 'pickup-store')) {
      alert('Mohon lengkapi Nama, No. WhatsApp, dan Alamat Pengiriman terlebih dahulu.');
      return;
    }

    const order: CustomerOrder = {
      customerName,
      phone,
      address,
      district,
      deliveryMethod,
      paymentMethod,
      notes
    };

    const waUrl = generateWhatsAppMessage(items, subtotal, shippingCost, totalWeight, order);
    window.open(waUrl, '_blank');
  };

  const handlePrintReceipt = () => {
    if (!customerName.trim()) {
      alert('Mohon isi minimal Nama Pemesan sebelum mencetak nota.');
      return;
    }

    const order: CustomerOrder = {
      customerName,
      phone,
      address,
      district,
      deliveryMethod,
      paymentMethod,
      notes
    };

    onOpenInvoice(order, shippingCost);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-neutral-900">
              {step === 'items' ? 'Keranjang Belanja Material' : 'Informasi Pengiriman & Pemesan'}
            </h2>
            <span className="text-xs bg-neutral-200 text-neutral-800 font-mono px-2 py-0.5 rounded tabular-nums">
              {items.length} Barang
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="py-20 text-center">
              <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-neutral-800">Keranjang Belanja Masih Kosong</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                Pilih material konstruksi dari katalog atau hitung kebutuhan bahan Anda di kalkulator.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
              >
                Mulai Belanja Bahan
              </button>
            </div>
          ) : step === 'items' ? (
            <div className="space-y-4">
              {/* Weight Advisory Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>Total Estimasi Berat:</span>
                  <span className="font-mono text-amber-950 tabular-nums">{formatWeight(totalWeight)}</span>
                </div>
                {advice.warning ? (
                  <div className="flex items-start gap-1.5 text-[11px] text-amber-800 mt-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{advice.warning}</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-amber-800">
                    Kapasitas aman diangkut armada toko standar.
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="divide-y divide-neutral-200">
                {items.map((item) => (
                  <div key={item.product.id} className="py-3 flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded object-cover bg-neutral-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-neutral-900 leading-snug truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-neutral-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        {item.product.brand} · {formatRupiah(item.product.price)} / {item.product.unit}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-neutral-300 rounded bg-neutral-50">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-neutral-200 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-neutral-200 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-xs font-bold text-neutral-900 tabular-nums">
                          {formatRupiah(item.product.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={onClearCart}
                  className="text-xs text-neutral-400 hover:text-red-600 underline cursor-pointer"
                >
                  Kosongkan Keranjang
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: CHECKOUT & ADDRESS */
            <div className="space-y-4">
              <button
                onClick={() => setStep('items')}
                className="text-xs text-amber-700 hover:underline font-semibold cursor-pointer mb-2 inline-flex items-center gap-1"
              >
                ← Kembali ke Rincian Barang
              </button>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Nama Pemesan / Penanggung Jawab *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bpk. Bambang Sutrisno"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Nomor WhatsApp Pemesan *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0812xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Pilihan Pengambilan & Armada *
                  </label>
                  <select
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                  >
                    <option value="fleet-pickup">Mobil Pick-Up (L300/GranMax) - Akses Gang/Perumahan</option>
                    <option value="fleet-engkel">Truk Engkel 4 Roda - Kapasitas s.d 3.5 Ton</option>
                    <option value="fleet-double">Truk Double 6 Roda - Kapasitas s.d 8 Ton</option>
                    <option value="fleet-dumptruck">Dump Truck (Pasir & Batu Split)</option>
                    <option value="pickup-store">Ambil Mandiri Langsung di Toko</option>
                  </select>
                </div>

                {deliveryMethod !== 'pickup-store' && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Alamat Proyek & Patokan Jalan *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Contoh: Jl. Melati No. 12, Perum Indah Blok C3 (Depan Pos Satpam, jalan muat truk engkel)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Metode Pembayaran
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`py-2 text-[11px] font-bold rounded border cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'border-amber-600 bg-amber-50 text-amber-900'
                          : 'border-neutral-200 text-neutral-600'
                      }`}
                    >
                      COD di Proyek
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transfer')}
                      className={`py-2 text-[11px] font-bold rounded border cursor-pointer ${
                        paymentMethod === 'transfer'
                          ? 'border-amber-600 bg-amber-50 text-amber-900'
                          : 'border-neutral-200 text-neutral-600'
                      }`}
                    >
                      Transfer Bank
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('tempo')}
                      className={`py-2 text-[11px] font-bold rounded border cursor-pointer ${
                        paymentMethod === 'tempo'
                          ? 'border-amber-600 bg-amber-50 text-amber-900'
                          : 'border-neutral-200 text-neutral-600'
                      }`}
                    >
                      Tempo Proyek
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Catatan Tambahan (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Minta dikirim pagi jam 09.00 WIB"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer & Actions */}
        {items.length > 0 && (
          <div className="p-5 border-t border-neutral-200 bg-neutral-50 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal Material:</span>
                <span className="font-mono tabular-nums">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Ongkir Armada:</span>
                <span className="font-mono tabular-nums">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-600 font-bold">GRATIS</span>
                  ) : (
                    formatRupiah(shippingCost)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total Estimasi:</span>
                <span className="font-mono text-amber-700 tabular-nums">{formatRupiah(subtotal + shippingCost)}</span>
              </div>
            </div>

            {step === 'items' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Lanjut ke Pengiriman & Pemesan</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Pesanan via WhatsApp Toko</span>
                </button>

                <button
                  onClick={handlePrintReceipt}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Pratinjau Nota / Unduh PDF</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
