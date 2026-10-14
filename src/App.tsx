import React, { useState, useEffect } from 'react';
import { Product, CartItem, CustomerOrder, CategoryItem, StockLog, StockChangeType } from './types';
import { PRODUCTS, DEFAULT_CATEGORIES } from './data/products';
import { INITIAL_STOCK_LOGS } from './data/stockLogs';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { Calculator } from './components/Calculator';
import { DeliveryFleet } from './components/DeliveryFleet';
import { ConsultationSection } from './components/ConsultationSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductModal } from './components/ProductModal';
import { OrderInvoiceModal } from './components/OrderInvoiceModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { Settings, Lock } from 'lucide-react';

interface AdminSessionUser {
  username: string;
  role: string;
  email: string;
}

export default function App() {
  // 1. Categories State with localStorage persistence
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('tb_mega_categories');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load categories', e);
    }
    return DEFAULT_CATEGORIES;
  });

  // 2. Products State with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('tb_mega_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load products', e);
    }
    return PRODUCTS;
  });

  // 3. Stock Logs Audit Trail State with localStorage persistence
  const [stockLogs, setStockLogs] = useState<StockLog[]>(() => {
    try {
      const saved = localStorage.getItem('tb_mega_stock_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load stock logs', e);
    }
    return INITIAL_STOCK_LOGS;
  });

  // 4. Admin Authentication & View State
  const [adminUser, setAdminUser] = useState<AdminSessionUser | null>(() => {
    try {
      const local = localStorage.getItem('tb_mega_admin_session');
      if (local) return JSON.parse(local);
      const session = sessionStorage.getItem('tb_mega_admin_session');
      if (session) return JSON.parse(session);
    } catch (e) {
      console.error('Failed to load admin session', e);
    }
    return null;
  });

  const [viewMode, setViewMode] = useState<'store' | 'admin-login' | 'admin-dashboard'>('store');

  // 4. Cart State with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tb_mega_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load cart', e);
    }
    const defaultSemen = products.find(p => p.id === 'smn-01') || products[0];
    const defaultBesi = products.find(p => p.id === 'bsi-02') || products[1];
    const initial: CartItem[] = [];
    if (defaultSemen) initial.push({ product: defaultSemen, quantity: 10 });
    if (defaultBesi) initial.push({ product: defaultBesi, quantity: 8 });
    return initial;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const [invoiceState, setInvoiceState] = useState<{
    isOpen: boolean;
    order: CustomerOrder;
    shippingCost: number;
  }>({
    isOpen: false,
    order: {
      customerName: 'Bpk. Ahmad Fauzi',
      phone: '081234567890',
      address: 'Jl. Merdeka Barat No. 45, Proyek Renovasi Ruko',
      district: 'Jakarta Barat',
      deliveryMethod: 'fleet-pickup',
      paymentMethod: 'cod',
      notes: 'Mohon tiba sebelum jam 11 siang'
    },
    shippingCost: 50000
  });

  // Persist categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tb_mega_categories', JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories', e);
    }
  }, [categories]);

  // Persist products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tb_mega_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  }, [products]);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tb_mega_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  // Persist stock logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tb_mega_stock_logs', JSON.stringify(stockLogs));
    } catch (e) {
      console.error('Failed to save stock logs', e);
    }
  }, [stockLogs]);

  // Sync cart product items if product prices/details change in admin
  useEffect(() => {
    setCart(prev =>
      prev.map(item => {
        const updatedProd = products.find(p => p.id === item.product.id);
        if (updatedProd) {
          return { ...item, product: updatedProd };
        }
        return item;
      })
    );
  }, [products]);

  // Admin routing logic
  const handleRequestAdmin = () => {
    if (adminUser) {
      setViewMode('admin-dashboard');
    } else {
      setViewMode('admin-login');
    }
  };

  const handleLoginSuccess = (userData: AdminSessionUser) => {
    setAdminUser(userData);
    setViewMode('admin-dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('tb_mega_admin_session');
    sessionStorage.removeItem('tb_mega_admin_session');
    setAdminUser(null);
    setViewMode('store');
  };

  // Product CRUD Operations
  const handleSaveProduct = (newOrUpdated: Product) => {
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === newOrUpdated.id);
      if (idx !== -1) {
        const existing = prev[idx];
        const prevStock = existing.stock ?? (existing.inStock ? 50 : 0);
        const currentStock = newOrUpdated.stock ?? (newOrUpdated.inStock ? 50 : 0);

        if (prevStock !== currentStock) {
          const diff = currentStock - prevStock;
          const newLog: StockLog = {
            id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            productId: newOrUpdated.id,
            productName: newOrUpdated.name,
            unit: newOrUpdated.unit,
            previousStock: prevStock,
            newStock: currentStock,
            difference: diff,
            changeType: diff > 0 ? 'restock' : 'adjustment',
            notes: 'Pembaruan stok via Edit Data Produk',
            actor: adminUser?.username ? `${adminUser.username} (${adminUser.role})` : 'Admin Toko',
            timestamp: new Date().toISOString()
          };
          setStockLogs(logs => [newLog, ...logs]);
        }

        const copy = [...prev];
        copy[idx] = newOrUpdated;
        return copy;
      }

      // New product added
      const initialStock = newOrUpdated.stock ?? 0;
      const newLog: StockLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: newOrUpdated.id,
        productName: newOrUpdated.name,
        unit: newOrUpdated.unit,
        previousStock: 0,
        newStock: initialStock,
        difference: initialStock,
        changeType: 'initial',
        notes: 'Pendaftaran katalog SKU produk baru',
        actor: adminUser?.username ? `${adminUser.username} (${adminUser.role})` : 'Admin Toko',
        timestamp: new Date().toISOString()
      };
      setStockLogs(logs => [newLog, ...logs]);

      return [newOrUpdated, ...prev];
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleUpdateStock = (
    productId: string, 
    newStock: number, 
    changeType: StockChangeType = 'adjustment', 
    notes: string = 'Penyesuaian stok fisik'
  ) => {
    const prod = products.find(p => p.id === productId);
    const prevStock = prod ? (prod.stock ?? (prod.inStock ? 50 : 0)) : 0;
    const diff = newStock - prevStock;

    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, stock: newStock, inStock: newStock > 0 }
          : p
      )
    );

    if (prod) {
      const newLog: StockLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: prod.id,
        productName: prod.name,
        unit: prod.unit,
        previousStock: prevStock,
        newStock: newStock,
        difference: diff,
        changeType: changeType,
        notes: notes,
        actor: adminUser?.username ? `${adminUser.username} (${adminUser.role})` : 'Admin Toko',
        timestamp: new Date().toISOString()
      };
      setStockLogs(logs => [newLog, ...logs]);
    }
  };

  const handleClearStockLogs = () => {
    setStockLogs([]);
    try {
      localStorage.removeItem('tb_mega_stock_logs');
    } catch (e) {
      console.error('Failed to clear stock logs', e);
    }
  };

  // Category CRUD Operations
  const handleAddCategory = (cat: CategoryItem) => {
    setCategories(prev => [...prev, cat]);
  };

  const handleEditCategory = (id: string, updatedName: string, updatedDesc?: string) => {
    setCategories(prev =>
      prev.map(c =>
        c.id === id ? { ...c, name: updatedName, description: updatedDesc } : c
      )
    );
    // Also update categoryName on existing products
    setProducts(prev =>
      prev.map(p =>
        p.category === id ? { ...p, categoryName: updatedName } : p
      )
    );
  };

  const handleDeleteCategory = (id: string) => {
    const fallbackCat = categories.find(c => c.id !== id)?.id || 'umum';
    const fallbackName = categories.find(c => c.id !== id)?.name || 'Umum';

    setCategories(prev => prev.filter(c => c.id !== id));
    setProducts(prev =>
      prev.map(p =>
        p.category === id
          ? { ...p, category: fallbackCat, categoryName: fallbackName }
          : p
      )
    );
  };

  // CSV Import Operation
  const handleImportProducts = (imported: Product[], mode: 'append' | 'overwrite') => {
    if (mode === 'overwrite') {
      setProducts(imported);
    } else {
      setProducts(prev => {
        const existingMap = new Map(prev.map(p => [p.id, p]));
        imported.forEach(imp => {
          existingMap.set(imp.id, imp);
        });
        return Array.from(existingMap.values());
      });
    }
  };

  // Cart operations
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalWeight = cart.reduce((acc, item) => acc + item.product.weightKg * item.quantity, 0);

  const handleAddToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleScrollTo = (id: string) => {
    if (viewMode !== 'store') {
      setViewMode('store');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenInvoice = (order: CustomerOrder, shippingCost: number) => {
    setInvoiceState({
      isOpen: true,
      order,
      shippingCost
    });
  };

  // ROUTE 1: ADMIN LOGIN PAGE
  if (viewMode === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToStore={() => setViewMode('store')}
      />
    );
  }

  // ROUTE 2: ADMIN DASHBOARD (Protected by Auth)
  if (viewMode === 'admin-dashboard') {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToStore={() => setViewMode('store')}
        />
      );
    }

    return (
      <AdminDashboard
        products={products}
        categories={categories}
        stockLogs={stockLogs}
        adminUser={adminUser}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateStock={handleUpdateStock}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        onImportProducts={handleImportProducts}
        onClearStockLogs={handleClearStockLogs}
        onExitAdmin={() => setViewMode('store')}
        onLogout={handleLogout}
      />
    );
  }

  // ROUTE 3: PUBLIC STOREFRONT
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      {/* Top Bar Navigation */}
      <Navbar
        cartCount={totalCartCount}
        cartSubtotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onScrollTo={handleScrollTo}
        onOpenAdmin={handleRequestAdmin}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreCatalog={() => handleScrollTo('katalog')}
          onOpenCalculator={() => handleScrollTo('kalkulator')}
        />

        {/* Product Catalog */}
        <ProductCatalog
          products={products}
          categories={categories}
          onAddToCart={handleAddToCart}
          onOpenProductDetail={(prod) => setDetailProduct(prod)}
          onOpenAdmin={handleRequestAdmin}
        />

        {/* Material Requirement Calculator */}
        <Calculator 
          onAddToCart={handleAddToCart} 
          products={products}
        />

        {/* Delivery Fleet Section */}
        <DeliveryFleet />

        {/* B2B / Contractor Quotation & Consultation */}
        <ConsultationSection />
      </main>

      {/* Footer */}
      <Footer onScrollTo={handleScrollTo} />

      {/* Floating Manager Quick Access Button */}
      <aside aria-label="Akses Cepat Pengelola" className="fixed bottom-5 left-5 z-30">
        <button
          onClick={handleRequestAdmin}
          className="flex items-center gap-2 px-3.5 py-2 bg-neutral-900/95 hover:bg-neutral-800 text-white rounded-full text-xs font-bold shadow-lg border border-neutral-700 backdrop-blur-xs transition-all hover:scale-105 cursor-pointer"
          title={adminUser ? `Masuk sebagai ${adminUser.username} (Panel Admin)` : 'Login Pengelola Toko'}
        >
          {adminUser ? (
            <>
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>Panel Admin ({adminUser.username})</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Login Admin (F-07)</span>
            </>
          )}
        </button>
      </aside>

      {/* Sliding Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOpenInvoice={handleOpenInvoice}
      />

      {/* Product Detail Modal */}
      <ProductModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Official Printable Receipt & Quotation Modal */}
      <OrderInvoiceModal
        isOpen={invoiceState.isOpen}
        onClose={() => setInvoiceState(prev => ({ ...prev, isOpen: false }))}
        items={cart}
        order={invoiceState.order}
        subtotal={cartSubtotal}
        shippingCost={invoiceState.shippingCost}
        totalWeight={totalWeight}
      />
    </div>
  );
}
