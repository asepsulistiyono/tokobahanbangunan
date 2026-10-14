import { Product } from '../types';

/**
 * Escapes a cell for CSV formatting
 */
function escapeCSV(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes('"') || str.includes(',') || str.includes(';') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Exports products to CSV file and triggers browser download with UTF-8 BOM
 */
export function exportProductsToCSV(products: Product[]): void {
  const headers = [
    'ID Produk',
    'Nama Produk',
    'Kategori ID',
    'Nama Kategori',
    'Merek',
    'Harga (Rp)',
    'Satuan',
    'Stok Gudang',
    'Berat (Kg)',
    'Minimal Order',
    'Standar SNI (Ya/Tidak)',
    'Produk Terlaris (Ya/Tidak)',
    'Deskripsi',
    'URL / Gambar'
  ];

  const rows = products.map((p) => [
    p.id,
    p.name,
    p.category,
    p.categoryName,
    p.brand,
    p.price,
    p.unit,
    p.stock ?? (p.inStock ? 50 : 0),
    p.weightKg,
    p.minOrder,
    p.isSni ? 'Ya' : 'Tidak',
    p.bestseller ? 'Ya' : 'Tidak',
    p.description,
    p.image
  ]);

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\r\n');

  // \uFEFF is the UTF-8 Byte Order Mark for Excel compatibility
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Katalog_Bahan_Bangunan_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates an empty sample template for Excel / CSV import
 */
export function getSampleCSVTemplate(): string {
  const sampleHeaders = [
    'ID Produk',
    'Nama Produk',
    'Kategori ID',
    'Nama Kategori',
    'Merek',
    'Harga (Rp)',
    'Satuan',
    'Stok Gudang',
    'Berat (Kg)',
    'Minimal Order',
    'Standar SNI (Ya/Tidak)',
    'Produk Terlaris (Ya/Tidak)',
    'Deskripsi',
    'URL / Gambar'
  ];

  const sampleRows = [
    [
      'smn-99',
      'Semen Holcim Dynamix Serba Guna 40kg',
      'semen-mortar',
      'Semen & Mortar',
      'Dynamix',
      '55000',
      'sak',
      '150',
      '40',
      '5',
      'Ya',
      'Ya',
      'Semen serbaguna dengan teknologi micro filler butiran ekstra halus.',
      '/src/assets/images/cement_supplies_1791866479238.jpg'
    ],
    [
      'bsi-99',
      'Besi Beton Polos 8mm SNI 12 Meter',
      'besi-baja',
      'Besi & Baja Ringan',
      'Krakatau Steel',
      '52000',
      'batang',
      '200',
      '4.74',
      '5',
      'Ya',
      'Tidak',
      'Besi beton polos 8mm murni toleransi resmi SNI untuk cincin begel.',
      '/src/assets/images/steel_and_roofing_1791866479443.jpg'
    ]
  ];

  return [
    sampleHeaders.map(escapeCSV).join(','),
    ...sampleRows.map(row => row.map(escapeCSV).join(','))
  ].join('\r\n');
}

/**
 * Downloads the sample template directly
 */
export function downloadSampleCSVTemplate(): void {
  const content = getSampleCSVTemplate();
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Template_Import_Produk_Bahan_Bangunan.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Robust CSV Line Parser that handles quotes, escaped quotes, and commas/semicolons
 */
function parseCSVLine(line: string, delimiter: string = ','): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Parses CSV text into Product list
 */
export function parseProductsCSV(csvText: string): {
  success: boolean;
  products: Product[];
  error?: string;
  rowCount: number;
} {
  try {
    // Remove BOM if present
    const cleanText = csvText.replace(/^\uFEFF/, '').trim();
    if (!cleanText) {
      return { success: false, products: [], error: 'File CSV kosong.', rowCount: 0 };
    }

    const rawLines = cleanText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (rawLines.length < 2) {
      return {
        success: false,
        products: [],
        error: 'File CSV harus memiliki minimal 1 baris judul kolom dan 1 baris data.',
        rowCount: 0
      };
    }

    // Detect delimiter: semicolon or comma
    const firstLine = rawLines[0];
    const delimiter = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ';' : ',';

    const header = parseCSVLine(firstLine, delimiter).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
    
    // Find index mappings flexibly
    const idxName = header.findIndex(h => h.includes('nama') || h.includes('name') || h.includes('produk'));
    const idxCat = header.findIndex(h => h.includes('kategoriid') || h.includes('category') || h.includes('kategori'));
    const idxCatName = header.findIndex(h => h.includes('namakategori') || h.includes('categoryname'));
    const idxBrand = header.findIndex(h => h.includes('merek') || h.includes('brand'));
    const idxPrice = header.findIndex(h => h.includes('harga') || h.includes('price'));
    const idxUnit = header.findIndex(h => h.includes('satuan') || h.includes('unit'));
    const idxStock = header.findIndex(h => h.includes('stok') || h.includes('stock'));
    const idxWeight = header.findIndex(h => h.includes('berat') || h.includes('weight'));
    const idxMinOrder = header.findIndex(h => h.includes('min') || h.includes('order'));
    const idxSni = header.findIndex(h => h.includes('sni'));
    const idxBestseller = header.findIndex(h => h.includes('laris') || h.includes('bestseller'));
    const idxDesc = header.findIndex(h => h.includes('deskripsi') || h.includes('desc'));
    const idxImage = header.findIndex(h => h.includes('gambar') || h.includes('image') || h.includes('foto'));
    const idxId = header.findIndex(h => h === 'id' || h.includes('idproduk'));

    const parsedProducts: Product[] = [];

    for (let i = 1; i < rawLines.length; i++) {
      const line = rawLines[i];
      const cols = parseCSVLine(line, delimiter);
      if (cols.length === 0 || !cols.some(c => c.length > 0)) continue;

      const name = (idxName !== -1 ? cols[idxName] : cols[1]) || `Produk Baris ${i}`;
      if (!name) continue;

      const category = (idxCat !== -1 ? cols[idxCat] : cols[2]) || 'semen-mortar';
      const categoryName = (idxCatName !== -1 ? cols[idxCatName] : '') || category;
      const brand = (idxBrand !== -1 ? cols[idxBrand] : cols[4]) || 'Umum';
      
      const rawPrice = idxPrice !== -1 ? cols[idxPrice] : cols[5];
      const price = Math.max(0, parseInt(String(rawPrice).replace(/[^0-9]/g, '')) || 50000);

      const unit = (idxUnit !== -1 ? cols[idxUnit] : cols[6]) || 'sak';
      
      const rawStock = idxStock !== -1 ? cols[idxStock] : cols[7];
      const stock = Math.max(0, parseInt(String(rawStock).replace(/[^0-9]/g, '')) || 50);

      const rawWeight = idxWeight !== -1 ? cols[idxWeight] : cols[8];
      const weightKg = parseFloat(String(rawWeight).replace(/[^0-9.]/g, '')) || 10;

      const rawMin = idxMinOrder !== -1 ? cols[idxMinOrder] : cols[9];
      const minOrder = Math.max(1, parseInt(String(rawMin).replace(/[^0-9]/g, '')) || 1);

      const rawSni = idxSni !== -1 ? cols[idxSni] : cols[10];
      const isSni = ['ya', 'true', '1', 'yes'].includes(String(rawSni).toLowerCase().trim());

      const rawBest = idxBestseller !== -1 ? cols[idxBestseller] : cols[11];
      const bestseller = ['ya', 'true', '1', 'yes'].includes(String(rawBest).toLowerCase().trim());

      const description = (idxDesc !== -1 ? cols[idxDesc] : cols[12]) || `Material konstruksi ${name}`;
      const image = (idxImage !== -1 ? cols[idxImage] : cols[13]) || '/src/assets/images/cement_supplies_1791866479238.jpg';
      const id = (idxId !== -1 && cols[idxId]) ? cols[idxId] : `imp-${Date.now()}-${i}`;

      parsedProducts.push({
        id,
        name,
        category,
        categoryName,
        brand,
        price,
        unit,
        stock,
        inStock: stock > 0,
        minOrder,
        isSni,
        weightKg,
        description,
        specs: {
          'Kategori': categoryName,
          'Merek': brand,
          'Satuan': unit
        },
        image: image || '/src/assets/images/cement_supplies_1791866479238.jpg',
        bestseller
      });
    }

    if (parsedProducts.length === 0) {
      return {
        success: false,
        products: [],
        error: 'Tidak ada baris produk valid yang dapat dibaca dari file CSV ini.',
        rowCount: 0
      };
    }

    return {
      success: true,
      products: parsedProducts,
      rowCount: parsedProducts.length
    };
  } catch (err: any) {
    return {
      success: false,
      products: [],
      error: `Gagal memproses file CSV: ${err.message || 'Format tidak valid'}`,
      rowCount: 0
    };
  }
}
