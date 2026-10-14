import { Product, ProductCategory, CategoryItem } from '../types';

export const CEMENT_IMG = '/src/assets/images/cement_supplies_1791866479238.jpg';
export const STEEL_IMG = '/src/assets/images/steel_and_roofing_1791866479443.jpg';
export const TILES_IMG = '/src/assets/images/tiles_and_ceramics_1791866479475.jpg';
export const WAREHOUSE_IMG = '/src/assets/images/hero_building_warehouse_1791866448232.jpg';

export const PRESET_MATERIAL_IMAGES = [
  { name: 'Semen & Pasir (Gudang)', url: CEMENT_IMG },
  { name: 'Besi Beton & Rangka Baja', url: STEEL_IMG },
  { name: 'Keramik & Granit Mewah', url: TILES_IMG },
  { name: 'Gudang Pusat Material', url: WAREHOUSE_IMG }
];

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'semen-mortar', name: 'Semen & Mortar', description: 'Portland cement, semen acian, perekat hebel thinbed' },
  { id: 'besi-baja', name: 'Besi & Baja Ringan', description: 'Besi beton ulir & polos SNI, canal C, reng, wiremesh' },
  { id: 'bata-pasir', name: 'Bata, Pasir & Batu', description: 'Bata ringan AAC, pasir cor Lumajang, batu split' },
  { id: 'keramik-granit', name: 'Keramik & Granit', description: 'Granit tile 60x60 nano polish, keramik lantai & dinding' },
  { id: 'cat-waterproof', name: 'Cat & Waterproofing', description: 'Cat pelapis anti bocor No Drop, catylac interior' },
  { id: 'pipa-sanitari', name: 'Pipa & Sanitari', description: 'Pipa PVC AW tebal, fitting, kran, sanitari kloset' },
  { id: 'kayu-plafon', name: 'Kayu & Plafon', description: 'Gypsum board Jayaboard, hollow galvalum, plywood triplek' },
  { id: 'alat-baut', name: 'Alat & Baut', description: 'Baut roofing baja ringan SDS, sendok semen, perkakas' }
];

const RAW_PRODUCTS = [
  // Semen & Mortar
  {
    id: 'smn-01',
    name: 'Semen Gresik Portland PCC 40kg',
    category: 'semen-mortar',
    categoryName: 'Semen & Mortar',
    brand: 'Semen Gresik',
    price: 56500,
    unit: 'sak',
    stock: 350,
    image: CEMENT_IMG,
    inStock: true,
    minOrder: 5,
    isSni: true,
    weightKg: 40,
    description: 'Semen Portland Composite berkualitas tinggi untuk konstruksi umum, pasangan bata, plesteran, dan acian halus. Kuat tekan optimal dan daya rekat prima.',
    specs: {
      'Standar Mutu': 'SNI 7064:2014',
      'Berat Bersih': '40 Kg',
      'Tipe': 'PCC (Portland Composite Cement)',
      'Aplikasi': 'Pondasi, struktur kolom, pasangan bata, plesteran'
    },
    bestseller: true
  },
  {
    id: 'smn-02',
    name: 'Semen Tiga Roda PCC 50kg',
    category: 'semen-mortar',
    categoryName: 'Semen & Mortar',
    brand: 'Tiga Roda',
    price: 69000,
    unit: 'sak',
    image: CEMENT_IMG,
    inStock: true,
    minOrder: 5,
    isSni: true,
    weightKg: 50,
    description: 'Semen Tiga Roda formula khusus menghasilkan adukan lebih pulen, mudah diaplikasikan, serta memberikan hasil akhir permukaan dinding yang padat.',
    specs: {
      'Standar Mutu': 'SNI 15-7064-2004',
      'Berat Bersih': '50 Kg',
      'Tipe': 'Portland Composite Cement',
      'Keunggulan': 'Waktu pengerasan stabil, tidak mudah retak rambut'
    },
    bestseller: true
  },
  {
    id: 'smn-03',
    name: 'MU-380 ThinBed Mortar Perekat Bata Ringan 40kg',
    category: 'semen-mortar',
    categoryName: 'Semen & Mortar',
    brand: 'Mortar Utama (MU)',
    price: 88000,
    unit: 'sak',
    image: CEMENT_IMG,
    inStock: true,
    minOrder: 2,
    isSni: true,
    weightKg: 40,
    description: 'Semen instan siap pakai khusus untuk pekerjaan pemasangan bata ringan (ALC/AAC block) dengan ketebalan aplikasi 3 mm. Daya rekat sangat tinggi.',
    specs: {
      'Daya Sebar': '± 10 m² per sak 40kg (bata tebal 10 cm)',
      'Ketebalan Aplikasi': '± 3 mm',
      'Kebutuhan Air': '9.0 - 9.5 Liter per sak',
      'Waktu Kering': 'Siap dibebani plester setelah 24 jam'
    },
    bestseller: true
  },
  {
    id: 'smn-04',
    name: 'MU-200 SkimWall Semen Acian Instan 40kg',
    category: 'semen-mortar',
    categoryName: 'Semen & Mortar',
    brand: 'Mortar Utama (MU)',
    price: 97500,
    unit: 'sak',
    image: CEMENT_IMG,
    inStock: true,
    minOrder: 2,
    isSni: true,
    weightKg: 40,
    description: 'Acian instan premium untuk dinding plesteran interior maupun eksterior. Menghasilkan permukaan dinding halus, siap dicat tanpa plamir, mencegah retak rambut.',
    specs: {
      'Daya Sebar': '± 18 - 20 m² per sak tebal 1.5 - 2 mm',
      'Bahan Pengikat': 'Semen Portland & Filler Aditif Premium',
      'Keunggulan': 'Tidak berdebu, hemat cat primer'
    }
  },

  // Besi & Baja Ringan
  {
    id: 'bsi-01',
    name: 'Besi Beton Ulir 13mm SNI Panjang 12 Meter',
    category: 'besi-baja',
    categoryName: 'Besi & Baja Ringan',
    brand: 'Krakatau Steel (KS)',
    price: 132000,
    unit: 'batang',
    image: STEEL_IMG,
    inStock: true,
    minOrder: 5,
    isSni: true,
    weightKg: 12.5,
    description: 'Besi beton ulir mutu SNI penuh asli Krakatau Steel / Master Steel. Sangat ideal untuk struktur tulangan balok, kolom lantai 2+, dan sloof penahan gempa.',
    specs: {
      'Diameter': 'D13 mm Ulir Penuh',
      'Panjang': '12.0 Meter',
      'Standar': 'SNI 2052:2017 BjTS 420B',
      'Toleransi': 'Sesuai Standar SNI Resmi'
    },
    bestseller: true
  },
  {
    id: 'bsi-02',
    name: 'Besi Beton Polos 10mm SNI Panjang 12 Meter',
    category: 'besi-baja',
    categoryName: 'Besi & Baja Ringan',
    brand: 'Krakatau Steel (KS)',
    price: 78500,
    unit: 'batang',
    image: STEEL_IMG,
    inStock: true,
    minOrder: 5,
    isSni: true,
    weightKg: 7.4,
    description: 'Besi beton polos SNI diameter 10mm murni. Cocok untuk tulangan tiang cor rumah 1-2 lantai, begel ring balok, dan cor lantai dasar.',
    specs: {
      'Diameter': '10 mm Polos',
      'Panjang': '12.0 Meter',
      'Standar': 'SNI 2052:2017 BjTP 280',
      'Kondisi': 'Baja baru tanpa karat'
    },
    bestseller: true
  },
  {
    id: 'bsi-03',
    name: 'Baja Ringan Canal C75 Tebal 0.75mm Panjang 6M',
    category: 'besi-baja',
    categoryName: 'Besi & Baja Ringan',
    brand: 'Kencana Truss',
    price: 94000,
    unit: 'batang',
    image: STEEL_IMG,
    inStock: true,
    minOrder: 10,
    isSni: true,
    weightKg: 4.8,
    description: 'Truss profil C75 baja lapis Zincalume/Galvalume tebal 0.75 mm asli. Tahan karat, anti rayap, ringan namun kokoh untuk rangka atap genteng beton & metal.',
    specs: {
      'Profil': 'Canal C75 (Ketinggian 75 mm)',
      'Tebal Efektif': '0.75 mm TCT',
      'Panjang': '6.0 Meter',
      'Lapisan': 'Galvalume AZ 100 g/m² SNI'
    },
    bestseller: true
  },
  {
    id: 'bsi-04',
    name: 'Reng Baja Ringan 30x0.45mm Panjang 6M',
    category: 'besi-baja',
    categoryName: 'Besi & Baja Ringan',
    brand: 'Kencana Truss',
    price: 43000,
    unit: 'batang',
    image: STEEL_IMG,
    inStock: true,
    minOrder: 10,
    isSni: true,
    weightKg: 1.8,
    description: 'Reng baja galvalume presisi tinggi sebagai tumpuan genteng keramik, genteng metal, atau spandek. Pemasangan cepat dan lurus.',
    specs: {
      'Dimensi': 'Tinggi 30 mm, Lebar 45 mm',
      'Tebal': '0.45 mm',
      'Panjang': '6.0 Meter'
    }
  },
  {
    id: 'bsi-05',
    name: 'Wiremesh Cor M8 SNI Lembaran (2.1 x 5.4 Meter)',
    category: 'besi-baja',
    categoryName: 'Besi & Baja Ringan',
    brand: 'Boma Bisma SNI',
    price: 485000,
    unit: 'lembar',
    image: STEEL_IMG,
    inStock: true,
    minOrder: 1,
    isSni: true,
    weightKg: 43.5,
    description: 'Wiremesh las mesin otomatis untuk tulangan dak cor lantai beton, jalan beton, dan plat lantai. Mempercepat pengerjaan tanpa perlu merakit manual.',
    specs: {
      'Ukuran Kawat': 'M8 (Diameter 8 mm ulir/polos)',
      'Dimensi Lembar': '2.10 x 5.40 Meter',
      'Spasi Jaring': '15 x 15 cm'
    }
  },

  // Bata, Pasir & Batu
  {
    id: 'bta-01',
    name: 'Bata Ringan Hebel AAC Grade A Tebal 10cm',
    category: 'bata-pasir',
    categoryName: 'Bata, Pasir & Batu',
    brand: 'Blesscon / Grand Elephant',
    price: 625000,
    unit: 'm³',
    image: WAREHOUSE_IMG,
    inStock: true,
    minOrder: 1,
    isSni: true,
    weightKg: 550,
    description: 'Bata ringan Autoclaved Aerated Concrete mutu tinggi. Potongan presisi laser, kedap suara, tahan api, dan hemat penggunaan semen mortar.',
    specs: {
      'Dimensi': '60 cm x 20 cm x 10 cm',
      'Isi per 1 m³': '83 buah (menutupi ± 10 m² dinding)',
      'Kepadatan Kering': '520 - 550 kg/m³',
      'Kuat Tekan': '> 4.0 N/mm²'
    },
    bestseller: true
  },
  {
    id: 'bta-02',
    name: 'Bata Ringan Hebel AAC Tebal 7.5cm',
    category: 'bata-pasir',
    categoryName: 'Bata, Pasir & Batu',
    brand: 'Blesscon / Grand Elephant',
    price: 635000,
    unit: 'm³',
    image: WAREHOUSE_IMG,
    inStock: true,
    minOrder: 1,
    isSni: true,
    weightKg: 540,
    description: 'Bata ringan tebal 7.5 cm sangat ideal untuk sekat partisi ruangan dalam rumah, kos-kosan, atau ruko agar ruang tidak terbuang tebal.',
    specs: {
      'Dimensi': '60 cm x 20 cm x 7.5 cm',
      'Isi per 1 m³': '111 buah (menutupi ± 13.3 m² dinding)',
      'Keunggulan': 'Presisi, dinding lebih tipis namun kokoh'
    }
  },
  {
    id: 'bta-03',
    name: 'Pasir Cor Extra Hitam Muntilan / Lumajang',
    category: 'bata-pasir',
    categoryName: 'Bata, Pasir & Batu',
    brand: 'Gunung Berapi Asli',
    price: 1850000,
    unit: 'truk',
    image: WAREHOUSE_IMG,
    inStock: true,
    minOrder: 1,
    isSni: false,
    weightKg: 8500,
    description: 'Pasir vulkanik silika hitam kasar murni tanpa kandungan lumpur. Pilihan nomor satu tukang untuk cor dak beton, pondasi cakar ayam, dan plester kasar.',
    specs: {
      'Volume Muatan': '± 6.5 - 7.0 m³ per Dump Truck',
      'Kadar Lumpur': '< 3% (Bersih tidak perlu ayak cuci)',
      'Tekstur': 'Kasar tajam berbutir'
    },
    bestseller: true
  },
  {
    id: 'bta-04',
    name: 'Batu Split Cor Beton Ukuran 1-2 cm',
    category: 'bata-pasir',
    categoryName: 'Bata, Pasir & Batu',
    brand: 'Quarry Stone SNI',
    price: 1750000,
    unit: 'truk',
    image: WAREHOUSE_IMG,
    inStock: true,
    minOrder: 1,
    isSni: false,
    weightKg: 9000,
    description: 'Batu split pecah mesin ukuran 10-20mm untuk campuran beton bertulang struktural. Bebas tanah dan lempung, mengikat sempurna dengan semen.',
    specs: {
      'Ukuran': '1x2 cm (10 - 20 mm)',
      'Volume Muatan': '± 6.5 m³ per Dump Truck',
      'Jenis': 'Batu andesit pecah mesin'
    }
  },

  // Keramik & Granit
  {
    id: 'krm-01',
    name: 'Granit Tile 60x60 Glazed Polished Calacatta Gold',
    category: 'keramik-granit',
    categoryName: 'Keramik & Granit',
    brand: 'Indogress / Garuda Tile',
    price: 185000,
    unit: 'dus',
    image: TILES_IMG,
    inStock: true,
    minOrder: 2,
    isSni: true,
    weightKg: 30,
    description: 'Granit tile mewah motif marmer Calacatta dengan guratan emas alami. Permukaan nano-gloss mengkilap, tahan gores, dan mudah dibersihkan.',
    specs: {
      'Ukuran': '60 x 60 cm',
      'Isi per Dus': '4 Lembar (1.44 m²)',
      'Permukaan': 'High Gloss Nano Polished',
      'Ketebalan': '9.5 mm'
    },
    bestseller: true
  },
  {
    id: 'krm-02',
    name: 'Keramik Lantai 40x40 Matt Grey Stone',
    category: 'keramik-granit',
    categoryName: 'Keramik & Granit',
    brand: 'Roman Ceramics',
    price: 98000,
    unit: 'dus',
    image: TILES_IMG,
    inStock: true,
    minOrder: 3,
    isSni: true,
    weightKg: 16.5,
    description: 'Keramik lantai motif batu abu-abu elegan dengan permukaan matt anti-licin. Sangat cocok untuk teras, carport, ruang tamu, dan dapur minimalis.',
    specs: {
      'Ukuran': '40 x 40 cm',
      'Isi per Dus': '6 Lembar (0.96 m²)',
      'Tekstur': 'Matt / Satin Anti-Slip',
      'Tingkat Ketahanan': 'Grade A1 Kualitas Export'
    },
    bestseller: true
  },
  {
    id: 'krm-03',
    name: 'Keramik Dinding Kamar Mandi 25x40 Glossy White Subway',
    category: 'keramik-granit',
    categoryName: 'Keramik & Granit',
    brand: 'Mulia Ceramics',
    price: 74500,
    unit: 'dus',
    image: TILES_IMG,
    inStock: true,
    minOrder: 2,
    isSni: true,
    weightKg: 14,
    description: 'Keramik dinding glossy putih bersih untuk kamar mandi dan dinding dapur (backsplash). Tahan jamur dan lumut serta mudah dilap bersih.',
    specs: {
      'Ukuran': '25 x 40 cm',
      'Isi per Dus': '10 Lembar (1.00 m²)',
      'Permukaan': 'Glossy Mengkilap Putih'
    }
  },

  // Cat & Waterproofing
  {
    id: 'cat-01',
    name: 'No Drop Cat Pelapis Anti Bocor Abu-Abu 20kg',
    category: 'cat-waterproof',
    categoryName: 'Cat & Waterproofing',
    brand: 'Avian Brands (No Drop)',
    price: 895000,
    unit: 'pail',
    image: CEMENT_IMG,
    inStock: true,
    minOrder: 1,
    isSni: true,
    weightKg: 20,
    description: 'Cat pelapis antibocor nomor satu di Indonesia yang kedap air, elastis tahan retak, dan anti jamur. Melindungi dak beton, talang air, dinding luar, dan asbes.',
    specs: {
      'Kemasan': 'Pail 20 Kg',
      'Warna': '002 Abu-Abu (Grey)',
      'Daya Sebar': '2 m² per Kg (2 lapis)',
      'Elastisitas': 'Melar hingga 500% tanpa sobek'
    },
    bestseller: true
  },
  {
    id: 'cat-02',
    name: 'Dulux Catylac Interior Putih Bersih 25kg',
    category: 'cat-waterproof',
    categoryName: 'Cat & Waterproofing',
    brand: 'Dulux',
    price: 685000,
    unit: 'pail',
    image: CEMENT_IMG,
    inStock: true,
    minOrder: 1,
    isSni: true,
    weightKg: 25,
    description: 'Cat tembok interior bermutu tinggi dengan Chroma Brite Technology. Warna cerah tahan lama, daya tutup luas, dan aroma tidak menyengat (rendah VOC).',
    specs: {
      'Kemasan': 'Pail 25 Kg',
      'Daya Sebar': '8 - 10 m² per Kg per lapis',
      'Pengenceran': 'Air bersih 10 - 20%',
      'Waktu Pengeringan': '1 - 2 Jam'
    },
    bestseller: true
  },
  {
    id: 'cat-03',
    name: 'Nippon Paint Weatherbond Eksterior 5 Liter',
    category: 'cat-waterproof',
    categoryName: 'Cat & Waterproofing',
    brand: 'Nippon Paint',
    price: 360000,
    unit: 'galon',
    image: CEMENT_IMG,
    inStock: true,
    minOrder: 1,
    isSni: true,
    weightKg: 6,
    description: 'Cat dinding luar tahan cuaca ekstrem panas dan hujan hingga 5 tahun. Anti pudar ultraviolet, anti lumut, dan formulasi anti kotoran menempel.',
    specs: {
      'Kemasan': 'Galon 5 Liter (± 6.5 kg)',
      'Ketahanan': 'Formula 5 Tahun Cuaca Ekstrem',
      'Hasil Akhir': 'Semi Doff Halus'
    }
  },

  // Pipa & Sanitari
  {
    id: 'ppa-01',
    name: 'Pipa PVC Rucika Standard AW 3 Inch Panjang 4M',
    category: 'pipa-sanitari',
    categoryName: 'Pipa & Sanitari',
    brand: 'Rucika',
    price: 158000,
    unit: 'batang',
    image: STEEL_IMG,
    inStock: true,
    minOrder: 2,
    isSni: true,
    weightKg: 4.5,
    description: 'Pipa PVC tekanan tinggi kelas AW untuk saluran air kotor talang, pembuangan closed septic tank, dan drainase air hujan. Dinding tebal dan anti pecah.',
    specs: {
      'Diameter': '3 Inch (DN 75 mm)',
      'Kelas Tekanan': 'AW (Tahan hingga 10 bar)',
      'Panjang': '4.0 Meter',
      'Standar': 'SNI / JIS K 6741'
    },
    bestseller: true
  },
  {
    id: 'ppa-02',
    name: 'Pipa PVC Rucika Standard AW 1/2 Inch Panjang 4M',
    category: 'pipa-sanitari',
    categoryName: 'Pipa & Sanitari',
    brand: 'Rucika',
    price: 38500,
    unit: 'batang',
    image: STEEL_IMG,
    inStock: true,
    minOrder: 5,
    isSni: true,
    weightKg: 1.1,
    description: 'Pipa air bersih PDAM dan pompa sumur kelas AW tebal. Tidak getas dan aman untuk saluran air minum rumah tangga.',
    specs: {
      'Diameter': '1/2 Inch (DN 16 mm)',
      'Kelas Tekanan': 'AW (High Pressure)',
      'Panjang': '4.0 Meter'
    }
  },
  {
    id: 'ppa-03',
    name: 'Kloset Duduk Monoblok Dual Flush Soft Close',
    category: 'pipa-sanitari',
    categoryName: 'Pipa & Sanitari',
    brand: 'TOTO / Oulu',
    price: 1450000,
    unit: 'buah',
    image: TILES_IMG,
    inStock: true,
    minOrder: 1,
    isSni: true,
    weightKg: 32,
    description: 'Kloset duduk modern hemat air dual flush (3L / 6L), tutup soft-closing hidrolik tidak berisik, porselen keramik putih tebal anti noda.',
    specs: {
      'Jarak Rough-in As': '300 mm (30 cm)',
      'Mekanisme': 'Siphonic Dual Flush 3/6 Liter',
      'Garansi': 'Porselen 5 Tahun'
    }
  },

  // Kayu & Plafon
  {
    id: 'plf-01',
    name: 'Papan Gypsum Jayaboard Sheetrock 9mm (1.2 x 2.4M)',
    category: 'kayu-plafon',
    categoryName: 'Kayu & Plafon',
    brand: 'Jayaboard USG Boral',
    price: 79000,
    unit: 'lembar',
    image: WAREHOUSE_IMG,
    inStock: true,
    minOrder: 5,
    isSni: true,
    weightKg: 15,
    description: 'Papan gypsum terkemuka di Indonesia dengan teknologi Sag-Defying-Strength. Ringan, tidak mudah lendut, tahan api, dan sambungan sangat rata.',
    specs: {
      'Tebal': '9.0 mm',
      'Dimensi': '1200 x 2400 mm (1.2 x 2.4 m)',
      'Standar': 'SNI 03-6384-2000'
    },
    bestseller: true
  },
  {
    id: 'plf-02',
    name: 'Hollow Galvalume Plafon 4x4 (0.35mm Tebal) 4 Meter',
    category: 'kayu-plafon',
    categoryName: 'Kayu & Plafon',
    brand: 'Kencana Galvanis',
    price: 26500,
    unit: 'batang',
    image: STEEL_IMG,
    inStock: true,
    minOrder: 10,
    isSni: true,
    weightKg: 1.2,
    description: 'Besi hollow galvanis anti karat untuk rangka plafon gypsum, PVC, dan partisi dinding ringan.',
    specs: {
      'Ukuran': '35 x 35 mm (standar 4x4)',
      'Tebal': '0.35 mm',
      'Panjang': '4.0 Meter'
    }
  },
  {
    id: 'plf-03',
    name: 'Triplek Meranti MC Campur Tebal 12mm (1.22 x 2.44M)',
    category: 'kayu-plafon',
    categoryName: 'Kayu & Plafon',
    brand: 'Kayu Rimba Lestari',
    price: 168000,
    unit: 'lembar',
    image: WAREHOUSE_IMG,
    inStock: true,
    minOrder: 3,
    isSni: false,
    weightKg: 18,
    description: 'Kayu lapis / plywood kualitas MC meranti campur. Kuat untuk begisting cor dak beton, furnitur dasar, dan lantai sementara proyek.',
    specs: {
      'Dimensi': '1.22 x 2.44 Meter (4 x 8 feet)',
      'Tebal': '12.0 mm',
      'Lapisan': 'Plywood 5 layer padat'
    }
  },

  // Alat Tukang & Mur Baut
  {
    id: 'alt-01',
    name: 'Sekrup Roofing Baut Baja Ringan 10 x 19mm (Dus 1000 Pcs)',
    category: 'alat-baut',
    categoryName: 'Alat Tukang & Mur Baut',
    brand: 'Moon Lion / SDS Pro',
    price: 95000,
    unit: 'dus',
    image: STEEL_IMG,
    inStock: true,
    minOrder: 1,
    isSni: true,
    weightKg: 2.2,
    description: 'Baut self drilling screw (SDS) ujung bor tajam baja keras. Sangat mudah menembus profil reng dan baja ringan canal C tanpa perlu bor awal.',
    specs: {
      'Ukuran': '#10 x 19 mm (3/4 Inch)',
      'Kepala': 'Hexagonal 8 mm',
      'Isi Kemasan': '1.000 Pcs / Dus'
    }
  },
  {
    id: 'alt-02',
    name: 'Sendok Semen Lancip Baja Gagang Karet 7 Inch',
    category: 'alat-baut',
    categoryName: 'Alat Tukang & Mur Baut',
    brand: 'Camel Pro Tools',
    price: 28000,
    unit: 'buah',
    image: CEMENT_IMG,
    inStock: true,
    minOrder: 1,
    isSni: false,
    weightKg: 0.35,
    description: 'Cetok / sendok adukan semen plat baja pegas lentur tidak mudah patah. Gagang dilapisi karet ergonomis anti selip.',
    specs: {
      'Panjang Daun': '7 Inch (± 18 cm)',
      'Material': 'Baja Karbon Tempa',
      'Gagang': 'Ergonomic Rubber Grip'
    }
  }
];

export const PRODUCTS: Product[] = RAW_PRODUCTS.map((p) => {
  const stock = (p as any).stock ?? (
    p.id.startsWith('smn') ? 280 :
    p.id.startsWith('bsi') ? 140 :
    p.id.startsWith('bta') ? 35 :
    p.id.startsWith('krm') ? 85 :
    p.id.startsWith('cat') ? 40 :
    p.id.startsWith('ppa') ? 95 :
    p.id.startsWith('plf') ? 110 : 70
  );
  return {
    ...p,
    category: p.category as ProductCategory,
    specs: p.specs as unknown as Record<string, string>,
    stock,
    inStock: stock > 0
  } as Product;
});

export const CATEGORIES_LIST: { id: ProductCategory; name: string }[] = [
  { id: 'all', name: 'Semua Produk' },
  { id: 'semen-mortar', name: 'Semen & Mortar' },
  { id: 'besi-baja', name: 'Besi & Baja Ringan' },
  { id: 'bata-pasir', name: 'Bata, Pasir & Batu' },
  { id: 'keramik-granit', name: 'Keramik & Granit' },
  { id: 'cat-waterproof', name: 'Cat & Waterproofing' },
  { id: 'pipa-sanitari', name: 'Pipa & Sanitari' },
  { id: 'kayu-plafon', name: 'Kayu & Plafon' },
  { id: 'alat-baut', name: 'Alat & Baut' }
];

export const DELIVERY_FLEETS = [
  {
    id: 'fleet-pickup',
    name: 'Mobil Pick-Up (L300 / GranMax)',
    capacity: 'Maks. 1.2 Ton / 25 Sak Semen',
    leadTime: 'Kirim dalam 2 - 4 Jam',
    suitableFor: 'Akses gang & perumahan jalan 3 meter, keramik s.d 40 dus, cat, baja ringan s.d 50 btg.',
    basePrice: 50000,
    freeThreshold: 1500000
  },
  {
    id: 'fleet-engkel',
    name: 'Truk Engkel 4 Roda (Colt Diesel)',
    capacity: 'Maks. 3.5 Ton / 70 Sak Semen / Hebel 6 m³',
    leadTime: 'Kirim Hari yang Sama',
    suitableFor: 'Jalan raya lingkungan, renovasi rumah tinggal, ruko, besi beton 12m ditekuk.',
    basePrice: 150000,
    freeThreshold: 4500000
  },
  {
    id: 'fleet-double',
    name: 'Truk Double 6 Roda',
    capacity: 'Maks. 8.0 Ton / 150 Sak Semen / Hebel 12 m³',
    leadTime: 'Jadwal Pesan H-1',
    suitableFor: 'Proyek gedung, perumahan cluster baru, volume borongan, akses jalan lebar min. 6 meter.',
    basePrice: 280000,
    freeThreshold: 10000000
  },
  {
    id: 'fleet-dumptruck',
    name: 'Dump Truck Pasir & Batu Belah',
    capacity: 'Volume 6.5 - 7.0 m³ per Rit',
    leadTime: 'Kirim Pagi / Siang',
    suitableFor: 'Pengiriman pasir cor Lumajang, batu split cor, sirtu urugan langsung tumpah di lokasi.',
    basePrice: 0, // Included in sand/stone truck price
    freeThreshold: 0
  }
];
