const mongoose = require('mongoose');
require('dotenv').config();
const PantryItem = require('./features/pantry/models/pantryItem.model');
const connectDB = require('./config/db');

const initialPantryItems = [
  {
    name: 'Peeled Sambar Shallots (Small Onions)',
    portionSize: 'Pre-portioned 200g vacuum pack for 1kg meat',
    category: 'produce',
    price: 35,
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    applicableRecipes: ['Beef Roast', 'Beef Fry', 'Curry', 'Mandi'],
    isPortionKit: true,
  },
  {
    name: 'Thenga Kothu (Fresh Coconut Slices)',
    portionSize: 'Pre-cut 75g thin slices for roasting',
    category: 'produce',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    applicableRecipes: ['Beef Roast', 'Beef Fry', 'Mutton Sukka'],
    isPortionKit: true,
  },
  {
    name: 'Artisanal Malabar Biryani Spice Jar',
    portionSize: '50g fresh stone-ground spice potli for 1kg meat',
    category: 'spices',
    price: 65,
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    applicableRecipes: ['Biryani', 'Mandi'],
    isPortionKit: true,
  },
  {
    name: 'A2 Vedic Bilona Cow Ghee',
    portionSize: '100ml glass jar portion',
    category: 'dairy_oils',
    price: 95,
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    applicableRecipes: ['Biryani', 'Mandi', 'Beef Roast'],
    isPortionKit: true,
  },
  {
    name: 'Aged Kaima / Jeerakasala Rice',
    portionSize: '1kg pack (1:1 ratio for 1kg meat)',
    category: 'essentials',
    price: 140,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    applicableRecipes: ['Biryani'],
    isPortionKit: true,
  },
  {
    name: 'Fresh Curry Leaves & Bird Eye Green Chillies',
    portionSize: '50g fresh farm harvest pouch',
    category: 'produce',
    price: 20,
    imageUrl: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    applicableRecipes: ['Beef Fry', 'Curry', 'Beef Roast', 'Pan Fry'],
    isPortionKit: true,
  },
];

async function seedPantry() {
  try {
    await connectDB();
    const count = await PantryItem.countDocuments();
    if (count === 0) {
      await PantryItem.insertMany(initialPantryItems);
      console.log(`[Pantry Seed] Successfully seeded ${initialPantryItems.length} pantry kit items.`);
    } else {
      console.log(`[Pantry Seed] Database already contains ${count} pantry kit items. Skipping seed.`);
    }
    process.exit(0);
  } catch (err) {
    console.error('[Pantry Seed Error]', err);
    process.exit(1);
  }
}

seedPantry();
