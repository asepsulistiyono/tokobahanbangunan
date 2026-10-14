import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Boxes, 
  TrendingUp, 
  AlertTriangle, 
  FolderTree, 
  FileSpreadsheet, 
  ArrowLeft, 
  ShieldCheck, 
  Check, 
  ExternalLink,
  ChevronRight,
  LogOut,
  User,
  Bell,
  History
} from 'lucide-react';
import { Product, CategoryItem, StockLog, StockChangeType } from '../../types';
import { formatRupiah, formatWeight } from '../../utils/formatters';
import { ProductFormModal } from './ProductFormModal';
import { QuickStockModal } from './QuickStockModal';
import { CategoryManagerModal } from './CategoryManagerModal';
import { CsvModal } from './CsvModal';
import { StockNotificationModal } from './StockNotificationModal';
import { StockHistoryModal } from './StockHistoryModal';

interface AdminDashboardProps {
  products: Product[];
  categories: CategoryItem[];
  stockLogs: StockLog[];
  adminUser?: { username: string; role: string; email?: string } | null;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateStock: (productId: string, newStock: number, changeType?: StockChangeType, notes?: string) => void;
  onAddCategory: (cat: CategoryItem) => void;
  onEditCategory: (id: string, updatedName: string, updatedDesc?: string) => void;
  onDeleteCategory: (id: string) => void;
  onImportProducts: (imported: Product[], mode: 'append' | 'overwrite') => void;
  onClearStockLogs?: () => void;
  onExitAdmin: () => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  stockLogs,
  adminUser,
  onSaveProduct,
  onDeleteProduct,
  onUpdateStock,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onImportProducts,
  onClearStockLogs,
  onExitAdmin,
  onLogout
}) => {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'critical' | 'out'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock-asc' | 'stock-desc' | 'price-desc'>('name');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [quickStockProduct, setQuickStockProduct] = useState<Product | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Computed KPIs
  const totalSku = products.length;
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * (p.stock ?? (p.inStock ? 50 : 0))), 0);
  const minStockAlertCount = products.filter(p => (p.stock ?? (p.inStock ? 50 : 0)) <= (p.minStockAlert ?? 10)).length;
  const criticalStockCount = products.filter(p => (p.stock ?? (p.inStock ? 50 : 0)) > 0 && (p.stock ?? 50) <= (p.minStockAlert ?? 10)).length;
  const outOfStockCount = products.filter(p => (p.stock ?? (p.inStock ? 50 : 0)) === 0).length;

  // Filtered product list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Stock status filter
      const stock = p.stock ?? (p.inStock ? 50 : 0);
      const threshold = p.minStockAlert ?? 10;
      if (stockFilter === 'critical' && (stock > threshold || stock === 0)) {
        return false;
      }
      if (stockFilter === 'out' && stock > 0) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchId = p.id.toLowerCase().includes(q);
        const matchCat = p.categoryName.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchId && !matchCat) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const stockA = a.stock ?? (a.inStock ? 50 : 0);
      const stockB = b.stock ?? (b.inStock ? 50 : 0);

      if (sortBy === 'stock-asc') return stockA - stockB;
      if (sortBy === 'stock-desc') return stockB - stockA;
      if (sortBy === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
  }, [products, selectedCategory, stockFilter, searchQuery, sortBy]);

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsProductModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 pb-16">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-30 bg-neutral-900 text-white border-b border-neutral-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onExitAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                title="Kembali ke Etalase Toko"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Lihat Toko</span>
              </button>

              <div className="h-5 w-px bg-neutral-800 hidden sm:block" />

              <div>
                <span className="text-sm font-extrabold text-white tracking-tight">
                  TB Mega Bangunan
                </span>
                <span className="text-xs text-amber-400 font-mono ml-2">
                  [Modul Admin F-07: Manajemen Produk]
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {adminUser && (
                <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-800 rounded-lg text-xs text-neutral-300 border border-neutral-700/60 mr-1">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-white">{adminUser.username}</span>
                  <span className="text-neutral-500">·</span>
                  <span className="text-neutral-400 text-[11px] truncate max-w-[120px]">{adminUser.role}</span>
                </div>
              )}

              {/* Notifikasi Stok Minimum */}
              <button
                onClick={() => setIsNotificationModalOpen(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  minStockAlertCount > 0
                    ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                }`}
                title="Pusat Notifikasi Stok Minimum & Peringatan Restock"
              >
                <Bell className={`w-3.5 h-3.5 ${minStockAlertCount > 0 ? 'text-amber-400' : 'text-neutral-400'}`} />
                <span className="hidden sm:inline">Notifikasi Stok</span>
                {minStockAlertCount > 0 && (
                  <span className="bg-red-500 text-white font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {minStockAlertCount}
                  </span>
                )}
              </button>

              {/* Riwayat Mutasi Stok */}
              <button
                onClick={() => setIsHistoryModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                title="Riwayat Perubahan & Mutasi Stok Fisik"
              >
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Riwayat Mutasi</span>
              </button>

              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <FolderTree className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Kategori ({categories.length})</span>
              </button>

              <button
                onClick={() => setIsCsvModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
                <span>CSV Excel</span>
              </button>

              <button
                onClick={handleOpenAddProduct}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ Produk Baru</span>
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-800 hover:bg-red-950/80 text-neutral-300 hover:text-red-400 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-neutral-700/60"
                  title="Keluar dari Akun Pengelola"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold mb-1">
              <span>Total SKU Produk</span>
              <Package className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="text-2xl font-extrabold text-neutral-900 font-mono tabular-nums">
              {totalSku}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Tersebar di {categories.length} kategori material
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold mb-1">
              <span>Nilai Inventaris Gudang</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-extrabold text-neutral-900 font-mono tabular-nums truncate">
              {formatRupiah(totalInventoryValue)}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Estimasi total aset fisik saat ini
            </div>
          </div>

          <div 
            onClick={() => setStockFilter(stockFilter === 'critical' ? 'all' : 'critical')}
            className={`p-5 rounded-xl border shadow-xs cursor-pointer transition-colors ${
              criticalStockCount > 0 
                ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-100/70' 
                : 'bg-white border-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between text-amber-800 text-xs font-semibold mb-1">
              <span>Stok Kritis (≤ 10 Unit)</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-amber-950 font-mono tabular-nums">
              {criticalStockCount} SKU
            </div>
            <div className="text-[11px] text-amber-800 mt-1">
              {criticalStockCount > 0 ? 'Klik untuk filter stok menipis' : 'Semua stok dalam batas aman'}
            </div>
          </div>

          <div 
            onClick={() => setStockFilter(stockFilter === 'out' ? 'all' : 'out')}
            className={`p-5 rounded-xl border shadow-xs cursor-pointer transition-colors ${
              outOfStockCount > 0 
                ? 'bg-red-50/70 border-red-300 hover:bg-red-100/70' 
                : 'bg-white border-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between text-red-800 text-xs font-semibold mb-1">
              <span>Stok Habis (Kosong)</span>
              <Boxes className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-2xl font-extrabold text-red-950 font-mono tabular-nums">
              {outOfStockCount} SKU
            </div>
            <div className="text-[11px] text-red-800 mt-1">
              {outOfStockCount > 0 ? 'Klik untuk filter barang kosong' : 'Tidak ada barang kosong'}
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs mb-6 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Cari ID, nama produk, merek, atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Category */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-800 focus:outline-none focus:border-amber-500"
              >
                <option value="all">Semua Kategori ({products.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Stock Status */}
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
                className="px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-800 focus:outline-none focus:border-amber-500"
              >
                <option value="all">Semua Status Stok</option>
                <option value="critical">Stok Kritis (≤ 10 Unit)</option>
                <option value="out">Stok Habis (0 Unit)</option>
              </select>

              {/* Sorting */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-800 focus:outline-none focus:border-amber-500"
              >
                <option value="name">Urut: Nama (A-Z)</option>
                <option value="stock-asc">Stok: Paling Sedikit</option>
                <option value="stock-desc">Stok: Paling Banyak</option>
                <option value="price-desc">Harga: Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Active Filter Pills (Interactive Clear Buttons) */}
          {(selectedCategory !== 'all' || stockFilter !== 'all' || searchQuery) && (
            <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 text-xs text-neutral-600">
              <span>Filter Aktif:</span>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-2 py-0.5 bg-neutral-100 rounded hover:bg-neutral-200 text-neutral-800"
                >
                  Kategori: {categories.find(c => c.id === selectedCategory)?.name || selectedCategory} ✕
                </button>
              )}
              {stockFilter !== 'all' && (
                <button
                  onClick={() => setStockFilter('all')}
                  className="px-2 py-0.5 bg-neutral-100 rounded hover:bg-neutral-200 text-neutral-800"
                >
                  Status: {stockFilter === 'critical' ? 'Stok Kritis' : 'Stok Habis'} ✕
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2 py-0.5 bg-neutral-100 rounded hover:bg-neutral-200 text-neutral-800"
                >
                  Kata Kunci: "{searchQuery}" ✕
                </button>
              )}
              <button
                onClick={() => { setSelectedCategory('all'); setStockFilter('all'); setSearchQuery(''); }}
                className="text-amber-700 hover:underline font-semibold ml-auto"
              >
                Reset Semua
              </button>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Daftar Inventaris Material
              </h3>
              <p className="text-xs text-neutral-500">
                Menampilkan {filteredProducts.length} dari {products.length} SKU total
              </p>
            </div>
            <div className="text-xs text-neutral-500 font-mono">
              Auto-saved to LocalStorage
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-neutral-500">
              <Package className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-neutral-700">Tidak ada produk yang sesuai dengan filter.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setStockFilter('all'); setSearchQuery(''); }}
                className="mt-3 px-3 py-1.5 bg-neutral-900 text-white rounded text-xs font-semibold hover:bg-neutral-800"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 text-[11px] font-bold text-neutral-700 uppercase tracking-wider border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4">Produk & ID</th>
                    <th className="py-3 px-4">Kategori & Merek</th>
                    <th className="py-3 px-4 text-right">Harga Jual</th>
                    <th className="py-3 px-4 text-center">Stok Fisik</th>
                    <th className="py-3 px-4 text-center">Standar</th>
                    <th className="py-3 px-4 text-right">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredProducts.map((p) => {
                    const currentStock = p.stock ?? (p.inStock ? 50 : 0);
                    const isCritical = currentStock > 0 && currentStock <= 10;
                    const isOut = currentStock === 0;

                    return (
                      <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                        {/* Column 1: Image & Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-11 h-11 rounded-lg object-cover bg-neutral-100 shrink-0 border border-neutral-200"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-neutral-900 truncate max-w-xs sm:max-w-sm">
                                {p.name}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                                <span className="font-mono">{p.id}</span>
                                <span>·</span>
                                <span>~{formatWeight(p.weightKg)}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Column 2: Category & Brand */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-neutral-800">{p.brand}</div>
                          <div className="text-[11px] text-neutral-500">{p.categoryName}</div>
                        </td>

                        {/* Column 3: Price */}
                        <td className="py-3 px-4 text-right">
                          <div className="font-extrabold text-neutral-900 font-mono tabular-nums">
                            {formatRupiah(p.price)}
                          </div>
                          <div className="text-[11px] text-neutral-500">per {p.unit}</div>
                        </td>

                        {/* Column 4: Stock */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className={`font-mono font-extrabold text-sm tabular-nums ${
                              isOut ? 'text-red-600' : isCritical ? 'text-amber-600' : 'text-neutral-900'
                            }`}>
                              {currentStock} <span className="text-[11px] font-normal text-neutral-500">{p.unit}</span>
                            </span>

                            {isOut ? (
                              <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded mt-0.5">
                                Habis
                              </span>
                            ) : isCritical ? (
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded mt-0.5">
                                Kritis (Menipis)
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium text-emerald-700">
                                Aman
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Column 5: SNI & Best */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            {p.isSni && (
                              <span className="bg-neutral-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                SNI
                              </span>
                            )}
                            {p.bestseller && (
                              <span className="text-[10px] text-amber-700 font-semibold">
                                ★ Terlaris
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Column 6: Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setQuickStockProduct(p)}
                              className="p-1.5 text-neutral-700 hover:text-amber-700 bg-neutral-100 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              title="Penyesuaian Stok Cepat"
                            >
                              <Boxes className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
                              title="Edit Detail Produk"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setProductToDelete(p)}
                              className="p-1.5 text-neutral-400 hover:text-red-600 bg-neutral-100 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Produk"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
      </main>

      {/* MODAL 1: Create / Edit Product */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }}
        onSave={onSaveProduct}
        productToEdit={editingProduct}
        categories={categories}
      />

      {/* MODAL 2: Quick Stock Adjustment */}
      <QuickStockModal
        product={quickStockProduct}
        onClose={() => setQuickStockProduct(null)}
        onUpdateStock={onUpdateStock}
      />

      {/* MODAL 3: Category Management CRUD */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        products={products}
        onAddCategory={onAddCategory}
        onEditCategory={onEditCategory}
        onDeleteCategory={onDeleteCategory}
      />

      {/* MODAL 4: CSV Import / Export */}
      <CsvModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        products={products}
        onImportProducts={onImportProducts}
      />

      {/* MODAL 5: Delete Confirmation */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 border border-neutral-200 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-bold text-neutral-900">Hapus Produk Ini?</h4>
              <p className="text-xs text-neutral-600 mt-1">
                Apakah Anda yakin ingin menghapus <strong>"{productToDelete.name}"</strong> dari inventaris? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-semibold rounded-lg hover:bg-neutral-50"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700"
              >
                Ya, Hapus Produk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Minimum Stock Notifications */}
      <StockNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        products={products}
        onQuickRestock={(prod) => {
          setIsNotificationModalOpen(false);
          setQuickStockProduct(prod);
        }}
      />

      {/* MODAL 7: Stock Mutation Audit Trail Log */}
      <StockHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        logs={stockLogs}
        onClearLogs={onClearStockLogs}
      />
    </div>
  );
};
