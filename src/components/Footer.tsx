import React from 'react';
import { Phone, MapPin, Clock, ShieldCheck, Mail } from 'lucide-react';

interface FooterProps {
  onScrollTo: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollTo }) => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="text-base font-extrabold text-white tracking-tight">
              TB Mega Bangunan
            </div>
            <p className="leading-relaxed text-neutral-400">
              Pusat penjualan bahan bangunan dan pasokan material konstruksi berstandar SNI melayani kebutuhan kontraktor, tukang, serta renovasi rumah tinggal dengan armada pengiriman cepat.
            </p>
            <div className="text-neutral-500 text-[11px]">
              Nomor Izin Usaha Perdagangan: 9120004561882
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-2.5">
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-1">
              Navigasi Halaman
            </div>
            <div>
              <button
                onClick={() => onScrollTo('katalog')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Katalog Bahan Bangunan
              </button>
            </div>
            <div>
              <button
                onClick={() => onScrollTo('kalkulator')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Kalkulator Kebutuhan Material
              </button>
            </div>
            <div>
              <button
                onClick={() => onScrollTo('armada')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Armada & Biaya Pengiriman
              </button>
            </div>
            <div>
              <button
                onClick={() => onScrollTo('konsultasi')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Pengajuan Penawaran RAB Proyek
              </button>
            </div>
          </div>

          {/* Store Hours & Warehouse */}
          <div className="space-y-2.5">
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-1">
              Jam Operasional Toko
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-white font-medium">Senin - Sabtu:</div>
                <div>07.30 - 17.00 WIB</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-white font-medium">Minggu / Hari Libur:</div>
                <div>08.00 - 14.00 WIB (Pengiriman terjadwal)</div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5">
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-1">
              Lokasi & Kontak
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Komp. Pergudangan Bahan Bangunan Raya Kav. 8-12</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <span>(021) 8899-7711 / WA: 0812-3456-7890</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              <span>sales@megabangunan.id</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} TB Mega Bangunan Sentosa. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4">
            <span>Standar Mutu SNI</span>
            <span>·</span>
            <span>Pengiriman Truk & Pick-Up</span>
            <span>·</span>
            <span>Faktur & Nota Pajak</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
