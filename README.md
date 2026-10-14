# 🏗️ TB Mega Bangunan Sentosa - Website Toko Bahan Bangunan & Modul Admin F-07

Aplikasi web modern toko bahan bangunan, grosir material konstruksi SNI, kalkulator kebutuhan material, pemesanan WhatsApp, nota resmi, serta Modul Admin F-07 terintegrasi (CRUD Produk & Kategori, Upload Gambar, Import/Export CSV Excel, Notifikasi Stok Minimum, dan Riwayat Mutasi Stok).

---

## 🚀 Panduan Deploy ke GitHub & Vercel

Aplikasi ini sudah dikonfigurasi secara optimal untuk di-deploy ke **Vercel** melalui repository **GitHub** secara instan (Zero-Config).

### 1. Push Proyek ke GitHub

Buka terminal di komputer Anda pada folder proyek ini dan jalankan perintah berikut:

```bash
# Inisialisasi Git (jika belum)
git init

# Tambahkan seluruh file ke staging
git add .

# Buat commit pertama
git commit -m "feat: Toko Bahan Bangunan & Modul Admin F-07 siap deploy"

# Buat repository baru di GitHub (misal: tb-mega-bangunan)
# Hubungkan ke remote GitHub Anda:
git branch -M main
git remote add origin https://github.com/USERNAME-ANDA/NAMA-REPO-ANDA.git

# Push ke branch main
git push -u origin main
```

---

### 2. Hubungkan & Deploy ke Vercel

1. Buka [https://vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Pilih repository GitHub yang baru saja Anda push (`tb-mega-bangunan`).
4. Vercel akan otomatis membaca file `vercel.json` dan mendeteksi framework **Vite**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Install Command**: `npm install --legacy-peer-deps` (otomatis dikonfigurasi melalui `vercel.json` & `.npmrc`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Klik tombol **"Deploy"**.
6. Dalam hitungan detik (~1 menit), website Anda telah aktif dengan URL resmi (contoh: `https://tb-mega-bangunan.vercel.app`).

---

## 🔑 Akun Login Demo Admin

Untuk mengakses **Modul Admin F-07** (CRUD Data, Kategori, Stok, CSV, & Mutasi):
- Buka tombol **"Modul Admin"** di navigasi atas atau floating button di kiri bawah.
- Tersedia tombol cepat **"One-Click Demo Login"** atau masukkan manual:

| Peran | Username | Password | Wewenang |
| :--- | :--- | :--- | :--- |
| **Owner / Store Admin** | `admin` | `admin123` | Akses penuh seluruh fitur & modifikasi data |
| **Kepala Gudang & Logistik** | `gudang` | `gudang123` | Mutasi stok, restock, audit opname fisik |
| **Kasir & Sales Counter** | `kasir` | `kasir123` | Pencatatan transaksi, cek stok etalase |

---

## 🛠️ Fitur Utama Aplikasi

### 🛒 Toko & Etalase Publik
1. **Katalog Material Lengkap**: Semen & Mortar, Besi Beton & Baja Ringan, Bata & Pasir, Keramik & Granit, Cat & Waterproofing, Pipa PVC & Sanitari, Kayu & Plafon, serta Alat Tukang.
2. **Filter & Pencarian Instan**: Kategori, pencarian teks, toggle khusus sertifikasi SNI, dan pengurutan harga.
3. **Kalkulator Kebutuhan Material**: Perhitungan otomatis material hebel/bata ringan dan keramik/granit lantai dengan tombol langsung masukkan ke keranjang.
4. **Informasi Armada Pengiriman**: Estimasi tonase dan rekomendasi armada (Pick-up, Engkel, Double, Dump Truck).
5. **Formulir Konsultasi RAB / B2B**: Pengajuan penawaran borongan proyek.
6. **Checkout Fleksibel & Nota Pembelian**:
   - Checkout langsung ke WhatsApp admin/sales dengan format pesan tersusun rapi.
   - Fitur pratinjau dan cetak nota / surat jalan resmi (Print to PDF).

### ⚙️ Modul Admin F-07
1. **CRUD Produk**: Tambah produk baru, edit spesifikasi & harga, dan hapus SKU dengan dialog konfirmasi.
2. **Upload Foto**: Unggah gambar langsung dari komputer (FileReader Base64) atau gunakan preset gambar resolusi tinggi.
3. **CRUD Kategori**: Kelola daftar kategori material beserta deskripsinya.
4. **Import & Export CSV Excel**:
   - Unduh template CSV resmi.
   - Ekspor seluruh inventaris ke file CSV.
   - Impor massal CSV dengan pratinjau tabel validasi sebelum disimpan (*Append* atau *Overwrite*).
5. **Pusat Notifikasi Stok Minimum**:
   - Peringatan dini stok habis (0 unit) dan stok menipis ($\le$ threshold).
   - Buat Purchase Order (PO) WhatsApp otomatis ke supplier distributor.
   - Tombol Quick Restock langsung dari kartu peringatan.
6. **Riwayat Mutasi Stok (Audit Trail)**:
   - Pencatatan log mutasi fisik (Restock, Penjualan, Rusak/Afkir, Penyesuaian Stock Opname).
   - Ekspor riwayat mutasi ke CSV.

---

## 💻 Menjalankan di Komputer Lokal

```bash
# Clone repository
git clone https://github.com/USERNAME-ANDA/NAMA-REPO-ANDA.git
cd NAMA-REPO-ANDA

# Install dependensi
npm install

# Jalankan server pengembangan
npm run dev
```

Buka browser Anda di `http://localhost:3000`.

---

## 📦 Build untuk Produksi

```bash
npm run build
```

Hasil build akan otomatis berada di folder `dist/` dan siap disajikan di server hosting apa pun (Vercel, Netlify, Cloudflare Pages, atau GitHub Pages).
