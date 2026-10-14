import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Plus, Trash2, Check, ShieldCheck } from 'lucide-react';
import { Product, CategoryItem } from '../../types';
import { PRESET_MATERIAL_IMAGES } from '../../data/products';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit: Product | null;
  categories: CategoryItem[];
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  categories
}) => {
  if (!isOpen) return null;

  const isEditing = !!productToEdit;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState<number>(50000);
  const [unit, setUnit] = useState('sak');
  const [stock, setStock] = useState<number>(50);
  const [minStockAlert, setMinStockAlert] = useState<number>(10);
  const [minOrder, setMinOrder] = useState<number>(1);
  const [weightKg, setWeightKg] = useState<number>(40);
  const [isSni, setIsSni] = useState(true);
  const [bestseller, setBestseller] = useState(false);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [specsList, setSpecsList] = useState<{ key: string; value: string }[]>([
    { key: 'Standar Mutu', value: 'SNI Resmi' },
    { key: 'Aplikasi', value: 'Konstruksi & Bangunan' }
  ]);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setBrand(productToEdit.brand);
      setPrice(productToEdit.price);
      setUnit(productToEdit.unit);
      setStock(productToEdit.stock ?? 50);
      setMinStockAlert(productToEdit.minStockAlert ?? 10);
      setMinOrder(productToEdit.minOrder);
      setWeightKg(productToEdit.weightKg);
      setIsSni(productToEdit.isSni);
      setBestseller(!!productToEdit.bestseller);
      setDescription(productToEdit.description);
      setImage(productToEdit.image);

      if (productToEdit.specs && Object.keys(productToEdit.specs).length > 0) {
        setSpecsList(Object.entries(productToEdit.specs).map(([key, value]) => ({ key, value: value || '' })));
      } else {
        setSpecsList([{ key: 'Standar', value: 'SNI' }]);
      }
    } else {
      // Defaults for new product
      setName('');
      setCategory(categories[0]?.id || 'semen-mortar');
      setBrand('');
      setPrice(75000);
      setUnit('sak');
      setStock(100);
      setMinStockAlert(10);
      setMinOrder(1);
      setWeightKg(40);
      setIsSni(true);
      setBestseller(false);
      setDescription('');
      setImage(PRESET_MATERIAL_IMAGES[0]?.url || '');
      setSpecsList([
        { key: 'Standar Mutu', value: 'SNI Resmi' },
        { key: 'Kemasan', value: 'Standar Pabrik' }
      ]);
    }
  }, [productToEdit, categories]);

  // Handle local image file upload with FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpec = () => {
    setSpecsList([...specsList, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecsList(specsList.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx: number, field: 'key' | 'value', val: string) => {
    const updated = [...specsList];
    updated[idx][field] = val;
    setSpecsList(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const matchedCategory = categories.find(c => c.id === category);
    const categoryName = matchedCategory ? matchedCategory.name : category;

    const specsObj: { [k: string]: string } = {};
    specsList.forEach(s => {
      if (s.key.trim() && s.value.trim()) {
        specsObj[s.key.trim()] = s.value.trim();
      }
    });

    const newProduct: Product = {
      id: productToEdit ? productToEdit.id : `prd-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      category,
      categoryName,
      brand: brand.trim() || 'TB Mega',
      price: Math.max(0, price),
      unit: unit.trim() || 'buah',
      stock: Math.max(0, stock),
      minStockAlert: Math.max(0, minStockAlert),
      inStock: stock > 0,
      minOrder: Math.max(1, minOrder),
      isSni,
      bestseller,
      weightKg: Math.max(0, weightKg),
      description: description.trim() || `Material konstruksi ${name}`,
      specs: specsObj,
      image: image || PRESET_MATERIAL_IMAGES[0].url
    };

    onSave(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full border border-neutral-200 shadow-2xl overflow-hidden my-8 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800">
          <div>
            <h2 className="text-base font-bold">
              {isEditing ? `Edit Produk: ${productToEdit?.name}` : 'Tambah Produk Bahan Bangunan Baru'}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Modul F-07 Manajemen Produk & Inventaris Gudang
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200 pb-1.5">
              1. Informasi Pokok Produk
            </h3>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Nama Produk Material *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Semen Gresik Portland PCC 40kg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Kategori Material *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Merek / Pabrikan (Brand) *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Semen Gresik / Krakatau Steel / MU"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Deskripsi Singkat & Kegunaan
              </label>
              <textarea
                rows={2}
                placeholder="Rincian kegunaan, kelebihan formula, atau petunjuk penggunaan..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Section 2: Pricing, Stock & Physical Measurement */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200 pb-1.5">
              2. Harga, Stok & Satuan Pengiriman
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Harga Jual Satuan (Rp) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  required
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono font-bold bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Satuan Jual *
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                >
                  <option value="sak">Sak (Semen / Mortar)</option>
                  <option value="batang">Batang (Besi / Baja / Pipa)</option>
                  <option value="m³">m³ (Hebel / Pasir)</option>
                  <option value="dus">Dus (Keramik / Granit / Baut)</option>
                  <option value="pail">Pail (Cat 20-25kg)</option>
                  <option value="galon">Galon (Cat 5kg)</option>
                  <option value="lembar">Lembar (Gypsum / Triplek)</option>
                  <option value="truk">Truk / Rit (Dump Truck)</option>
                  <option value="buah">Buah / Pcs (Sanitari / Alat)</option>
                  <option value="kg">Kg</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Stok Fisik di Gudang *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono font-bold bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Estimasi Berat (Kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
                <span className="text-[11px] text-neutral-400">
                  Untuk armada angkut
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Minimal Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={minOrder}
                  onChange={(e) => setMinOrder(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-sm font-mono bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
                <span className="text-[11px] text-neutral-400">
                  Minimal beli pembeli
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Batas Stok Minimum *
                </label>
                <input
                  type="number"
                  min="0"
                  value={minStockAlert}
                  onChange={(e) => setMinStockAlert(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
                <span className="text-[11px] text-neutral-400">
                  Notifikasi saat stok ≤ angka ini
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800">
                <input
                  type="checkbox"
                  checked={isSni}
                  onChange={(e) => setIsSni(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-neutral-300 focus:ring-amber-500 cursor-pointer"
                />
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Memiliki Sertifikat SNI Resmi</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800">
                <input
                  type="checkbox"
                  checked={bestseller}
                  onChange={(e) => setBestseller(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-neutral-300 focus:ring-amber-500 cursor-pointer"
                />
                <span>Tandai sebagai Produk Terlaris (Bestseller)</span>
              </label>
            </div>
          </div>

          {/* Section 3: Gambar Produk & Upload */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200 pb-1.5">
              3. Foto & Gambar Produk
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
              {/* Image Preview */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-neutral-300 flex items-center justify-center">
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4 text-neutral-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                    <span className="text-xs">Belum ada gambar</span>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="sm:col-span-2 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Unggah Gambar dari Komputer / HP
                  </label>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-neutral-600" />
                    <span>Pilih Berkas Gambar (JPG, PNG, WebP)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Atau Pilih Preset Gambar Kategori Material:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_MATERIAL_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImage(preset.url)}
                        className={`text-left p-2 rounded border text-xs cursor-pointer transition-colors ${
                          image === preset.url
                            ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                            : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Atau Masukkan URL Gambar:
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Dynamic Technical Specs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                4. Spesifikasi Teknis Tambahan
              </h3>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold cursor-pointer inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Baris Spesifikasi</span>
              </button>
            </div>

            <div className="space-y-2">
              {specsList.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Nama Parameter (mis: Tebal, Daya Sebar)"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                    className="w-1/3 px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Nilai (mis: 10 cm, 10 m2/sak)"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-semibold rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              {isEditing ? 'Simpan Perubahan Produk' : 'Tambahkan ke Inventaris'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
