import { StockLog } from '../types';

export const INITIAL_STOCK_LOGS: StockLog[] = [
  {
    id: 'log-101',
    productId: 'smn-01',
    productName: 'Semen Gresik Portland PCC 40kg',
    unit: 'sak',
    previousStock: 250,
    newStock: 350,
    difference: 100,
    changeType: 'restock',
    notes: 'Penerimaan muatan DO Pabrik Semen Indonesia (Tronton No. Pol B 9821 KXA)',
    actor: 'admin',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString() // 5 hours ago
  },
  {
    id: 'log-102',
    productId: 'bsi-02',
    productName: 'Besi Beton Polos 10mm SNI Panjang 12 Meter',
    unit: 'batang',
    previousStock: 290,
    newStock: 240,
    difference: -50,
    changeType: 'sale',
    notes: 'Pengiriman borongan proyek ruko PT Cipta Bangun Jaya (Faktur #8892)',
    actor: 'logistik',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString() // 12 hours ago
  },
  {
    id: 'log-103',
    productId: 'bta-01',
    productName: 'Bata Ringan Hebel AAC Grade A Tebal 10cm',
    unit: 'm³',
    previousStock: 45,
    newStock: 35,
    difference: -10,
    changeType: 'sale',
    notes: 'Diantar truk engkel proyek perumahan Griya Indah Kav. 12',
    actor: 'admin',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
  },
  {
    id: 'log-104',
    productId: 'krm-01',
    productName: 'Granit Tile 60x60 Glazed Polished Calacatta Gold',
    unit: 'dus',
    previousStock: 93,
    newStock: 90,
    difference: -3,
    changeType: 'damaged',
    notes: 'Ubin retak/sompal saat pemindahan forklift di gudang 2 (Afkir)',
    actor: 'logistik',
    timestamp: new Date(Date.now() - 3600000 * 36).toISOString() // 1.5 days ago
  },
  {
    id: 'log-105',
    productId: 'cat-01',
    productName: 'No Drop Cat Pelapis Anti Bocor Abu-Abu 20kg',
    unit: 'pail',
    previousStock: 25,
    newStock: 40,
    difference: 15,
    changeType: 'restock',
    notes: 'Restock mingguan distributor Avian Brands Surabaya',
    actor: 'admin',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString() // 2 days ago
  },
  {
    id: 'log-106',
    productId: 'bta-03',
    productName: 'Pasir Cor Extra Hitam Muntilan / Lumajang',
    unit: 'truk',
    previousStock: 15,
    newStock: 12,
    difference: -3,
    changeType: 'sale',
    notes: 'Kirim langsung 3 rit dump truck cor dak lantai 2 Bpk. Sutrisno',
    actor: 'admin',
    timestamp: new Date(Date.now() - 3600000 * 60).toISOString() // 2.5 days ago
  },
  {
    id: 'log-107',
    productId: 'ppa-03',
    productName: 'Kloset Duduk Monoblok Dual Flush Soft Close',
    unit: 'buah',
    previousStock: 20,
    newStock: 18,
    difference: -2,
    changeType: 'adjustment',
    notes: 'Stock opname fisik akhir pekan gudang sanitari',
    actor: 'admin',
    timestamp: new Date(Date.now() - 3600000 * 72).toISOString() // 3 days ago
  }
];
