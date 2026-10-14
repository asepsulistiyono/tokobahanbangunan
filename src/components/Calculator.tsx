import React, { useState } from 'react';
import { Calculator as CalcIcon, Plus, Check, RefreshCw } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

interface CalculatorProps {
  onAddToCart: (product: Product, quantity: number) => void;
  products?: Product[];
}

type TabType = 'hebel' | 'keramik' | 'cat' | 'cor';

export const Calculator: React.FC<CalculatorProps> = ({ onAddToCart, products = PRODUCTS }) => {
  const [activeTab, setActiveTab] = useState<TabType>('hebel');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Hebel State
  const [hebelLength, setHebelLength] = useState<number>(6);
  const [hebelHeight, setHebelHeight] = useState<number>(3);
  const [hebelThickness, setHebelThickness] = useState<number>(10); // 7.5 or 10 cm
  const [hebelOpenings, setHebelOpenings] = useState<number>(2); // Doors/windows area m2

  // Keramik State
  const [tileLength, setTileLength] = useState<number>(5);
  const [tileWidth, setTileWidth] = useState<number>(4);
  const [tileSize, setTileSize] = useState<'60x60' | '40x40'>('60x60');
  const [tileWaste, setTileWaste] = useState<number>(10); // 10%

  // Cat State
  const [paintArea, setPaintArea] = useState<number>(45);
  const [paintLayers, setPaintLayers] = useState<number>(2);

  // Cor State
  const [slabLength, setSlabLength] = useState<number>(6);
  const [slabWidth, setSlabWidth] = useState<number>(4);
  const [slabThicknessCm, setSlabThicknessCm] = useState<number>(12); // 12cm slab

  const showNotification = (msg: string) => {
    setAddedNotice(msg);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  // 1. Hebel Calculation
  const wallAreaGross = Math.max(0, hebelLength * hebelHeight);
  const wallAreaNet = Math.max(0.5, wallAreaGross - hebelOpenings);
  // Hebel 10cm: 1 m3 is ~83 pcs, covers ~10 m2. Hebel 7.5cm: 1 m3 covers ~13.3 m2.
  const hebelCubic = hebelThickness === 10 
    ? Math.max(1, Math.ceil((wallAreaNet / 10) * 10) / 10)
    : Math.max(1, Math.ceil((wallAreaNet / 13.3) * 10) / 10);
  const mortarSacks = Math.max(1, Math.ceil(wallAreaNet / 10)); // 1 sack MU-380 per 10m2

  const handleAddHebelToCart = () => {
    const hebelProduct = products.find(p => p.id === (hebelThickness === 10 ? 'bta-01' : 'bta-02')) || PRODUCTS.find(p => p.id === 'bta-01');
    const mortarProduct = products.find(p => p.id === 'smn-03') || PRODUCTS.find(p => p.id === 'smn-03');
    if (hebelProduct) onAddToCart(hebelProduct, Math.ceil(hebelCubic));
    if (mortarProduct) onAddToCart(mortarProduct, mortarSacks);
    showNotification(`Ditambahkan: ${Math.ceil(hebelCubic)} m³ Hebel & ${mortarSacks} Sak MU Mortar`);
  };

  // 2. Keramik Calculation
  const floorRawArea = Math.max(1, tileLength * tileWidth);
  const floorAreaWithWaste = floorRawArea * (1 + tileWaste / 100);
  // 60x60: 4 pcs = 1.44 m2/box. 40x40: 6 pcs = 0.96 m2/box.
  const coveragePerBox = tileSize === '60x60' ? 1.44 : 0.96;
  const tileBoxes = Math.ceil(floorAreaWithWaste / coveragePerBox);

  const handleAddTilesToCart = () => {
    const tileProduct = products.find(p => p.id === (tileSize === '60x60' ? 'krm-01' : 'krm-02')) || PRODUCTS.find(p => p.id === 'krm-01');
    if (tileProduct) {
      onAddToCart(tileProduct, tileBoxes);
      showNotification(`Ditambahkan: ${tileBoxes} Dus Keramik ${tileSize}`);
    }
  };

  // 3. Cat Calculation
  const totalPaintSurface = paintArea * paintLayers;
  // Dulux Catylac: ~10 m2 per kg per layer -> 25kg pail covers ~250 m2 single layer
  const paintPails25kg = Math.max(1, Math.ceil(totalPaintSurface / 250));

  const handleAddPaintToCart = () => {
    const paintProduct = products.find(p => p.id === 'cat-02') || PRODUCTS.find(p => p.id === 'cat-02');
    if (paintProduct) {
      onAddToCart(paintProduct, paintPails25kg);
      showNotification(`Ditambahkan: ${paintPails25kg} Pail Dulux Catylac 25kg`);
    }
  };

  // 4. Cor Beton Calculation
  const concreteVolume = Math.max(0.5, (slabLength * slabWidth * (slabThicknessCm / 100)));
  // Standar beton K-225 per m3: Semen ~7.5 sak 50kg, Pasir ~0.55 m3, Split ~0.82 m3
  const cementCorSacks = Math.ceil(concreteVolume * 7.5);

  const handleAddCorToCart = () => {
    const cementProduct = products.find(p => p.id === 'smn-01') || PRODUCTS.find(p => p.id === 'smn-01');
    const sandProduct = products.find(p => p.id === 'bta-03') || PRODUCTS.find(p => p.id === 'bta-03');
    const stoneProduct = products.find(p => p.id === 'bta-04') || PRODUCTS.find(p => p.id === 'bta-04');
    if (cementProduct) onAddToCart(cementProduct, cementCorSacks);
    if (sandProduct) onAddToCart(sandProduct, 1);
    if (stoneProduct) onAddToCart(stoneProduct, 1);
    showNotification(`Ditambahkan: ${cementCorSacks} Sak Semen, 1 Truk Pasir & 1 Truk Split`);
  };

  return (
    <section id="kalkulator" className="py-16 bg-neutral-100 border-b border-neutral-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
            <CalcIcon className="w-4 h-4 text-amber-600" />
            <span>Alat Hitung Praktis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Kalkulator Kebutuhan Material Bangunan
          </h2>
          <p className="text-sm text-neutral-600 mt-2">
            Hitung perkiraan kebutuhan bata ringan, keramik, semen, dan cat secara akurat untuk meminimalkan material terbuang saat konstruksi.
          </p>
        </div>

        {/* Tab Controls (Functional Buttons) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('hebel')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'hebel'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-white text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Dinding Bata Ringan (Hebel)
          </button>
          <button
            onClick={() => setActiveTab('keramik')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'keramik'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-white text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Lantai Keramik & Granit
          </button>
          <button
            onClick={() => setActiveTab('cat')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'cat'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-white text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Pengecatan Dinding
          </button>
          <button
            onClick={() => setActiveTab('cor')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'cor'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-white text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Cor Beton Dak / Lantai
          </button>
        </div>

        {/* Notification feedback */}
        {addedNotice && (
          <div className="max-w-xl mx-auto mb-6 p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs sm:text-sm flex items-center justify-between animate-fadeIn">
            <span className="font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              {addedNotice}
            </span>
            <span className="text-xs text-emerald-700">Tersimpan di Keranjang</span>
          </div>
        )}

        <div className="max-w-4xl mx-auto bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
          {/* TAB 1: HEBEL */}
          {activeTab === 'hebel' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-900">Parameter Pasangan Dinding</h3>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Panjang Dinding: <span className="font-mono text-amber-700 font-bold">{hebelLength} Meter</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.5"
                    value={hebelLength}
                    onChange={(e) => setHebelLength(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Tinggi Dinding: <span className="font-mono text-amber-700 font-bold">{hebelHeight} Meter</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="0.25"
                    value={hebelHeight}
                    onChange={(e) => setHebelHeight(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Kurangi Bukaan Kusen/Pintu/Jendela: <span className="font-mono text-neutral-800 font-bold">{hebelOpenings} m²</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={hebelOpenings}
                    onChange={(e) => setHebelOpenings(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Pilihan Ketebalan Bata Ringan:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setHebelThickness(10)}
                      className={`px-3 py-2 text-xs font-medium rounded border cursor-pointer ${
                        hebelThickness === 10
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                          : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      Tebal 10 cm (Standar Luar)
                    </button>
                    <button
                      type="button"
                      onClick={() => setHebelThickness(7.5)}
                      className={`px-3 py-2 text-xs font-medium rounded border cursor-pointer ${
                        hebelThickness === 7.5
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                          : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      Tebal 7.5 cm (Partisi Kamar)
                    </button>
                  </div>
                </div>
              </div>

              {/* Hebel Results Column */}
              <div className="bg-neutral-50 rounded-lg p-5 border border-neutral-200 space-y-4">
                <div className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
                  Estimasi Kebutuhan Material
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded border border-neutral-200">
                    <div className="text-xs text-neutral-500">Luas Dinding Bersih</div>
                    <div className="text-lg font-bold text-neutral-900 tabular-nums">
                      {wallAreaNet.toFixed(1)} m²
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border border-neutral-200">
                    <div className="text-xs text-neutral-500">Volume Bata Ringan</div>
                    <div className="text-lg font-bold text-amber-700 tabular-nums">
                      {hebelCubic.toFixed(1)} m³
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      (~{Math.round(wallAreaNet * 8.3)} keping)
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded border border-neutral-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs font-semibold text-neutral-800">Mortar Perekat ThinBed</div>
                      <div className="text-xs text-neutral-500">MU-380 (Sak 40kg, tebal spasi 3mm)</div>
                    </div>
                    <div className="text-lg font-bold text-amber-700 tabular-nums">
                      {mortarSacks} Sak
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddHebelToCart}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Masukkan Hebel & Mortar ke Keranjang</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: KERAMIK & GRANIT */}
          {activeTab === 'keramik' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-900">Dimensi Ruangan Lantai</h3>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Panjang Ruangan: <span className="font-mono text-amber-700 font-bold">{tileLength} Meter</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={tileLength}
                    onChange={(e) => setTileLength(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Lebar Ruangan: <span className="font-mono text-amber-700 font-bold">{tileWidth} Meter</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={tileWidth}
                    onChange={(e) => setTileWidth(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Ukuran Ubin Lantai:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTileSize('60x60')}
                      className={`px-3 py-2 text-xs font-medium rounded border cursor-pointer ${
                        tileSize === '60x60'
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                          : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      Granit 60x60 (1.44 m²/dus)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTileSize('40x40')}
                      className={`px-3 py-2 text-xs font-medium rounded border cursor-pointer ${
                        tileSize === '40x40'
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                          : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      Keramik 40x40 (0.96 m²/dus)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Cadangan Potongan Sudut (Waste): <span className="font-mono text-neutral-800 font-bold">+{tileWaste}%</span>
                  </label>
                  <div className="flex gap-2">
                    {[5, 10, 15].map(w => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setTileWaste(w)}
                        className={`flex-1 py-1.5 text-xs rounded border cursor-pointer ${
                          tileWaste === w
                            ? 'bg-neutral-900 text-white font-bold'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        {w}% Cadangan
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Keramik Results Column */}
              <div className="bg-neutral-50 rounded-lg p-5 border border-neutral-200 space-y-4">
                <div className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
                  Hasil Perhitungan Ubin Lantai
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded border border-neutral-200">
                    <div className="text-xs text-neutral-500">Luas Ruangan Bersih</div>
                    <div className="text-lg font-bold text-neutral-900 tabular-nums">
                      {floorRawArea.toFixed(1)} m²
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border border-neutral-200">
                    <div className="text-xs text-neutral-500">Luas + Cadangan ({tileWaste}%)</div>
                    <div className="text-lg font-bold text-neutral-900 tabular-nums">
                      {floorAreaWithWaste.toFixed(2)} m²
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded border border-neutral-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs font-semibold text-neutral-800">
                        {tileSize === '60x60' ? 'Granit Tile 60x60 Glazed' : 'Keramik Lantai 40x40'}
                      </div>
                      <div className="text-xs text-neutral-500">Sudah termasuk margin potongan sudut</div>
                    </div>
                    <div className="text-xl font-extrabold text-amber-700 tabular-nums">
                      {tileBoxes} Dus
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddTilesToCart}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Masukkan {tileBoxes} Dus Keramik ke Keranjang</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CAT DINDING */}
          {activeTab === 'cat' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-900">Luas Bidang Dinding</h3>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Total Luas Dinding: <span className="font-mono text-amber-700 font-bold">{paintArea} m²</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="5"
                    value={paintArea}
                    onChange={(e) => setPaintArea(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="text-[11px] text-neutral-500 mt-1">
                    (Contoh: Ruang 3x4m tinggi 3m = ± 42 m² dinding bersih)
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Jumlah Lapisan Cat:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaintLayers(2)}
                      className={`px-3 py-2 text-xs font-medium rounded border cursor-pointer ${
                        paintLayers === 2
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                          : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      2 Lapisan (Standar Baru)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaintLayers(3)}
                      className={`px-3 py-2 text-xs font-medium rounded border cursor-pointer ${
                        paintLayers === 3
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                          : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      3 Lapisan (Tutup Warna Gelap)
                    </button>
                  </div>
                </div>
              </div>

              {/* Cat Results Column */}
              <div className="bg-neutral-50 rounded-lg p-5 border border-neutral-200 space-y-4">
                <div className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
                  Estimasi Kebutuhan Cat
                </div>

                <div className="bg-white p-3 rounded border border-neutral-200">
                  <div className="text-xs text-neutral-500">Total Luas Sapuan ({paintLayers} Lapis)</div>
                  <div className="text-lg font-bold text-neutral-900 tabular-nums">
                    {totalPaintSurface} m²
                  </div>
                </div>

                <div className="bg-white p-3 rounded border border-neutral-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs font-semibold text-neutral-800">Dulux Catylac Interior (Pail 25 Kg)</div>
                      <div className="text-xs text-neutral-500">Daya sebar ~10 m²/kg/lapis</div>
                    </div>
                    <div className="text-xl font-extrabold text-amber-700 tabular-nums">
                      {paintPails25kg} Pail
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddPaintToCart}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Masukkan Cat ke Keranjang</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: COR BETON */}
          {activeTab === 'cor' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-900">Dimensi Cor Dak / Kolom</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Panjang: <span className="font-mono text-amber-700 font-bold">{slabLength} M</span>
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="15"
                      step="0.5"
                      value={slabLength}
                      onChange={(e) => setSlabLength(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Lebar: <span className="font-mono text-amber-700 font-bold">{slabWidth} M</span>
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="12"
                      step="0.5"
                      value={slabWidth}
                      onChange={(e) => setSlabWidth(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Ketebalan Cor Dak: <span className="font-mono text-amber-700 font-bold">{slabThicknessCm} cm</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="20"
                    step="1"
                    value={slabThicknessCm}
                    onChange={(e) => setSlabThicknessCm(parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="text-[11px] text-neutral-500 mt-1">
                    (Standar dak lantai 2 rumah tinggal: 12 cm)
                  </div>
                </div>
              </div>

              {/* Cor Results Column */}
              <div className="bg-neutral-50 rounded-lg p-5 border border-neutral-200 space-y-3">
                <div className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
                  Estimasi Campuran Beton K-225 (1 : 2 : 3)
                </div>

                <div className="bg-white p-3 rounded border border-neutral-200 flex justify-between items-center">
                  <span className="text-xs text-neutral-600">Volume Total Beton:</span>
                  <span className="text-base font-bold text-neutral-900 tabular-nums">
                    {concreteVolume.toFixed(2)} m³
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="bg-white p-2.5 rounded border border-neutral-200 flex justify-between">
                    <span>Semen Gresik (Sak 40kg)</span>
                    <span className="font-bold text-amber-700 tabular-nums">{cementCorSacks} Sak</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-neutral-200 flex justify-between">
                    <span>Pasir Cor Pasir Hitam</span>
                    <span className="font-bold text-neutral-900 tabular-nums">1 Dump Truck (~6.5 m³)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-neutral-200 flex justify-between">
                    <span>Batu Split Cor 1-2 cm</span>
                    <span className="font-bold text-neutral-900 tabular-nums">1 Dump Truck (~6.5 m³)</span>
                  </div>
                </div>

                <button
                  onClick={handleAddCorToCart}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Masukkan Paket Bahan Cor ke Keranjang</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
