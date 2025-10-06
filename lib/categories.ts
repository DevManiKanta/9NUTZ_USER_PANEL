// Category Data Structure for E-commerce Website
export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  image?: string;
  itemCount: number;
  popularItems?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  itemCount: number;
  featured: boolean;
  subcategories: SubCategory[];
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  subcategoryId: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  weight: string;
  brand: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  category: string;
}

// Main Categories Data
export const categories: Category[] = [
  {
    id: 'fruits-vegetables',
    name: 'Fruits & Vegetables',
    slug: 'fruits-vegetables',
    image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    description: 'Fresh, organic fruits and vegetables delivered daily',
    itemCount: 250,
    featured: true,
    subcategories: [
      {
        id: 'fresh-fruits',
        name: 'Fresh Fruits',
        slug: 'fresh-fruits',
        image: 'https://images.pexels.com/photos/2238309/pexels-photo-2238309.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
        itemCount: 85,
        popularItems: ['Bananas', 'Apples', 'Oranges', 'Mangoes', 'Grapes']
      },
      {
        id: 'fresh-vegetables',
        name: 'Fresh Vegetables',
        slug: 'fresh-vegetables',
        itemCount: 120,
        popularItems: ['Onions', 'Potatoes', 'Tomatoes', 'Carrots', 'Spinach']
      },
      {
        id: 'herbs-seasonings',
        name: 'Herbs & Seasonings',
        slug: 'herbs-seasonings',
        itemCount: 45,
        popularItems: ['Coriander', 'Mint', 'Ginger', 'Garlic', 'Green Chilies']
      }
    ]
  },
  {
    id: 'dairy-breakfast',
    name: 'Dairy, Bread & Eggs',
    slug: 'dairy-breakfast',
    image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    description: 'Fresh dairy products, bread, and farm eggs',
    itemCount: 180,
    featured: true,
    subcategories: [
      {
        id: 'milk-dairy',
        name: 'Milk & Dairy',
        slug: 'milk-dairy',
        itemCount: 65,
        popularItems: ['Milk', 'Paneer', 'Curd', 'Butter', 'Cheese']
      },
      {
        id: 'bread-bakery',
        name: 'Bread & Bakery',
        slug: 'bread-bakery',
        itemCount: 45,
        popularItems: ['Bread', 'Pav', 'Croissants', 'Muffins', 'Cookies']
      },
      {
        id: 'eggs-meat',
        name: 'Eggs & Meat',
        slug: 'eggs-meat',
        itemCount: 70,
        popularItems: ['Chicken Eggs', 'Chicken', 'Mutton', 'Fish', 'Prawns']
      }
    ]
  },
  {
    id: 'snacks-beverages',
    name: 'Snacks & Beverages',
    slug: 'snacks-beverages',
    image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    description: 'Tasty snacks and refreshing beverages',
    itemCount: 320,
    featured: true,
    subcategories: [
      {
        id: 'chips-namkeen',
        name: 'Chips & Namkeen',
        slug: 'chips-namkeen',
        itemCount: 95,
        popularItems: ['Lays', 'Kurkure', 'Haldiram Bhujia', 'Bikano', 'Uncle Chips']
      },
      {
        id: 'cold-drinks',
        name: 'Cold Drinks & Juices',
        slug: 'cold-drinks',
        itemCount: 85,
        popularItems: ['Coca Cola', 'Pepsi', 'Sprite', 'Real Juice', 'Frooti']
      },
      {
        id: 'biscuits-cookies',
        name: 'Biscuits & Cookies',
        slug: 'biscuits-cookies',
        itemCount: 78,
        popularItems: ['Parle-G', 'Oreo', 'Good Day', 'Britannia', 'Monaco']
      },
      {
        id: 'chocolates-sweets',
        name: 'Chocolates & Sweets',
        slug: 'chocolates-sweets',
        itemCount: 62,
        popularItems: ['Dairy Milk', 'KitKat', 'Ferrero Rocher', 'Rasgulla', 'Gulab Jamun']
      }
    ]
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    slug: 'personal-care',
    image: 'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    description: 'Health and beauty essentials',
    itemCount: 280,
    featured: false,
    subcategories: [
      {
        id: 'oral-care',
        name: 'Oral Care',
        slug: 'oral-care',
        itemCount: 45,
        popularItems: ['Colgate', 'Sensodyne', 'Listerine', 'Oral-B', 'Pepsodent']
      },
      {
        id: 'hair-care',
        name: 'Hair Care',
        slug: 'hair-care',
        itemCount: 68,
        popularItems: ['Head & Shoulders', 'Pantene', 'TRESemme', 'Dove', 'Loreal']
      },
      {
        id: 'skin-care',
        name: 'Skin Care',
        slug: 'skin-care',
        itemCount: 89,
        popularItems: ['Nivea', 'Lakme', 'Olay', 'Himalaya', 'Garnier']
      },
      {
        id: 'bath-body',
        name: 'Bath & Body',
        slug: 'bath-body',
        itemCount: 78,
        popularItems: ['Dettol', 'Dove Soap', 'Lux', 'Pears', 'Johnson Baby']
      }
    ]
  },
  {
    id: 'household-items',
    name: 'Household Items',
    slug: 'household-items',
    image: 'https://images.pexels.com/photos/4099123/pexels-photo-4099123.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    description: 'Essential items for your home',
    itemCount: 195,
    featured: false,
    subcategories: [
      {
        id: 'cleaning-supplies',
        name: 'Cleaning Supplies',
        slug: 'cleaning-supplies',
        itemCount: 65,
        popularItems: ['Surf Excel', 'Vim', 'Harpic', 'Colin', 'Lizol']
      },
      {
        id: 'kitchen-essentials',
        name: 'Kitchen Essentials',
        slug: 'kitchen-essentials',
        itemCount: 85,
        popularItems: ['Aluminum Foil', 'Tissue Paper', 'Garbage Bags', 'Steel Wool', 'Dishwash']
      },
      {
        id: 'home-decor',
        name: 'Home & Decor',
        slug: 'home-decor',
        itemCount: 45,
        popularItems: ['Air Fresheners', 'Candles', 'Storage Boxes', 'Curtains', 'Bedsheets']
      }
    ]
  },
  {
    id: 'tea-coffee',
    name: 'Tea, Coffee & Health',
    slug: 'tea-coffee',
    image: 'https://images.pexels.com/photos/324203/pexels-photo-324203.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    description: 'Premium beverages and health drinks',
    itemCount: 125,
    featured: false,
    subcategories: [
      {
        id: 'tea',
        name: 'Tea',
        slug: 'tea',
        itemCount: 35,
        popularItems: ['Tata Tea', 'Red Label', 'Lipton', 'Tetley', 'Green Tea']
      },
      {
        id: 'coffee',
        name: 'Coffee',
        slug: 'coffee',
        itemCount: 28,
        popularItems: ['Nescafe', 'Bru', 'Tata Coffee', 'Continental', 'Filter Coffee']
      },
      {
        id: 'health-drinks',
        name: 'Health Drinks',
        slug: 'health-drinks',
        itemCount: 62,
        popularItems: ['Horlicks', 'Bournvita', 'Complan', 'Boost', 'Proteinx']
      }
    ]
  },
  {
    id: 'instant-food',
    name: 'Instant & Frozen Food',
    slug: 'instant-food',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    description: 'Quick meals and frozen foods',
    itemCount: 140,
    featured: false,
    subcategories: [
      {
        id: 'instant-meals',
        name: 'Instant Meals',
        slug: 'instant-meals',
        itemCount: 45,
        popularItems: ['Maggi', 'Top Ramen', 'Yippee', 'Ready to Eat', 'Pasta']
      },
      {
        id: 'frozen-food',
        name: 'Frozen Food',
        slug: 'frozen-food',
        itemCount: 55,
        popularItems: ['Frozen Vegetables', 'Ice Cream', 'Frozen Paratha', 'Samosas', 'French Fries']
      },
      {
        id: 'breakfast-cereals',
        name: 'Breakfast & Cereals',
        slug: 'breakfast-cereals',
        itemCount: 40,
        popularItems: ['Cornflakes', 'Oats', 'Muesli', 'Chocos', 'Poha']
      }
    ]
  },
  {
    id: 'baby-care',
    name: 'Baby Care',
    slug: 'baby-care',
    image: 'https://images.pexels.com/photos/339616/pexels-photo-339616.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    description: 'Everything for your little ones',
    itemCount: 95,
    featured: false,
    subcategories: [
      {
        id: 'diapers',
        name: 'Diapers & Wipes',
        slug: 'diapers',
        itemCount: 35,
        popularItems: ['Pampers', 'Huggies', 'Mamy Poko', 'Baby Wipes', 'Cloth Diapers']
      },
      {
        id: 'baby-food',
        name: 'Baby Food',
        slug: 'baby-food',
        itemCount: 30,
        popularItems: ['Cerelac', 'Nestum', 'Baby Formula', 'Fruit Puree', 'Baby Biscuits']
      },
      {
        id: 'baby-care-products',
        name: 'Baby Care Products',
        slug: 'baby-care-products',
        itemCount: 30,
        popularItems: ['Johnson Baby Oil', 'Baby Lotion', 'Baby Shampoo', 'Baby Powder', 'Baby Soap']
      }
    ]
  },
  {
    id: 'paan-corner',
    name: 'Paan Corner',
    slug: 'paan-corner',
    image: 'https://images.pexels.com/photos/6039245/pexels-photo-6039245.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    description: 'Traditional paan and betel leaf varieties',
    itemCount: 45,
    featured: false,
    subcategories: [
      {
        id: 'sweet-paan',
        name: 'Sweet Paan',
        slug: 'sweet-paan',
        itemCount: 20,
        popularItems: ['Chocolate Paan', 'Coconut Paan', 'Gulkand Paan', 'Ice Cream Paan', 'Candy Paan']
      },
      {
        id: 'traditional-paan',
        name: 'Traditional Paan',
        slug: 'traditional-paan',
        itemCount: 15,
        popularItems: ['Banarasi Paan', 'Calcutta Paan', 'Meetha Paan', 'Zafrani Paan', 'Silver Paan']
      },
      {
        id: 'paan-masala',
        name: 'Paan Masala',
        slug: 'paan-masala',
        itemCount: 10,
        popularItems: ['Vimal Paan Masala', 'Pan Bahar', 'Rajnigandha', 'Tulsi Paan Masala', 'Kamla Pasand']
      }
    ]
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy & Wellness',
    slug: 'pharmacy',
    image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    description: 'Health and wellness products, medicines and supplements',
    itemCount: 150,
    featured: false,
    subcategories: [
      {
        id: 'medicines',
        name: 'Medicines',
        slug: 'medicines',
        itemCount: 60,
        popularItems: ['Pain Relief', 'Cold & Flu', 'Vitamins', 'First Aid', 'Antiseptics']
      },
      {
        id: 'health-supplements',
        name: 'Health Supplements',
        slug: 'health-supplements',
        itemCount: 45,
        popularItems: ['Multivitamins', 'Protein Powder', 'Omega-3', 'Calcium', 'Iron']
      },
      {
        id: 'wellness-products',
        name: 'Wellness Products',
        slug: 'wellness-products',
        itemCount: 45,
        popularItems: ['Blood Pressure Monitor', 'Thermometer', 'Bandages', 'Hand Sanitizer', 'Masks']
      }
    ]
  },
  {
    id: 'pet-care',
    name: 'Pet Care',
    slug: 'pet-care',
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    description: 'Everything for your pets - food, toys, and care essentials',
    itemCount: 85,
    featured: false,
    subcategories: [
      {
        id: 'pet-food',
        name: 'Pet Food',
        slug: 'pet-food',
        itemCount: 35,
        popularItems: ['Dog Food', 'Cat Food', 'Bird Food', 'Fish Food', 'Pet Treats']
      },
      {
        id: 'pet-accessories',
        name: 'Pet Accessories',
        slug: 'pet-accessories',
        itemCount: 30,
        popularItems: ['Collars', 'Leashes', 'Pet Beds', 'Toys', 'Carriers']
      },
      {
        id: 'pet-health',
        name: 'Pet Health',
        slug: 'pet-health',
        itemCount: 20,
        popularItems: ['Pet Shampoo', 'Vitamins', 'Flea Control', 'First Aid', 'Grooming']
      }
    ]
  }
];

// Sample Products Data
export const sampleProducts: Product[] = [
  {
    id: 'product-1',
    name: 'Fresh Bananas (Robusta)',
    categoryId: 'fruits-vegetables',
    subcategoryId: 'fresh-fruits',
    price: 48,
    originalPrice: 52,
    image: 'https://images.pexels.com/photos/2238309/pexels-photo-2238309.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    weight: '1 kg',
    brand: 'Fresho',
    inStock: true,
    rating: 4.3,
    reviews: 1250,
    category: 'Fruits & Vegetables'
  },
  {
    id: 'product-2',
    name: 'Amul Taaza Toned Milk',
    categoryId: 'dairy-breakfast',
    subcategoryId: 'milk-dairy',
    price: 29,
    originalPrice: 32,
    image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    weight: '500 ml',
    brand: 'Amul',
    inStock: true,
    rating: 4.5,
    reviews: 2100,
    category: 'Dairy, Bread & Eggs'
  }
  // Add more products as needed
];

// All products data (moved from FilterableProductGrid)
export const allProductsData = [
  // Fruits & Vegetables (10 items)
  {
    id: '101',
    name: "Fresh Red Bananas (Robusta)",
    price: 48,
    originalPrice: 52,
    discount: 8,
    image: "https://images.pexels.com/photos/2238309/pexels-photo-2238309.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "1 kg",
    category: "Fruits & Vegetables",
    categoryId: "fruits-vegetables",
    subcategoryId: "fresh-fruits",
    rating: 4.3,
    reviews: 1250,
    brand: "Fresho",
    inStock: true
  },
  {
    id: '102',
    name: "Red Delicious Apples",
    price: 120,
    originalPrice: 130,
    discount: 8,
    image: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "1 kg",
    category: "Fruits & Vegetables",
    categoryId: "fruits-vegetables",
    subcategoryId: "fresh-fruits",
    rating: 4.5,
    reviews: 890,
    brand: "Farm Fresh",
    inStock: true
  },
  {
    id: '103',
    name: "Fresh Carrots",
    price: 35,
    originalPrice: 40,
    discount: 12,
    image: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "500g",
    category: "Fruits & Vegetables",
    categoryId: "fruits-vegetables",
    subcategoryId: "fresh-vegetables",
    rating: 4.2,
    reviews: 670,
    brand: "Fresho",
    inStock: true
  },
  {
    id: '104',
    name: "Green Bell Peppers",
    price: 80,
    image: "https://images.pexels.com/photos/128420/pexels-photo-128420.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "500g",
    category: "Fruits & Vegetables",
    categoryId: "fruits-vegetables",
    subcategoryId: "fresh-vegetables",
    rating: 4.1,
    reviews: 320,
    brand: "Fresho",
    inStock: true
  },
  {
    id: '105',
    name: "Fresh Spinach",
    price: 20,
    image: "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "250g",
    category: "Fruits & Vegetables",
    categoryId: "fruits-vegetables",
    subcategoryId: "fresh-vegetables",
    rating: 4.0,
    reviews: 450,
    brand: "Fresho",
    inStock: true
  },
  {
    id: '106',
    name: "Fresh Tomatoes",
    price: 30,
    originalPrice: 35,
    discount: 14,
    image: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "500g",
    category: "Fruits & Vegetables",
    categoryId: "fruits-vegetables",
    subcategoryId: "fresh-vegetables",
    rating: 4.3,
    reviews: 820,
    brand: "Fresho",
    inStock: true
  },
  {
    id: '107',
    name: "Fresh Onions",
    price: 25,
    image: "https://images.pexels.com/photos/144248/onions-food-fruit-healthy-144248.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "1 kg",
    category: "Fruits & Vegetables",
    categoryId: "fruits-vegetables",
    subcategoryId: "fresh-vegetables",
    rating: 4.1,
    reviews: 690,
    brand: "Fresho",
    inStock: true
  },
  {
    id: '108',
    name: "Fresh Potatoes",
    price: 22,
    originalPrice: 26,
    discount: 15,
    image: "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "1 kg",
    category: "Fruits & Vegetables",
    categoryId: "fruits-vegetables",
    subcategoryId: "fresh-vegetables",
    rating: 4.2,
    reviews: 1120,
    brand: "Fresho",
    inStock: true
  },
  {
    id: '109',
    name: "Fresh Mangoes",
    price: 150,
    originalPrice: 170,
    discount: 12,
    image: "https://images.pexels.com/photos/918635/pexels-photo-918635.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "1 kg",
    category: "Fruits & Vegetables",
    categoryId: "fruits-vegetables",
    subcategoryId: "fresh-fruits",
    rating: 4.6,
    reviews: 750,
    brand: "Farm Fresh",
    inStock: true
  },
  {
    id: '110',
    name: "Fresh Oranges",
    price: 80,
    image: "https://images.pexels.com/photos/207085/pexels-photo-207085.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "1 kg",
    category: "Fruits & Vegetables",
    categoryId: "fruits-vegetables",
    subcategoryId: "fresh-fruits",
    rating: 4.4,
    reviews: 560,
    brand: "Farm Fresh",
    inStock: true
  },

  // Dairy, Bread & Eggs (8 items)
  {
    id: '201',
    name: "Amul Taaza Toned Milk",
    price: 29,
    originalPrice: 32,
    discount: 9,
    image: "https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "500 ml",
    category: "Dairy, Bread & Eggs",
    categoryId: "dairy-breakfast",
    subcategoryId: "milk-dairy",
    rating: 4.5,
    reviews: 2100,
    brand: "Amul",
    inStock: true
  },
  {
    id: '202',
    name: "Mother Dairy Paneer",
    price: 85,
    originalPrice: 95,
    discount: 11,
    image: "https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "200g",
    category: "Dairy, Bread & Eggs",
    categoryId: "dairy-breakfast",
    subcategoryId: "milk-dairy",
    rating: 4.4,
    reviews: 1560,
    brand: "Mother Dairy",
    inStock: true
  },
  {
    id: '203',
    name: "Fresh White Bread",
    price: 25,
    image: "https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "400g",
    category: "Dairy, Bread & Eggs",
    categoryId: "dairy-breakfast",
    subcategoryId: "bread-bakery",
    rating: 4.0,
    reviews: 780,
    brand: "Fresho",
    inStock: true
  },
  {
    id: '204',
    name: "Farm Fresh Chicken Eggs",
    price: 60,
    image: "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "6 pieces",
    category: "Dairy, Bread & Eggs",
    categoryId: "dairy-breakfast",
    subcategoryId: "eggs-meat",
    rating: 4.6,
    reviews: 950,
    brand: "Farm Fresh",
    inStock: true
  },
  {
    id: '205',
    name: "Amul Butter",
    price: 55,
    originalPrice: 60,
    discount: 8,
    image: "https://images.pexels.com/photos/4551832/pexels-photo-4551832.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "100g",
    category: "Dairy, Bread & Eggs",
    categoryId: "dairy-breakfast",
    subcategoryId: "milk-dairy",
    rating: 4.5,
    reviews: 1200,
    brand: "Amul",
    inStock: true
  },
  {
    id: '206',
    name: "Brown Bread",
    price: 35,
    image: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "400g",
    category: "Dairy, Bread & Eggs",
    categoryId: "dairy-breakfast",
    subcategoryId: "bread-bakery",
    rating: 4.2,
    reviews: 650,
    brand: "Harvest Gold",
    inStock: true
  },
  {
    id: '207',
    name: "Curd (Dahi)",
    price: 45,
    image: "https://images.pexels.com/photos/4871119/pexels-photo-4871119.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "400g",
    category: "Dairy, Bread & Eggs",
    categoryId: "dairy-breakfast",
    subcategoryId: "milk-dairy",
    rating: 4.3,
    reviews: 890,
    brand: "Amul",
    inStock: true
  },
  {
    id: '208',
    name: "Cheese Slices",
    price: 120,
    originalPrice: 130,
    discount: 8,
    image: "https://images.pexels.com/photos/4109979/pexels-photo-4109979.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "200g",
    category: "Dairy, Bread & Eggs",
    categoryId: "dairy-breakfast",
    subcategoryId: "milk-dairy",
    rating: 4.4,
    reviews: 420,
    brand: "Amul",
    inStock: true
  },

  // Snacks & Munchies (10 items)
  {
    id: '301',
    name: "Lays American Style Chips",
    price: 279,
    originalPrice: 300,
    discount: 7,
    image: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "158g",
    category: "Snacks & Munchies",
    categoryId: "snacks-beverages",
    subcategoryId: "chips-namkeen",
    rating: 4.3,
    reviews: 1890,
    brand: "Lays",
    inStock: true
  },
  {
    id: '302',
    name: "Oreo Original Cookies",
    price: 45,
    originalPrice: 50,
    discount: 10,
    image: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "120g",
    category: "Snacks & Munchies",
    categoryId: "snacks-beverages",
    subcategoryId: "biscuits-cookies",
    rating: 4.7,
    reviews: 2340,
    brand: "Oreo",
    inStock: true
  },
  {
    id: '303',
    name: "Kurkure Masala Munch",
    price: 20,
    originalPrice: 25,
    discount: 20,
    image: "https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "85g",
    category: "Snacks & Munchies",
    categoryId: "snacks-beverages",
    subcategoryId: "chips-namkeen",
    rating: 4.2,
    reviews: 1120,
    brand: "Kurkure",
    inStock: true
  },
  {
    id: '304',
    name: "Parle-G Biscuits",
    price: 15,
    image: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "200g",
    category: "Snacks & Munchies",
    categoryId: "snacks-beverages",
    subcategoryId: "biscuits-cookies",
    rating: 4.5,
    reviews: 3200,
    brand: "Parle",
    inStock: true
  },
  {
    id: '305',
    name: "Good Day Cookies",
    price: 30,
    originalPrice: 35,
    discount: 14,
    image: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "150g",
    category: "Snacks & Munchies",
    categoryId: "snacks-beverages",
    subcategoryId: "biscuits-cookies",
    rating: 4.3,
    reviews: 1540,
    brand: "Britannia",
    inStock: true
  },
  {
    id: '306',
    name: "Monaco Biscuits",
    price: 25,
    image: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "200g",
    category: "Snacks & Munchies",
    categoryId: "snacks-beverages",
    subcategoryId: "biscuits-cookies",
    rating: 4.1,
    reviews: 980,
    brand: "Parle",
    inStock: true
  },
  {
    id: '307',
    name: "Haldiram's Bhujia",
    price: 70,
    originalPrice: 80,
    discount: 12,
    image: "https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "200g",
    category: "Snacks & Munchies",
    categoryId: "snacks-beverages",
    subcategoryId: "chips-namkeen",
    rating: 4.6,
    reviews: 2100,
    brand: "Haldiram",
    inStock: true
  },
  {
    id: '308',
    name: "Uncle Chips",
    price: 20,
    image: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "60g",
    category: "Snacks & Munchies",
    categoryId: "snacks-beverages",
    subcategoryId: "chips-namkeen",
    rating: 4.2,
    reviews: 1350,
    brand: "Uncle Chips",
    inStock: true
  },
  {
    id: '309',
    name: "Dairy Milk Chocolate",
    price: 55,
    originalPrice: 60,
    discount: 8,
    image: "https://images.pexels.com/photos/918639/pexels-photo-918639.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "65g",
    category: "Snacks & Munchies",
    categoryId: "snacks-beverages",
    subcategoryId: "chocolates-sweets",
    rating: 4.7,
    reviews: 2850,
    brand: "Cadbury",
    inStock: true
  },
  {
    id: '310',
    name: "KitKat Chocolate",
    price: 40,
    image: "https://images.pexels.com/photos/918639/pexels-photo-918639.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "37.3g",
    category: "Snacks & Munchies",
    categoryId: "snacks-beverages",
    subcategoryId: "chocolates-sweets",
    rating: 4.5,
    reviews: 1890,
    brand: "Nestle",
    inStock: true
  },

  // Cold Drinks & Juices (6 items)
  {
    id: '401',
    name: "Coca Cola Original",
    price: 50,
    image: "https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "750 ml",
    category: "Cold Drinks & Juices",
    categoryId: "snacks-beverages",
    subcategoryId: "cold-drinks",
    rating: 4.4,
    reviews: 3200,
    brand: "Coca Cola",
    inStock: true
  },
  {
    id: '402',
    name: "Sprite Lemon Lime",
    price: 40,
    image: "https://images.pexels.com/photos/2775860/pexels-photo-2775860.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "600 ml",
    category: "Cold Drinks & Juices",
    categoryId: "snacks-beverages",
    subcategoryId: "cold-drinks",
    rating: 4.2,
    reviews: 1800,
    brand: "Sprite",
    inStock: true
  },
  {
    id: '403',
    name: "Real Mixed Fruit Juice",
    price: 85,
    originalPrice: 95,
    discount: 11,
    image: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
    weight: "1L",
    category: "Cold Drinks & Juices",
    categoryId: "snacks-beverages",
    subcategoryId: "cold-drinks",
    rating: 4.3,
    reviews: 980,
    brand: "Real",
    inStock: true
  }
];

// Search functionality
export const searchProducts = (query: string, categoryFilter?: string): Product[] => {
  let results = sampleProducts.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.brand.toLowerCase().includes(query.toLowerCase())
  );

  if (categoryFilter && categoryFilter !== 'all') {
    results = results.filter(product => product.categoryId === categoryFilter);
  }

  return results;
};

// Get category suggestions for autocomplete
export const getCategorySuggestions = (query: string): Category[] => {
  return categories.filter(category =>
    category.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);
};

// Get subcategory suggestions
export const getSubcategorySuggestions = (query: string): SubCategory[] => {
  const allSubcategories = categories.flatMap(cat => cat.subcategories);
  return allSubcategories.filter(subcat =>
    subcat.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);
};

// Utility functions
export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(cat => cat.id === id);
};

export const getSubcategoryById = (categoryId: string, subcategoryId: string): SubCategory | undefined => {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
};

export const getFeaturedCategories = (): Category[] => {
  return categories.filter(cat => cat.featured);
};

// Initial mock products with offer prices (moved from ProductContext)
export interface ContextProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  offerPrice?: number;
  categoryId: string;
  images: string[];
  stock: number;
  status: 'active' | 'inactive';
  weight: string;
  brand: string;
  rating: number;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}


// --- add this at the end of lib/categories.ts ---

// Convert sampleProducts into the ContextProduct shape used by ProductContext
export const initialProducts: ContextProduct[] = (sampleProducts || []).map((p) => ({
  id: String(p.id),
  name: p.name,
  description: (p as any).description ?? "",
  price: Number(p.price ?? 0),
  offerPrice: typeof p.originalPrice !== "undefined" ? Number(p.originalPrice) : undefined,
  categoryId: p.categoryId ?? "",
  images: p.image ? [p.image] : [],
  stock: Number((p as any).inStock ? 1 : 0),
  status: "active",
  weight: p.weight ?? "",
  brand: p.brand ?? "",
  rating: Number(p.rating ?? 0),
  reviews: Number(p.reviews ?? 0),
  createdAt: new Date(),
  updatedAt: new Date()
}));

// optional default export (keep if other code expects a default)
export default { categories, sampleProducts, allProductsData, initialProducts };

