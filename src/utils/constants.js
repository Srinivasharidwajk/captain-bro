export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  RIDER: 'rider'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  PREPARING: 'preparing',
  DISPATCHED: 'dispatched',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const CATEGORIES = [
  { id: 'chicken', name: 'Fresh Chicken', image: 'chicken-category.png' },
  { id: 'mutton', name: 'Premium Mutton', image: 'mutton-category.png' },
  { id: 'fish', name: "Fresh\nFishes", image: 'fish-category.png' },
  { id: 'prawns', name: 'Fresh Prawns', image: 'prawns-category.png' },
  { id: 'vegetables', name: "Fresh\nVegetables", image: 'onions.png' },
  { id: 'fruits', name: "Fresh\nFruits", image: 'fruits-category.png' },
  { id: 'grocery', name: 'Daily Grocery', image: 'cooking-oil.png' }
];

export const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Tender Chicken Curry Cut',
    category: 'chicken',
    price: 240,
    weight: '500g',
    description: 'Fresh, skinless, bone-in chicken curry cut sourced directly from local farms. Sized perfectly for authentic curries.',
    image: 'chicken-curry.png',
    inStock: true,
    rating: 4.8
  },
  {
    id: 'p2',
    name: 'Premium Goat Mutton (Bone-in)',
    category: 'mutton',
    price: 450,
    weight: '500g',
    description: 'Juicy and tender cuts of fresh goat meat, perfect for slow cooking, mutton biryani, and rich masalas.',
    image: 'mutton-curry.png',
    inStock: true,
    rating: 4.9
  },
  {
    id: 'p3',
    name: 'Fresh Koramanu (Murrel Fish)',
    category: 'fish',
    price: 380,
    weight: '500g',
    description: 'Highly sought-after local black murrel fish, cleaned, scaled, and sliced. Ready for frying or traditional tamarind curry.',
    image: 'koramanu-fish.png',
    inStock: true,
    rating: 4.7
  },
  {
    id: 'p4',
    name: 'Jumbo River Prawns',
    category: 'prawns',
    price: 490,
    weight: '500g',
    description: 'Indulgent, shell-off, de-veined jumbo prawns packed fresh with zero preservatives.',
    image: 'prawns.png',
    inStock: true,
    rating: 4.6
  },
  {
    id: 'p5',
    name: 'Organic Farm Onions',
    category: 'vegetables',
    price: 35,
    weight: '1kg',
    description: 'Crisp, flavorful farm-grown red onions. Handpicked and stored hygienically.',
    image: 'onions.png',
    inStock: true,
    rating: 4.7
  },
  {
    id: 'p6',
    name: 'Fresh Green Chillies',
    category: 'vegetables',
    price: 15,
    weight: '250g',
    description: 'Spicy and sharp green chillies sourced directly from local organic farms in Warangal.',
    image: 'green-chillies.png',
    inStock: true,
    rating: 4.6
  },
  {
    id: 'p7',
    name: 'Fresh Coriander Bunch',
    category: 'vegetables',
    price: 10,
    weight: '1 bunch',
    description: 'Aromatic and fresh green coriander leaves, harvested daily.',
    image: 'coriander.png',
    inStock: true,
    rating: 4.9
  },
  {
    id: 'p8',
    name: 'Organic Lemon Pack',
    category: 'vegetables',
    price: 20,
    weight: '4 pcs',
    description: 'Juicy, farm-fresh yellow lemons loaded with Vitamin C.',
    image: 'lemon.png',
    inStock: true,
    rating: 4.8
  },
  {
    id: 'p9',
    name: 'Premium Basmati Rice',
    category: 'grocery',
    price: 120,
    weight: '1kg',
    description: 'Long-grain, aromatic aged basmati rice, perfect for biryani and pulao.',
    image: 'basmati-rice.png',
    inStock: true,
    rating: 4.9
  },
  {
    id: 'p10',
    name: 'Pure Sunflower Cooking Oil',
    category: 'grocery',
    price: 145,
    weight: '1L',
    description: 'Healthy, low-absorbent refined sunflower oil for daily culinary needs.',
    image: 'cooking-oil.png',
    inStock: true,
    rating: 4.7
  },
  {
    id: 'p11',
    name: 'Fresh Thick Curd Cup',
    category: 'grocery',
    price: 30,
    weight: '500g',
    description: 'Thick, creamy, pasteurized curd made from high-quality milk.',
    image: 'curd.png',
    inStock: true,
    rating: 4.8
  },
  {
    id: 'p12',
    name: 'Guntur Red Chilli Powder',
    category: 'grocery',
    price: 60,
    weight: '250g',
    description: 'Authentic, bright red, hot chilli powder milled from selected Guntur chillies.',
    image: 'chilli-powder.png',
    inStock: true,
    rating: 4.9
  },
  {
    id: 'p13',
    name: 'Fresh Ginger Garlic Paste',
    category: 'grocery',
    price: 45,
    weight: '200g',
    description: 'Rich, aromatic paste made from fresh premium quality ginger and garlic.',
    image: 'ginger-garlic-paste.png',
    inStock: true,
    rating: 4.8
  },
  {
    id: 'p14',
    name: 'Fresh Mint Leaves Bunch',
    category: 'vegetables',
    price: 12,
    weight: '1 bunch',
    description: 'Refreshing and aromatic organically grown mint leaves, harvested fresh daily.',
    image: 'mint.png',
    inStock: true,
    rating: 4.8
  },
  {
    id: 'p15',
    name: 'Warangal Special Masala',
    category: 'grocery',
    price: 80,
    weight: '200g',
    description: 'A custom premium spice blend crafted for traditional local mutton and chicken dishes.',
    image: 'masala-powder.png',
    inStock: true,
    rating: 4.9
  },
  {
    id: 'p16',
    name: 'Whole Raw Masala Mix',
    category: 'grocery',
    price: 50,
    weight: '100g',
    description: 'Handpicked whole spices including cardamom, cinnamon, cloves, and bay leaves.',
    image: 'raw-masala-mix.png',
    inStock: true,
    rating: 4.7
  },
  {
    id: 'p17',
    name: 'Jai Sri Ram Sona Masuri Rice',
    category: 'grocery',
    price: 70,
    weight: '1kg',
    description: 'Premium lightweight and aromatic Sona Masuri rice, a staple for local meals.',
    image: 'jai-sri-ram-rice.png',
    inStock: true,
    rating: 4.8
  },
  {
    id: 'p18',
    name: 'Fresh Chicken Boneless',
    category: 'chicken',
    price: 320,
    weight: '500g',
    description: 'Tender, skinless, boneless chicken breast cuts, perfect for grilling, frying, and stir-fries.',
    image: 'chicken-boneless.png',
    inStock: true,
    rating: 4.9
  },
  {
    id: 'p19',
    name: 'Juicy Chicken Drumsticks',
    category: 'chicken',
    price: 260,
    weight: '500g',
    description: 'Fresh chicken drumsticks, cleaned and trimmed. Ideal for tandoori and baking.',
    image: 'chicken-drumstick.png',
    inStock: true,
    rating: 4.8
  },
  {
    id: 'p20',
    name: 'Crispy Chicken Wings',
    category: 'chicken',
    price: 180,
    weight: '500g',
    description: 'Fresh, meaty chicken wings with skin. Perfect for snacks, starters, and bar bites.',
    image: 'chicken-wings.png',
    inStock: true,
    rating: 4.7
  },
  {
    id: 'p21',
    name: 'Mutton Boneless Cuts',
    category: 'mutton',
    price: 580,
    weight: '500g',
    description: 'Fat-free, boneless chunks of tender goat meat, cut to perfection for dry fry or mutton tikka.',
    image: 'mutton-boneless.png',
    inStock: true,
    rating: 4.9
  },
  {
    id: 'p22',
    name: 'Rava Fish Fry Cut',
    category: 'fish',
    price: 290,
    weight: '500g',
    description: 'Cleaned, sliced fish pieces seasoned and ready for traditional rava fish fry.',
    image: 'rava-fish.png',
    inStock: true,
    rating: 4.6
  },
  {
    id: 'p23',
    name: 'Organic Sweet Bananas',
    category: 'fruits',
    price: 60,
    weight: '1 dozen',
    description: 'Perfectly ripe, sweet organic bananas sourced from local farmers in Telangana.',
    image: 'banana.png',
    inStock: true,
    rating: 4.8
  },
  {
    id: 'p24',
    name: 'Fresh Red Apple',
    category: 'fruits',
    price: 150,
    weight: '1kg',
    description: 'Fresh, juicy and crisp red apples imported from premium orchards.',
    image: 'apple.png',
    inStock: true,
    rating: 4.8
  },
  {
    id: 'p25',
    name: 'Sweet Ripe Mango',
    category: 'fruits',
    price: 180,
    weight: '1kg',
    description: 'Delicious, sweet and fiberless ripe mangoes harvested from local farms.',
    image: 'mango.jpg',
    inStock: true,
    rating: 4.9
  },
  {
    id: 'p26',
    name: 'Organic Papaya',
    category: 'fruits',
    price: 50,
    weight: '1 pc (800g)',
    description: 'Sweet and nutritious farm-fresh organic papaya.',
    image: 'papaya.png',
    inStock: true,
    rating: 4.7
  },
  {
    id: 'p27',
    name: 'Fresh Pomegranate',
    category: 'fruits',
    price: 160,
    weight: '1kg',
    description: 'Premium ruby-red pomegranates packed with antioxidants.',
    image: 'pomegranate.png',
    inStock: true,
    rating: 4.8
  },
  {
    id: 'p28',
    name: 'Fresh Seedless Grapes',
    category: 'fruits',
    price: 90,
    weight: '500g',
    description: 'Crisp, sweet, and seedless green and purple grapes.',
    image: 'grapes.png',
    inStock: true,
    rating: 4.6
  },
  {
    id: 'p29',
    name: 'Sweet Paan',
    category: 'grocery',
    price: 25,
    weight: '1 pc',
    description: 'Traditional sweet paan filled with gulkand, cherries, and sweet spices for a perfect dessert digestive.',
    image: 'sweet-paan.png',
    inStock: true,
    rating: 4.9
  },
  {
    id: 'p30',
    name: 'Gulab Jamun',
    category: 'grocery',
    price: 50,
    weight: '2 pcs',
    description: 'Soft, delicious, rose-syrup soaked sweet milk dumplings.',
    image: 'gulab-jamun.png',
    inStock: true,
    rating: 4.9
  },
  {
    id: 'p31',
    name: 'Sprite (750ml)',
    category: 'grocery',
    price: 45,
    weight: '750ml',
    description: 'Ice-cold refreshing lemon-lime carbonated beverage.',
    image: 'sprite.png',
    inStock: true,
    rating: 4.8
  },
  {
    id: 'p32',
    name: 'Thums Up (750ml)',
    category: 'grocery',
    price: 45,
    weight: '750ml',
    description: 'Strong carbonated cola drink with a spicy bite.',
    image: 'thums-up.png',
    inStock: true,
    rating: 4.8
  },
  {
    id: 'p33',
    name: 'Vanilla Ice Cream',
    category: 'grocery',
    price: 60,
    weight: '250g',
    description: 'Classic rich and creamy vanilla bean ice cream.',
    image: 'vanilla-ice-cream.png',
    inStock: true,
    rating: 4.8
  },
  {
    id: 'p34',
    name: 'Double Ka Meetha',
    category: 'grocery',
    price: 80,
    weight: '200g',
    description: 'Delectable bread pudding sweet soaked in cardamom syrup and garnished with dry fruits.',
    image: 'double-ka-meetha.png',
    inStock: true,
    rating: 4.9
  },
  {
    id: 'p35',
    name: 'Thick Curd',
    category: 'grocery',
    price: 30,
    weight: '500g',
    description: 'Thick, creamy and pasteurized fresh dairy curd.',
    image: 'thick-curd.png',
    inStock: true,
    rating: 4.8
  }
];
