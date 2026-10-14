import React, { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface NavbarProps {
  cartCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  onScrollTo: (id: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartSubtotal,
  onOpenCart,
  onScrollTo,
  onOpenAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xl font-extrabold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 hover:text-amber-600 transition-colors"
          >
            TB Mega Bangunan
          </a>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
            <button
              onClick={() => onScrollTo('katalog')}
              className="hover:text-neutral-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Katalog Bahan
            </button>
            <button
              onClick={() => onScrollTo('kalkulator')}
              className="hover:text-neutral-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Kalkulator Proyek
            </button>
            <button
              onClick={() => onScrollTo('armada')}
              className="hover:text-neutral-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Armada Kirim
            </button>
            <button
              onClick={() => onScrollTo('konsultasi')}
              className="hover:text-neutral-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Konsultasi RAB
            </button>
            <button
              onClick={onOpenAdmin}
              className="text-amber-700 hover:text-amber-900 font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Admin F-07
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
              aria-label="Buka Keranjang Belanja"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Keranjang</span>
              <span className="bg-neutral-800 text-amber-300 px-2 py-0.5 rounded text-xs tabular-nums font-mono">
                {cartCount}
              </span>
              {cartSubtotal > 0 && (
                <span className="hidden sm:inline-block text-xs text-neutral-300 border-l border-neutral-700 pl-2 tabular-nums">
                  {formatRupiah(cartSubtotal)}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => {
              onScrollTo('katalog');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-neutral-700 hover:text-neutral-950"
          >
            Katalog Bahan Bangunan
          </button>
          <button
            onClick={() => {
              onScrollTo('kalkulator');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-neutral-700 hover:text-neutral-950"
          >
            Kalkulator Kebutuhan Material
          </button>
          <button
            onClick={() => {
              onScrollTo('armada');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-neutral-700 hover:text-neutral-950"
          >
            Armada & Jangkauan Pengiriman
          </button>
          <button
            onClick={() => {
              onScrollTo('konsultasi');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-neutral-700 hover:text-neutral-950"
          >
            Konsultasi & Pengajuan RAB
          </button>
          <button
            onClick={() => {
              onOpenAdmin();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-bold text-amber-700 hover:text-amber-900 border-t border-neutral-100 pt-2"
          >
            Modul Admin (F-07: Manajemen Produk)
          </button>
        </div>
      )}
    </header>
  );
};
