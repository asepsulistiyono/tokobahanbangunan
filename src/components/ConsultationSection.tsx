import React, { useState } from 'react';
import { FileText, Send, CheckCircle2, PhoneCall, Building2 } from 'lucide-react';

export const ConsultationSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [projectType, setProjectType] = useState('Rumah Tinggal 2 Lantai');
  const [materialNeeds, setMaterialNeeds] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    // Build WA consultation message
    const storePhone = '6281234567890';
    let text = `*PENGAJUAN PENAWARAN RAB / GROSIR MATERIAL*\n`;
    text += `Nama / Perusahaan: ${name}\n`;
    text += `No. WhatsApp: ${phone}\n`;
    text += `Lokasi Proyek: ${projectLocation || '-'}\n`;
    text += `Jenis Bangunan: ${projectType}\n`;
    text += `Daftar Kebutuhan Material:\n${materialNeeds || 'Mohon dibantu estimasi paket material'}\n\n`;
    text += `Mohon dibuatkan penawaran harga grosir terbaik. Terima kasih.`;

    window.open(`https://wa.me/${storePhone}?text=${encodeURIComponent(text)}`, '_blank');
    setSubmitted(true);
  };

  return (
    <section id="konsultasi" className="py-16 bg-neutral-50 border-b border-neutral-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Layanan Kontraktor & Pemilik Rumah</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-4">
              Pengajuan Penawaran Harga Proyek & Konsultasi RAB
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed mb-6">
              Punya daftar Rencana Anggaran Biaya (RAB) atau volume material dalam jumlah besar? Dapatkan harga distributor khusus proyek, fasilitas nota berkala, dan fleksibilitas jadwal kirim bertahap.
            </p>

            <div className="space-y-3.5 mb-8 text-xs text-neutral-700">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Diskon khusus untuk pembelian volume proyek (Besi beton & Semen)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Penerbitan Surat Jalan, Faktur Pajak PPN resmi jika dibutuhkan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pengiriman bertahap sesuai progres pengecoran & dinding</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-neutral-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-neutral-500">Layanan Konsultasi Langsung:</div>
                <div className="text-sm font-bold text-neutral-900 mt-0.5">Hotline Tim Logistik Toko</div>
                <div className="text-xs font-mono text-amber-800 font-semibold">0812-3456-7890 (08.00 - 17.00 WIB)</div>
              </div>
              <a
                href="https://wa.me/6281234567890?text=Halo%20TB%20Mega%20Bangunan,%20saya%20ingin%20konsultasi%20bahan%20bangunan%20proyek."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Chat WA Toko</span>
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 mb-1">
              Formulir Penawaran RAB Proyek
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Isi kebutuhan material Anda, tim kami akan merespons dengan rincian harga grosir.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-xl text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-emerald-900 mb-1">Permintaan Penawaran Terkirim!</h4>
                <p className="text-xs text-emerald-700 mb-4">
                  Terima kasih! Pesan telah diteruskan ke tim sales TB Mega Bangunan via WhatsApp. Kami akan segera menghubungi Anda.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-medium hover:bg-neutral-800"
                >
                  Kirim Permintaan Baru
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Nama Lengkap / Kontraktor *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Bpk. Hendra / CV Mandiri Jaya"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0812xxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Jenis Proyek Bangunan
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                    >
                      <option value="Rumah Tinggal 1 Lantai">Rumah Tinggal 1 Lantai</option>
                      <option value="Rumah Tinggal 2+ Lantai">Rumah Tinggal 2+ Lantai</option>
                      <option value="Ruko / Komersial">Ruko / Bangunan Komersial</option>
                      <option value="Renovasi Dapur / Atap">Renovasi Dapur / Atap / Kamar Mandi</option>
                      <option value="Perumahan Cluster (Developer)">Perumahan Cluster (Developer)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Lokasi / Alamat Proyek
                    </label>
                    <input
                      type="text"
                      placeholder="Kecamatan / Kota proyek"
                      value={projectLocation}
                      onChange={(e) => setProjectLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Daftar Kebutuhan Material & Volume
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Semen Gresik 100 sak, Besi 10 SNI 50 btg, Hebel 10cm 8 m3, Pasir Cor 2 truk..."
                    value={materialNeeds}
                    onChange={(e) => setMaterialNeeds(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kirim Pengajuan via WhatsApp Toko</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
