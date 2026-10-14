import { CartItem, CustomerOrder } from '../types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatWeight(weightKg: number): string {
  if (weightKg >= 1000) {
    return `${(weightKg / 1000).toFixed(2)} Ton`;
  }
  return `${weightKg.toLocaleString('id-ID')} Kg`;
}

export function generateWhatsAppMessage(
  items: CartItem[],
  subtotal: number,
  shippingCost: number,
  totalWeight: number,
  order: CustomerOrder
): string {
  const storePhone = '6281234567890'; // Representative store WA number
  const orderNumber = `TB-${Date.now().toString().slice(-6)}`;
  
  let text = `*PESANAN BARU - TB MEGA BANGUNAN SENTOSA*\n`;
  text += `No. Pesanan: #${orderNumber}\n`;
  text += `Tanggal: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}\n`;
  text += `--------------------------------------\n`;
  text += `*DATA PEMESAN & LOKASI PROYEK*\n`;
  text += `Nama: ${order.customerName}\n`;
  text += `No. WhatsApp: ${order.phone}\n`;
  text += `Alamat Kirim: ${order.address}\n`;
  text += `Metode Pengiriman: ${
    order.deliveryMethod === 'pickup-store' ? 'Ambil Sendiri di Toko' :
    order.deliveryMethod === 'fleet-pickup' ? 'Diantar Mobil Pick-Up (L300/GranMax)' :
    order.deliveryMethod === 'fleet-engkel' ? 'Diantar Truk Engkel 4 Roda' :
    order.deliveryMethod === 'fleet-double' ? 'Diantar Truk Double 6 Roda' : 'Dump Truck (Pasir/Batu)'
  }\n`;
  text += `Metode Pembayaran: ${
    order.paymentMethod === 'transfer' ? 'Transfer Bank (BCA / Mandiri / BRI)' :
    order.paymentMethod === 'cod' ? 'Bayar di Tempat (COD saat muatan tiba)' : 'Tempo / Kontraktor Proyek'
  }\n`;
  if (order.notes) {
    text += `Catatan Khusus: ${order.notes}\n`;
  }
  text += `--------------------------------------\n`;
  text += `*DAFTAR BAHAN BANGUNAN*\n`;
  
  items.forEach((item, idx) => {
    const itemTotal = item.product.price * item.quantity;
    text += `${idx + 1}. ${item.product.name}\n`;
    text += `   ${item.quantity} ${item.product.unit} x ${formatRupiah(item.product.price)} = ${formatRupiah(itemTotal)}\n`;
  });

  text += `--------------------------------------\n`;
  text += `Total Berat Muatan: ~${formatWeight(totalWeight)}\n`;
  text += `Subtotal Barang: ${formatRupiah(subtotal)}\n`;
  text += `Ongkir Armada: ${shippingCost === 0 ? 'GRATIS (Sesuai Ketentuan)' : formatRupiah(shippingCost)}\n`;
  text += `*TOTAL ESTIMASI: ${formatRupiah(subtotal + shippingCost)}*\n\n`;
  text += `Mohon konfirmasi ketersediaan stok & jadwal pengiriman. Terima kasih!`;

  return `https://wa.me/${storePhone}?text=${encodeURIComponent(text)}`;
}
