import React, { useState, useMemo } from 'react';
import { Search, Plus, Check, Info, ShieldCheck, Filter, Settings2, PackageX } from 'lucide-react';
import { Product, ProductCategory, CategoryItem } from '../types';
import { formatRupiah } from '../utils/formatters';

interface ProductCatalogProps {
  products: Product[];
  categories: CategoryItem[];
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenProductDetail: (product: Product) => void;
  onOpenAdmin?: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  categories,
  onAddToCart,
  onOpenProductDetail,
  onOpenAdmin
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlySni, setOnlySni] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [addedItemMap, setAddedItemMap] = useState<{ [productId: string]: boolean }>({});
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category match
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // SNI filter
      if (onlySni && !item.isSni) {
        return false;
      }
      // Search match
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchBrand = item.brand.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchCat = item.categoryName.toLowerCase().includes(query);
        if (!matchName && !matchBrand && !matchDesc && !matchCat) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // Default: bestsellers first
      if (a.bestseller && !b.bestseller) return -1;
      if (!a.bestseller && b.bestseller) return 1;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, onlySni, sortBy]);

  const handleQuantityChange = (productId: string, val: number, minOrder: number, maxStock: number) => {
    const safeVal = Math.min(Math.max(minOrder, val), maxStock > 0 ? maxStock : 1);
    setQuantities(prev => ({ ...prev, [productId]: safeVal }));
  };

  const handleAdd = (product: Product) => {
    const currentStock = product.stock ?? (product.inStock ? 50 : 0);
    if (currentStock <= 0) return;

    const qty = quantities[product.id] || product.minOrder;
    onAddToCart(product, qty);
    setAddedItemMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section id="katalog" className="py-16 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              <span>Etalase Grosir & Eceran</span>
              <span aria-hidden="true">·</span>
              <span>Harga Transparan</span>
              {onOpenAdmin && (
                <>
                  <span aria-hidden="true">·</span>
                  <button
                    onClick={onOpenAdmin}
                    className="text-amber-700 hover:text-amber-900 font-bold hover:underline cursor-pointer inline-flex items-center gap-1 normal-case"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Modul Admin F-07</span>
                  </button>
                </>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Katalog Lengkap Bahan Bangunan
            </h2>
            <p className="text-sm text-neutral-600 mt-1 max-w-xl">
              Seluruh spesifikasi material konstruksi dari pondasi hingga atap. Klik produk untuk rincian teknis daya sebar dan ketebalan.
            </p>
          </div>

          {/* Quick Search & Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Cari semen, hebel, pasir, cat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-800 focus:outline-none focus:border-amber-500"
            >
              <option value="default">Paling Laris / Rekomendasi</option>
              <option value="price-asc">Harga: Termurah</option>
              <option value="price-desc">Harga: Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Dynamic Category Segmented Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-neutral-200">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Semua Produk ({products.length})
          </button>

          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = products.filter(p => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}

          {/* SNI Filter Toggle Button */}
          <button
            onClick={() => setOnlySni(!onlySni)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap shrink-0 border transition-colors cursor-pointer ml-auto ${
              onlySni
                ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold'
                : 'bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${onlySni ? 'text-amber-600' : 'text-neutral-400'}`} />
            <span>Khusus SNI Resmi</span>
          </button>
        </div>

        {/* Product Count & Active Filters */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-6">
          <div>
            Menampilkan <span className="font-semibold text-neutral-900 tabular-nums">{filteredProducts.length}</span> produk
            {selectedCategory !== 'all' && (
              <span> dalam kategori <strong className="text-neutral-800">{categories.find(c => c.id === selectedCategory)?.name || selectedCategory}</strong></span>
            )}
          </div>
          {(selectedCategory !== 'all' || searchQuery || onlySni) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setOnlySni(false);
              }}
              className="text-amber-700 hover:underline font-medium cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-neutral-300 rounded-xl bg-neutral-50">
            <Filter className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-neutral-800">Tidak ada material yang sesuai</h3>
            <p className="text-xs text-neutral-500 mt-1">Coba sesuaikan kata kunci pencarian atau ganti kategori.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setOnlySni(false); }}
              className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded text-xs font-medium hover:bg-neutral-800"
            >
              Tampilkan Semua Produk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const currentStock = product.stock ?? (product.inStock ? 50 : 0);
              const isOutOfStock = currentStock === 0;
              const isCritical = currentStock > 0 && currentStock <= 10;
              const currentQty = quantities[product.id] || product.minOrder;
              const isAdded = addedItemMap[product.id];

              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all duration-200"
                >
                  {/* Image Slot (4:3 aspect ratio with clean overlay) */}
                  <div 
                    className="relative aspect-[4/3] bg-neutral-100 overflow-hidden cursor-pointer" 
                    onClick={() => onOpenProductDetail(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Quiet text labels */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      {product.isSni && (
                        <span className="bg-neutral-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                          SNI
                        </span>
                      )}
                      {product.bestseller && (
                        <span className="bg-amber-500 text-neutral-950 text-[11px] font-bold px-2 py-0.5 rounded">
                          Terlaris
                        </span>
                      )}
                      {isOutOfStock && (
                        <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                          Stok Habis
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProductDetail(product);
                      }}
                      className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-white rounded text-neutral-700 hover:text-neutral-950 transition-colors shadow-xs"
                      title="Lihat Spesifikasi Teknis"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      {/* Brand & Category quiet metadata */}
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1.5">
                        <span className="font-medium text-neutral-700">{product.brand}</span>
                        <span aria-hidden="true">·</span>
                        <span>{product.categoryName}</span>
                      </div>

                      {/* Product Name */}
                      <h3
                        onClick={() => onOpenProductDetail(product)}
                        className="text-base font-bold text-neutral-900 leading-snug hover:text-amber-600 transition-colors cursor-pointer mb-2 line-clamp-2"
                      >
                        {product.name}
                      </h3>

                      {/* Description excerpt */}
                      <p className="text-xs text-neutral-500 line-clamp-2 mb-4">
                        {product.description}
                      </p>
                    </div>

                    {/* Pricing & Order Section */}
                    <div className="pt-3 border-t border-neutral-100">
                      <div className="flex items-baseline justify-between mb-2">
                        <div>
                          <div className="text-lg font-extrabold text-neutral-950 tabular-nums">
                            {formatRupiah(product.price)}
                          </div>
                          <div className="text-[11px] text-neutral-500">
                            per {product.unit} · Min. {product.minOrder} {product.unit}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono tabular-nums text-neutral-600 block">
                            ~{product.weightKg} kg
                          </span>
                          {isOutOfStock ? (
                            <span className="text-[11px] text-red-600 font-bold">
                              Habis
                            </span>
                          ) : isCritical ? (
                            <span className="text-[11px] text-amber-700 font-bold">
                              Sisa {currentStock} {product.unit}
                            </span>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-semibold">
                              Stok: {currentStock} {product.unit}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper & Add Button */}
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center border border-neutral-300 rounded-lg overflow-hidden ${
                          isOutOfStock ? 'opacity-50 bg-neutral-100' : 'bg-neutral-50'
                        }`}>
                          <button
                            type="button"
                            disabled={isOutOfStock}
                            onClick={() => handleQuantityChange(product.id, currentQty - 1, product.minOrder, currentStock)}
                            className="w-8 h-9 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            disabled={isOutOfStock}
                            value={currentQty}
                            onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || product.minOrder, product.minOrder, currentStock)}
                            className="w-12 h-9 text-center text-xs font-mono font-bold bg-transparent focus:outline-none disabled:cursor-not-allowed"
                          />
                          <button
                            type="button"
                            disabled={isOutOfStock}
                            onClick={() => handleQuantityChange(product.id, currentQty + 1, product.minOrder, currentStock)}
                            className="w-8 h-9 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => handleAdd(product)}
                          className={`flex-1 flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg text-xs font-bold transition-all ${
                            isOutOfStock
                              ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                              : isAdded
                              ? 'bg-emerald-600 text-white cursor-pointer'
                              : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs cursor-pointer'
                          }`}
                        >
                          {isOutOfStock ? (
                            <>
                              <PackageX className="w-3.5 h-3.5" />
                              <span>Stok Habis</span>
                            </>
                          ) : isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span>Ditambahkan</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 text-amber-400" />
                              <span>+ Keranjang</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
