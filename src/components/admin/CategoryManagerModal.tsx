import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Check, FolderTree } from 'lucide-react';
import { CategoryItem, Product } from '../../types';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  products: Product[];
  onAddCategory: (cat: CategoryItem) => void;
  onEditCategory: (id: string, updatedName: string, updatedDesc?: string) => void;
  onDeleteCategory: (id: string) => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  products,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}) => {
  if (!isOpen) return null;

  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingDesc, setEditingDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const slug = newName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newCat: CategoryItem = {
      id: slug || `cat-${Date.now()}`,
      name: newName.trim(),
      description: newDesc.trim() || undefined
    };

    onAddCategory(newCat);
    setNewName('');
    setNewDesc('');
  };

  const startEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
    setEditingDesc(cat.description || '');
  };

  const saveEdit = (id: string) => {
    if (!editingName.trim()) return;
    onEditCategory(id, editingName.trim(), editingDesc.trim());
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-2xl max-w-xl w-full border border-neutral-200 shadow-2xl overflow-hidden my-8 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold">Kelola Kategori Bahan Bangunan</h3>
              <p className="text-xs text-neutral-400">Tambah, ubah nama, atau hapus kategori etalase</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Create New Form */}
          <form onSubmit={handleCreate} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              + Tambah Kategori Baru
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Genteng & Atap Metal"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                  Keterangan / Sub-Bahan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: Genteng beton, spandek pasir"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Simpan Kategori</span>
              </button>
            </div>
          </form>

          {/* Existing Categories List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Daftar Kategori Aktif ({categories.length})
              </span>
            </div>

            <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl overflow-hidden">
              {categories.map((cat) => {
                const productCount = products.filter(p => p.category === cat.id).length;
                const isEditing = editingId === cat.id;

                return (
                  <div key={cat.id} className="p-3 bg-white flex items-center justify-between gap-3 hover:bg-neutral-50 transition-colors">
                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="px-2 py-1 text-xs border border-amber-500 rounded bg-amber-50/50 flex-1"
                        />
                        <button
                          onClick={() => saveEdit(cat.id)}
                          className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-900 truncate">
                            {cat.name}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            ({cat.id})
                          </span>
                        </div>
                        {cat.description && (
                          <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono tabular-nums bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                        {productCount} Produk
                      </span>

                      {!isEditing && (
                        <>
                          <button
                            onClick={() => startEdit(cat)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 transition-colors"
                            title="Edit Nama"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (productCount > 0) {
                                if (!window.confirm(`Kategori ini memiliki ${productCount} produk aktif. Menghapus kategori ini akan memindahkan produk ke kategori umum. Lanjutkan?`)) {
                                  return;
                                }
                              }
                              onDeleteCategory(cat.id);
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                            title="Hapus Kategori"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
