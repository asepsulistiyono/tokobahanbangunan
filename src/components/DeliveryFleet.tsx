import React from 'react';
import { Truck, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DELIVERY_FLEETS } from '../data/products';
import { formatRupiah } from '../utils/formatters';

interface DeliveryFleetProps {
  onSelectFleet?: (fleetId: string) => void;
}

export const DeliveryFleet: React.FC<DeliveryFleetProps> = () => {
  return (
    <section id="armada" className="py-16 bg-neutral-900 text-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            <Truck className="w-4 h-4" />
            <span>Logistik & Jangkauan Kirim</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Armada Angkut Siaga Langsung ke Lokasi Proyek
          </h2>
          <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
            Tidak perlu repot sewa kendaraan pick-up atau memikirkan kuli panggul. Armada TB Mega Bangunan siap mengantar tepat waktu ke perumahan, gang kota, maupun lokasi proyek konstruksi besar.
          </p>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {DELIVERY_FLEETS.map((fleet) => (
            <div
              key={fleet.id}
              className="bg-neutral-800/80 rounded-xl border border-neutral-700/80 p-5 flex flex-col justify-between hover:border-amber-500/50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-neutral-900 rounded-lg text-amber-400">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {fleet.leadTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1.5">
                  {fleet.name}
                </h3>

                <div className="text-xs font-semibold text-amber-400 mb-3">
                  Kapasitas: {fleet.capacity}
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                  {fleet.suitableFor}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-700/70 text-xs">
                {fleet.freeThreshold > 0 ? (
                  <div className="text-neutral-400">
                    Ongkir normal: <span className="text-neutral-200">{formatRupiah(fleet.basePrice)}</span>
                    <div className="text-emerald-400 font-semibold mt-0.5">
                      Gratis ongkir min. order {formatRupiah(fleet.freeThreshold)}
                    </div>
                  </div>
                ) : (
                  <div className="text-emerald-400 font-semibold">
                    Termasuk pengantaran & tumpah di lokasi
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Service Policies Strip */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">Tenaga Bongkar Muat</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Kuli angkut kami siap menurunkan semen, bata, dan besi dengan rapi di titik aman proyek Anda.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">Ketepatan Jadwal Cor</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Jadwal pengiriman pasir dan semen dapat diatur jam ketibaannya agar tukang tidak menunggu adukan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">Jangkauan Area Luas</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Melayani wilayah kota dan kabupaten sekitarnya dengan perhitungan rute tercepat dan tarif transparan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
