// ─── Product Data ───────────────────────────────────────────────────
export const PRODUCTS = [
  {
    id: 1,
    name: 'The Silk Scarf',
    price: 250,
    category: 'Accessories',
    limited: true,
    tag: 'LIMITED',
    description:
      'Hand-painted in small batches using 100% mulberry silk. Each piece is unique, a wearable work of art that drapes with unparalleled fluidity.',
    colors: ['#C8A96E', '#1A1A1A', '#8B9BAA'],
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80',
      'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80',
    ],
    leadTime: null,
  },
  {
    id: 2,
    name: 'Velvet Lounge Chair',
    price: 1800,
    category: 'Home',
    limited: false,
    tag: null,
    description:
      'Upholstered in plush velvet with solid walnut legs. Bespoke comfort engineered for the discerning eye. Requires 4–6 weeks for production.',
    colors: ['#7A5C44', '#1A1A1A', '#FCFAF6'],
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    ],
    leadTime: '4–6 WEEK NOTICE REQUIRED',
  },
  {
    id: 3,
    name: 'Hand-stitched Tote',
    price: 950,
    category: 'Bags',
    limited: true,
    tag: 'LIMITED',
    description:
      'Full-grain leather, saddle-stitched by Parisian artisans. Structured yet supple, designed for a lifetime of refined use.',
    colors: ['#C8A96E', '#8B6914', '#1A1A1A'],
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'https://images.unsplash.com/photo-1591348272556-ae2e4d4c8fa1?w=800&q=80',
    ],
    leadTime: null,
  },
  {
    id: 4,
    name: 'Marble Essence Vase',
    price: 420,
    category: 'Home',
    limited: false,
    tag: null,
    description:
      'Hand-turned from a single block of Calacatta marble. No two are alike. A centrepiece that commands presence and whispers timelessness.',
    colors: ['#F5F0EB', '#C2B49A', '#1A1A1A'],
    images: [
      'https://images.unsplash.com/photo-1578500351865-d6c3706f46bc?w=800&q=80',
      'https://images.unsplash.com/photo-1612278675615-7b093b07772d?w=800&q=80',
    ],
    leadTime: null,
  },
  {
    id: 5,
    name: 'Cashmere Throw',
    price: 680,
    category: 'Home',
    limited: false,
    tag: null,
    description:
      'Woven from Grade-A Mongolian cashmere. Exceptionally soft and lightweight, with a herringbone weave that grows more beautiful over time.',
    colors: ['#C8A96E', '#FCFAF6', '#8B9BAA'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
    ],
    leadTime: null,
  },
  {
    id: 6,
    name: 'Linen Riviera Shirt',
    price: 320,
    category: 'Apparel',
    limited: true,
    tag: 'LIMITED',
    description:
      'Stonewashed French linen, cut generously for effortless elegance. A wardrobe anchor that moves between seasons and settings with ease.',
    colors: ['#FCFAF6', '#C8A96E', '#1A1A1A'],
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&q=80',
    ],
    leadTime: null,
  },
  {
    id: 7,
    name: 'Obsidian Candle Set',
    price: 185,
    category: 'Accessories',
    limited: false,
    tag: null,
    description:
      'Three hand-poured soy candles in matte black ceramic vessels. Fragrance notes of oud, amber and sandalwood. Burn time 60+ hours each.',
    colors: ['#1A1A1A', '#333333'],
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
      'https://images.unsplash.com/photo-1608181831718-71c9f0bf2584?w=800&q=80',
    ],
    leadTime: null,
  },
  {
    id: 8,
    name: 'Structured Leather Wallet',
    price: 290,
    category: 'Accessories',
    limited: false,
    tag: null,
    description:
      'Eight card slots, one bill compartment, zero compromise. Vegetable-tanned calfskin that develops a unique patina unique to its owner.',
    colors: ['#7A5C44', '#1A1A1A', '#C8A96E'],
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    ],
    leadTime: null,
  },
];

export const CATEGORIES = ['All', 'Accessories', 'Apparel', 'Bags', 'Home'];
