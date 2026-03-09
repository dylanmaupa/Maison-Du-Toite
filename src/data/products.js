// ─── Product Data ───────────────────────────────────────────────────
export const PRODUCTS = [
  {
    id: 1,
    name: 'Noir Chocolate Cake',
    price: 68,
    category: 'Cakes',
    limited: true,
    tag: 'LIMITED',
    description:
      'A decadent three-layer dark chocolate ganache cake adorned with hand-applied gold leaf. Baked fresh to order in small batches, each one a singular expression of cocoa craft.',
    colors: ['#1A1A1A', '#7A3B0A', '#C8A96E'],
    images: [
      '/product_chocolate_cake.png',
      '/product_eclair.png',
    ],
    leadTime: null,
  },
  {
    id: 2,
    name: 'Macaron Collection',
    price: 48,
    category: 'Petits Fours',
    limited: false,
    tag: null,
    description:
      'A curated selection of twelve French macarons, presented in a lacquered gift box. Flavours rotate seasonally and are assembled by hand each morning. Requires 24-hour notice.',
    colors: ['#F2C4CE', '#C8A96E', '#1A1A1A'],
    images: [
      '/product_macarons.png',
      '/product_tart.png',
    ],
    leadTime: '24-HOUR NOTICE REQUIRED',
  },
  {
    id: 3,
    name: 'Artisan Croissants',
    price: 28,
    category: 'Viennoiserie',
    limited: true,
    tag: 'LIMITED',
    description:
      'Laminated with 84% European cultured butter over 72 hours of cold fermentation. Impossibly flaky, deeply golden, and available in limited quantities each morning.',
    colors: ['#C8A96E', '#7A5C44', '#1A1A1A'],
    images: [
      '/product_croissants.png',
      '/product_muffins.png',
    ],
    leadTime: null,
  },
  {
    id: 4,
    name: 'Raspberry Tart',
    price: 38,
    category: 'Tarts',
    limited: false,
    tag: null,
    description:
      'A crisp pâte sucrée shell filled with vanilla crème pâtissière, crowned with fresh raspberries and a dusting of edible gold. An exercise in balance and restraint.',
    colors: ['#C0392B', '#F5F0EB', '#C8A96E'],
    images: [
      '/product_tart.png',
      '/product_macarons.png',
    ],
    leadTime: null,
  },
  {
    id: 5,
    name: 'Blueberry Muffins',
    price: 22,
    category: 'Viennoiserie',
    limited: false,
    tag: null,
    description:
      'Domed and golden, studded with fresh blueberries and finished with a crunchy sugar crust. These are baked in the early hours so that each morning yields something worth rising for.',
    colors: ['#3D5A9E', '#C8A96E', '#FCFAF6'],
    images: [
      '/product_muffins.png',
      '/product_croissants.png',
    ],
    leadTime: null,
  },
  {
    id: 6,
    name: 'Salted Chocolate Cookies',
    price: 18,
    category: 'Petits Fours',
    limited: true,
    tag: 'LIMITED',
    description:
      'Thick, chewy, and studded with Valrhona dark chocolate chunks. Finished with fleur de sel from the Guérande marshes. A deliberately imperfect masterpiece.',
    colors: ['#1A1A1A', '#7A5C44', '#C8A96E'],
    images: [
      '/product_cookies.png',
      '/product_chocolate_cake.png',
    ],
    leadTime: null,
  },
  {
    id: 7,
    name: 'Chocolate Éclairs',
    price: 32,
    category: 'Petits Fours',
    limited: false,
    tag: null,
    description:
      'Classic choux pastry piped with light chocolate crème pâtissière and glazed with dark ganache. Each éclair is hand-finished with edible gold leaf and cocoa nibs.',
    colors: ['#1A1A1A', '#7A3B0A', '#C8A96E'],
    images: [
      '/product_eclair.png',
      '/product_tart.png',
    ],
    leadTime: null,
  },
  {
    id: 8,
    name: 'The Boulangerie Box',
    price: 95,
    category: 'Collections',
    limited: false,
    tag: null,
    description:
      'Our signature gift selection: two croissants, four macarons, two éclairs, and two cookies, nestled in a lacquered box tied with a silk ribbon. The gift of an entire morning.',
    colors: ['#C8A96E', '#1A1A1A', '#FCFAF6'],
    images: [
      '/bakery_hero.png',
      '/product_macarons.png',
    ],
    leadTime: null,
  },
];

export const CATEGORIES = ['All', 'Cakes', 'Tarts', 'Viennoiserie', 'Petits Fours', 'Collections'];
