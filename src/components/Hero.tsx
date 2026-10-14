import React from 'react';
import { ArrowRight, Calculator, ShieldCheck, Truck, FileCheck, Award } from 'lucide-react';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenCalculator: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCatalog,
  onOpenCalculator
}) => {
  return (
    <section className="relative bg-neutral-900 text-white overflow-hidden">
      {/* Background with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_building_warehouse_1791866448232.jpg"
          alt="Gudang Bahan Bangunan TB Mega Bangunan Sentosa"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase mb-4">
            <span>Pusat Pasokan Material Bangunan SNI</span>
            <span aria-hidden="true">·</span>
            <span>Grosir & Eceran</span>
            <span aria-hidden="true">·</span>
            <span>Siap Kirim Proyek</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6 text-balance">
            Pasokan Bahan Bangunan Terlengkap, Kokoh, dan Bergaransi Resmi
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 mb-8 leading-relaxed">
            Menyediakan semen berstandar SNI, besi beton sertifikasi, bata ringan presisi, keramik, cat tembok, dan baja ringan. Didukung armada angkut pikap hingga dump truck untuk kepastian waktu proyek Anda.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreCatalog}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition-colors cursor-pointer shadow-lg"
            >
              <span>Belanja Bahan Bangunan</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCalculator}
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-neutral-800/90 hover:bg-neutral-700/90 text-white font-medium rounded-lg border border-neutral-700 transition-colors cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Hitung Kebutuhan Material</span>
            </button>
          </div>
        </div>

        {/* 4-Item Proof Metrics Row adjacent to claim */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-neutral-800">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-neutral-800 rounded-lg text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white tabular-nums">100% SNI Asli</div>
              <div className="text-xs text-neutral-400 mt-0.5">Semen & besi bersertifikasi pabrik</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-neutral-800 rounded-lg text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white tabular-nums">Armada Siaga</div>
              <div className="text-xs text-neutral-400 mt-0.5">Pick-up, engkel, & dump truck siap jalan</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-neutral-800 rounded-lg text-amber-400 shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white tabular-nums">Nota & Faktur</div>
              <div className="text-xs text-neutral-400 mt-0.5">Tanda terima resmi & transparansi harga</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-neutral-800 rounded-lg text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white tabular-nums">14+ Tahun</div>
              <div className="text-xs text-neutral-400 mt-0.5">Melayani tukang, kontraktor & renovasi</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
