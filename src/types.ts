export type ProductCategory = 
  | 'all'
  | 'semen-mortar'
  | 'besi-baja'
  | 'bata-pasir'
  | 'keramik-granit'
  | 'cat-waterproof'
  | 'pipa-sanitari'
  | 'kayu-plafon'
  | 'alat-baut'
  | (string & {});

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryName: string;
  brand: string;
  price: number;
  unit: string; // 'sak', 'batang', 'm³', 'dus', 'pail', 'galon', 'lembar', 'kolt', 'buah', etc.
  stock: number; // Fisik stok di gudang
  minStockAlert?: number; // Batas minimum stok untuk notifikasi restock (default: 10)
  image: string;
  inStock: boolean;
  minOrder: number;
  isSni: boolean;
  weightKg: number;
  description: string;
  specs: Record<string, string | undefined>;
  bestseller?: boolean;
}

export type StockChangeType = 'restock' | 'sale' | 'adjustment' | 'damaged' | 'initial';

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  unit: string;
  previousStock: number;
  newStock: number;
  difference: number;
  changeType: StockChangeType;
  notes: string;
  actor: string;
  timestamp: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export type DeliveryMethod = 'pickup-store' | 'fleet-pickup' | 'fleet-engkel' | 'fleet-double' | 'fleet-dumptruck';

export interface CustomerOrder {
  customerName: string;
  phone: string;
  address: string;
  district: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: 'transfer' | 'cod' | 'tempo';
  notes: string;
}
