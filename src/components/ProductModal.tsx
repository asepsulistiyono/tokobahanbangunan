import React, { useState } from 'react';
import { X, ShieldCheck, Check, Plus, PackageCheck, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { formatRupiah, formatWeight } from '../utils/formatters';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  const [qty, setQty] = useState<number>(product.minOrder);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full border border-neutral-200 shadow-2xl overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Product Image */}
          <div className="relative bg-neutral-100 aspect-square sm:aspect-auto">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {product.isSni && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-neutral-900/90 text-white text-xs px-2.5 py-1 rounded">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Sertifikasi SNI Resmi</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                {product.brand} · {product.categoryName}
              </div>
              <h2 className="text-xl font-extrabold text-neutral-900 mb-3 leading-snug">
                {product.name}
              </h2>

              <div className="text-2xl font-black text-neutral-950 tabular-nums mb-4">
                {formatRupiah(product.price)}
                <span className="text-xs font-normal text-neutral-500 ml-1.5">
                  / {product.unit}
                </span>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Technical Specifications Table */}
              <div className="mb-4 bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                <div className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Spesifikasi Teknis
                </div>
                <dl className="space-y-1.5 text-xs">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-neutral-200/60 pb-1">
                      <dt className="text-neutral-500">{key}:</dt>
                      <dd className="font-semibold text-neutral-800 text-right">{value}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between pt-1">
                    <dt className="text-neutral-500">Estimasi Bobot:</dt>
                    <dd className="font-mono font-bold text-neutral-800 tabular-nums">{formatWeight(product.weightKg)}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded border border-amber-200 mb-4">
                <PackageCheck className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Minimal order {product.minOrder} {product.unit}. Melayani pengiriman armada & bongkar muat.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-neutral-300 rounded-lg bg-neutral-50">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(product.minOrder, qty - 1))}
                    className="w-9 h-10 flex items-center justify-center font-bold text-neutral-600 hover:bg-neutral-200 cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(Math.max(product.minOrder, parseInt(e.target.value) || product.minOrder))}
                    className="w-14 h-10 text-center text-sm font-mono font-bold bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    className="w-9 h-10 flex items-center justify-center font-bold text-neutral-600 hover:bg-neutral-200 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Berhasil Dimasukkan</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>Tambah ke Keranjang ({formatRupiah(product.price * qty)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
