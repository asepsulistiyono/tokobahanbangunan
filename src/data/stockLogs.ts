import { StockLog } from '../types';

export const INITIAL_STOCK_LOGS: StockLog[] = [
  {
    id: 'log-001',
    productId: 'smn-01',
    productName: 'Semen Tiga Roda Portland Composite (PCC) 50kg',
    unit: 'sak',
    previousStock: 250,
    newStock: 350,
    difference: 100,
    changeType: 'restock',
    notes: 'Penerimaan kiriman distributor Indocement DO #8821',
    actor: 'Bpk. Hendra (Kepala Gudang)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
  },
  {
    id: 'log-002',
    productId: 'bsi-01',
    productName: 'Besi Beton Ulir D13 SNI (TS420B) 12m',
    unit: 'batang',
    previousStock: 480,
    newStock: 380,
    difference: -100,
    changeType: 'sale',
    notes: 'Pengiriman borongan Proyek Ruko Sentosa Barat',
    actor: 'Ahmad Fauzi (Sales Counter)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString() // 18 hours ago
  },
  {
    id: 'log-003',
    productId: 'bta-01',
    productName: 'Bata Ringan Hebel AAC Standar 60x20x10 cm',
    unit: 'm³',
    previousStock: 45,
    newStock: 80,
    difference: 35,
    changeType: 'restock',
    notes: 'Bongkar muat armada tronton pabrik Falcon AAC',
    actor: 'Bpk. Hendra (Kepala Gudang)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString() // yesterday
  },
  {
    id: 'log-004',
    productId: 'smn-04',
    productName: 'Semen Putih Mortar Utama MU-400 Perekat Keramik 25kg',
    unit: 'sak',
    previousStock: 12,
    newStock: 8,
    difference: -4,
    changeType: 'damaged',
    notes: 'Kemasan sobek terkena rembesan air saat hujan deras',
    actor: 'Yanto (Staf Gudang)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString()
  },
  {
    id: 'log-005',
    productId: 'krm-01',
    productName: 'Granit Tile Valentino Gress Carara White 60x60 Polished',
    unit: 'dus',
    previousStock: 120,
    newStock: 118,
    difference: -2,
    changeType: 'adjustment',
    notes: 'Stock Opname fisik mingguan, selisih display showroom',
    actor: 'Admin Toko',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString()
  },
  {
    id: 'log-006',
    productId: 'cat-01',
    productName: 'Dulux Weathershield Cat Dinding Eksterior Brilliant White 20L',
    unit: 'pail',
    previousStock: 15,
    newStock: 35,
    difference: 20,
    changeType: 'restock',
    notes: 'Restock mingguan distributor AkzoNobel',
    actor: 'Bpk. Hendra (Kepala Gudang)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString()
  }
];
