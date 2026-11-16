// Mock catalogue. Photos are Unsplash (free to use under the Unsplash licence).
// Brands and product names are invented for this prototype.

export const photo = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

export type Category = {
  id: string;
  name: string;
  image: string;
  count: number;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  images: string[];
  sizes: string[];
  badge?: 'New' | 'Low stock' | 'Independent' | 'Bestseller';
  description: string;
  details: string[];
};

export type Look = {
  id: string;
  title: string;
  caption: string;
  image: string;
  // Hotspots are positioned in % of the image so they sit on the right item.
  hotspots: { productId: string; x: number; y: number }[];
};

export const categories: Category[] = [
  { id: 'women', name: 'Women', image: photo('photo-1496747611176-843222e1e57c', 600), count: 128 },
  { id: 'men', name: 'Men', image: photo('photo-1617137968427-85924c800a22', 600), count: 96 },
  { id: 'shoes', name: 'Shoes', image: photo('photo-1542291026-7eec264c27ff', 600), count: 54 },
  { id: 'bags', name: 'Bags', image: photo('photo-1584917865442-de89df76afd3', 600), count: 41 },
  { id: 'outerwear', name: 'Outerwear', image: photo('photo-1551488831-00ddcb6c6bd3', 600), count: 33 },
  { id: 'accessories', name: 'Accessories', image: photo('photo-1544441893-675973e31985', 600), count: 62 },
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Sky Wrap Dress',
    brand: 'Maison Vell',
    category: 'women',
    price: 118,
    compareAt: 150,
    rating: 4.8,
    reviews: 214,
    images: [photo('photo-1539008835657-9e8e9680c956'), photo('photo-1496747611176-843222e1e57c')],
    sizes: ['XS', 'S', 'M', 'L'],
    badge: 'Bestseller',
    description: 'A soft crepe wrap dress with a fluid skirt and tie waist. Made for long days that turn into dinner.',
    details: ['100% viscose crepe', 'Hand wash cold', 'Model wears size S'],
  },
  {
    id: 'p2',
    name: 'Cream Relaxed Shirt',
    brand: 'Atelier Nord',
    category: 'women',
    price: 64,
    rating: 4.6,
    reviews: 98,
    images: [photo('photo-1490481651871-ab68de25d43d'), photo('photo-1523381210434-271e8be1f52b')],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'Independent',
    description: 'An oversized poplin shirt with a clean collar. Layer it open over a tee or tuck it into trousers.',
    details: ['100% organic cotton', 'Machine wash 30°C', 'Relaxed fit'],
  },
  {
    id: 'p3',
    name: 'Structured Wool Coat',
    brand: 'Halden',
    category: 'outerwear',
    price: 240,
    compareAt: 290,
    rating: 4.9,
    reviews: 57,
    images: [photo('photo-1551488831-00ddcb6c6bd3'), photo('photo-1591047139829-d91aecb6caea')],
    sizes: ['S', 'M', 'L'],
    badge: 'Low stock',
    description: 'A tailored double-faced wool coat with a notched lapel. The one piece that works in every season.',
    details: ['70% wool, 30% cashmere', 'Dry clean only', 'Lined with recycled satin'],
  },
  {
    id: 'p4',
    name: 'Black Leather Jacket',
    brand: 'Kofi & Co',
    category: 'men',
    price: 86,
    rating: 4.7,
    reviews: 142,
    images: [photo('photo-1520975661595-6453be3f7070'), photo('photo-1551488831-00ddcb6c6bd3')],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'Independent',
    description: 'A supple leather jacket with a relaxed cut and a zip front. Wear it over a tee or a knit.',
    details: ['Genuine leather', 'Cotton lining', 'Regular fit'],
  },
  {
    id: 'p5',
    name: 'Navy Tailored Blazer',
    brand: 'Maison Vell',
    category: 'men',
    price: 189,
    rating: 4.8,
    reviews: 76,
    images: [photo('photo-1617137968427-85924c800a22'), photo('photo-1520975661595-6453be3f7070')],
    sizes: ['46', '48', '50', '52'],
    description: 'A single-breasted blazer with a soft shoulder. Cut to sit cleanly over a knit or open-collar shirt.',
    details: ['Wool blend', 'Half-lined', 'Slim fit'],
  },
  {
    id: 'p6',
    name: 'Red Low-Top Sneakers',
    brand: 'Studio Ondine',
    category: 'shoes',
    price: 128,
    compareAt: 160,
    rating: 4.5,
    reviews: 311,
    images: [photo('photo-1542291026-7eec264c27ff'), photo('photo-1544441893-675973e31985')],
    sizes: ['39', '40', '41', '42', '43', '44'],
    badge: 'Bestseller',
    description: 'Low-profile sneakers in red full-grain leather, with a cushioned insole and a gum rubber sole.',
    details: ['Full-grain leather', 'Rubber sole', 'Runs true to size'],
  },
  {
    id: 'p7',
    name: 'Rust Leather Tote',
    brand: 'Halden',
    category: 'bags',
    price: 210,
    rating: 4.9,
    reviews: 188,
    images: [photo('photo-1584917865442-de89df76afd3'), photo('photo-1525507119028-ed4c629a60a3')],
    sizes: ['One size'],
    badge: 'New',
    description: 'A structured tote in smooth rust calfskin, with a removable pouch and suede lining.',
    details: ['Calfskin leather', '38 × 28 × 14 cm', 'Interior zip pocket'],
  },
  {
    id: 'p8',
    name: 'Oat Crossbody',
    brand: 'Atelier Nord',
    category: 'bags',
    price: 92,
    rating: 4.4,
    reviews: 65,
    images: [photo('photo-1584917865442-de89df76afd3'), photo('photo-1551488831-00ddcb6c6bd3')],
    sizes: ['One size'],
    description: 'A compact crossbody in soft oat nubuck with an adjustable strap. Fits phone, keys and wallet.',
    details: ['Nubuck leather', 'Adjustable strap', 'Magnetic closure'],
  },
  {
    id: 'p9',
    name: 'Tortoise Sunglasses',
    brand: 'Studio Ondine',
    category: 'accessories',
    price: 58,
    rating: 4.6,
    reviews: 129,
    images: [photo('photo-1511499767150-a48a237f0083'), photo('photo-1469334031218-e382a71b716b')],
    sizes: ['One size'],
    description: 'Round acetate frames with UV400 lenses. A warm tortoise shade that suits everything.',
    details: ['Acetate frame', 'UV400 lenses', 'Includes case'],
  },
  {
    id: 'p10',
    name: 'Brushed Gold Hoops',
    brand: 'Kofi & Co',
    category: 'accessories',
    price: 44,
    rating: 4.7,
    reviews: 203,
    images: [photo('photo-1535632066927-ab7c9ab60908'), photo('photo-1573408301185-9146fe634ad0')],
    sizes: ['One size'],
    badge: 'Independent',
    description: 'Lightweight hoops in brushed 18k gold plated brass. Hypoallergenic posts.',
    details: ['18k gold plated brass', 'Nickel free', 'Diameter 4 cm'],
  },
  {
    id: 'p11',
    name: 'Suede Chelsea Boots',
    brand: 'Studio Ondine',
    category: 'shoes',
    price: 176,
    rating: 4.6,
    reviews: 84,
    images: [photo('photo-1520639888713-7851133b1ed0'), photo('photo-1525507119028-ed4c629a60a3')],
    sizes: ['39', '40', '41', '42', '43'],
    description: 'Chelsea boots in soft suede with a stacked leather heel and elastic side panels.',
    details: ['Suede upper', 'Leather sole', 'Half size up for wide feet'],
  },
  {
    id: 'p12',
    name: 'Tan Bomber Jacket',
    brand: 'Halden',
    category: 'outerwear',
    price: 148,
    compareAt: 180,
    rating: 4.7,
    reviews: 119,
    images: [photo('photo-1591047139829-d91aecb6caea'), photo('photo-1551488831-00ddcb6c6bd3')],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'A lightweight bomber in tan cotton, with ribbed cuffs and a zip front.',
    details: ['Cotton twill', 'Ribbed cuffs and hem', 'Regular fit'],
  },
];

export const looks: Look[] = [
  {
    id: 'look1',
    title: 'Quiet Evening',
    caption: 'Wrap dress, tote and gold hoops for dinner that runs late.',
    image: photo('photo-1515886657613-9f3515b0c78f'),
    hotspots: [
      { productId: 'p1', x: 48, y: 46 },
      { productId: 'p7', x: 30, y: 72 },
      { productId: 'p10', x: 58, y: 24 },
    ],
  },
  {
    id: 'look2',
    title: 'Weekend Layers',
    caption: 'A leather jacket and suede boots for city walks.',
    image: photo('photo-1483985988355-763728e1935b'),
    hotspots: [
      { productId: 'p4', x: 46, y: 40 },
      { productId: 'p11', x: 52, y: 84 },
    ],
  },
  {
    id: 'look3',
    title: 'Office, Softened',
    caption: 'A navy blazer and suede boots for a day that runs late.',
    image: photo('photo-1617137968427-85924c800a22'),
    hotspots: [
      { productId: 'p5', x: 50, y: 42 },
      { productId: 'p11', x: 56, y: 88 },
    ],
  },
];

export const trendingSearches = ['Wool coat', 'Leather tote', 'Linen', 'Sneakers', 'Gold hoops', 'Blazer'];

export const sortOptions = ['Recommended', 'Price: low to high', 'Price: high to low', 'Top rated'] as const;

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const productsByCategory = (categoryId: string) =>
  products.filter((p) => p.category === categoryId);
