const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Category = require('./features/admin/categories/category.model');
const Cut = require('./features/admin/cuts/cut.model');
const Product = require('./features/admin/products/product.model');

const BASE_CATEGORIES = [
  {
    name: 'Indian beef boneless',
    description: '100% net usable boneless Indian beef, trimmed of sinew and fat. Pan-ready for fry, roast, and keema.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'Indian mutton with bone',
    description: 'Pasture-grazed fresh Indian goat and sheep with marrow-rich bone cuts. Ideal for biryani and dum curries.',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'Indian mutton boneless',
    description: 'Tender prime boneless cuts from prime Indian sheep and goat. Zero waste, calibrated for kebabs and boti.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'Pakisthan beef boneless',
    description: 'Richly marbled prime imported Pakistani beef. Aged and sliced for melt-in-mouth nihari and pasantha.',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'Pakisthan beef with bone',
    description: 'Authentic shank and marrow cuts with rich collagen bones for deep slow-cooked gravies and saloona.',
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'Keniyan mutton with bone',
    description: 'Tender Kenyan highland goat cuts with sweet delicate marrow. Uniform pieces tailored for feasts and mandi.',
    image: 'https://images.unsplash.com/photo-1504973960431-1c467e159aa4?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
];

const CULINARY_CUTS = [
  {
    name: 'Beef Keema',
    sublabel: 'Fine / Coarse Mince',
    targetMeat: 'Beef',
    description: 'Double-minced 100% lean usable beef, perfectly balanced with 10% natural intramuscular fat.',
  },
  {
    name: 'Mutton keema',
    sublabel: 'Artisanal Ground Mutton',
    targetMeat: 'Mutton',
    description: 'Freshly minced prime goat and lamb for samosas, seekh kebabs, and rich keema matar.',
  },
  {
    name: 'Beef cube',
    sublabel: 'Uniform Gravy Cubes',
    targetMeat: 'Beef',
    description: 'Clean-cut 25-30g uniform beef cubes for traditional curries and slow stewing without shredding.',
  },
  {
    name: 'Beef kurma',
    sublabel: 'Slow Cook Tender Cuts',
    targetMeat: 'Beef',
    description: 'Tender cuts that absorb rich coconut and cashew gravies to butter-soft tenderness.',
  },
  {
    name: 'Biriyani cutting',
    sublabel: 'Calibrated 45-55g Dum Pieces',
    targetMeat: 'All',
    description: 'Large dum pieces that retain natural juices and rich bone marrow during lengthy dum cooking.',
  },
  {
    name: 'Saloona cutting',
    sublabel: 'Bone-in Stew Pieces',
    targetMeat: 'All',
    description: 'Traditional Gulf and Malabar style medium cuts that release rich savory broth.',
  },
  {
    name: 'Finger cutting (French fries)',
    sublabel: 'Strips for Deep & Pan Fry',
    targetMeat: 'Beef',
    description: 'Uniform batonnet meat strips designed for quick pan-searing and crispy spiced fry-ups.',
  },
  {
    name: 'Beef pasantha',
    sublabel: 'Flattened Minute Steaks',
    targetMeat: 'Beef',
    description: 'Thinly pounded tender beef escalopes, ideal for pan-grilling and rich Mughlai pasanda rolls.',
  },
  {
    name: 'Burger',
    sublabel: 'Coarse Patties / Buns Cut',
    targetMeat: 'All',
    description: 'Juicy 80/20 meat-to-fat grind engineered specifically for smash burgers and thick gourmet patties.',
  },
  {
    name: 'Kebab cutting',
    sublabel: 'Bite-Sized Boti Skewers',
    targetMeat: 'All',
    description: 'Slightly rectangular 20g boneless nuggets with maximum surface area for marination and charcoal grilling.',
  },
];

async function seedInventory() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is missing in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for inventory synchronization...');

    // 1. Clean obsolete categories (like "Fresh Catch", "Farm Chicken", "Test Butcher...")
    const validCategoryNames = BASE_CATEGORIES.map((c) => c.name);
    const obsoleteCats = await Category.find({ name: { $nin: validCategoryNames } });
    if (obsoleteCats.length > 0) {
      console.log(`Cleaning ${obsoleteCats.length} obsolete dummy categories:`, obsoleteCats.map((c) => c.name));
      await Category.deleteMany({ name: { $nin: validCategoryNames } });
    }

    // 2. Seed / Upsert the 6 Official Categories
    const categoryMap = {};
    for (const catData of BASE_CATEGORIES) {
      const slug = catData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      let catDoc = await Category.findOne({ name: catData.name });
      if (!catDoc) {
        catDoc = await Category.create({ ...catData, slug });
        console.log(`+ Created Category: ${catDoc.name}`);
      } else {
        catDoc.description = catData.description;
        catDoc.image = catData.image;
        catDoc.slug = slug;
        catDoc.isActive = true;
        await catDoc.save();
        console.log(`✓ Synchronized Category: ${catDoc.name}`);
      }
      categoryMap[catData.name] = catDoc._id;
    }

    // 3. Seed / Upsert the 10 Culinary Cuts
    for (const cutData of CULINARY_CUTS) {
      const slug = cutData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      let cutDoc = await Cut.findOne({ name: cutData.name });
      if (!cutDoc) {
        cutDoc = await Cut.create({ ...cutData, slug, isActive: true });
        console.log(`+ Created Cut: ${cutDoc.name}`);
      } else {
        cutDoc.sublabel = cutData.sublabel;
        cutDoc.targetMeat = cutData.targetMeat;
        cutDoc.description = cutData.description;
        cutDoc.slug = slug;
        cutDoc.isActive = true;
        await cutDoc.save();
        console.log(`✓ Synchronized Cut: ${cutDoc.name}`);
      }
    }

    // 4. Update or seed base products linking to the 6 categories & 10 cuts
    const existingProducts = await Product.find({});
    console.log(`Current products in DB: ${existingProducts.length}`);

    // If existing products point to deleted categories, reassign or seed fresh products
    const sampleProducts = [
      {
        name: 'Prime Kerala Beef Roast Cut',
        category: categoryMap['Indian beef boneless'],
        description: '100% boneless pan-ready Kerala beef cubes sliced for traditional coconut-fried beef roast.',
        price: 480,
        grossWeight: '1000g',
        netWeight: '1000g Net Usable',
        cutTypes: ['Beef cube', 'Beef Keema', 'Finger cutting (French fries)'],
        images: ['https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80'],
        isStock: true,
      },
      {
        name: 'Indian Goat Dum Biryani Cut',
        category: categoryMap['Indian mutton with bone'],
        description: 'Selected 45-55g bone-in mutton pieces. Slow-cooks in dum without drying out or shredding.',
        price: 890,
        grossWeight: '1000g',
        netWeight: '1000g Net Usable',
        cutTypes: ['Biriyani cutting', 'Saloona cutting', 'Mutton keema'],
        images: ['https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80'],
        isStock: true,
      },
      {
        name: 'Tender Indian Mutton Boti Cut',
        category: categoryMap['Indian mutton boneless'],
        description: 'Pure boneless mutton cubes trimmed from prime leg and shoulder. Excellent for charcoal skewers.',
        price: 980,
        grossWeight: '1000g',
        netWeight: '1000g Net Usable',
        cutTypes: ['Kebab cutting', 'Mutton keema', 'Burger'],
        images: ['https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'],
        isStock: true,
      },
      {
        name: 'Pakistani Nihari Shank Cut',
        category: categoryMap['Pakisthan beef with bone'],
        description: 'Authentic cross-cut shanks with dense bone marrow that melts into a velvety stew.',
        price: 590,
        grossWeight: '1000g',
        netWeight: '1000g Net Usable',
        cutTypes: ['Saloona cutting', 'Beef kurma', 'Biriyani cutting'],
        images: ['https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80'],
        isStock: true,
      },
      {
        name: 'Pakistani Boneless Tenderloin Pasantha',
        category: categoryMap['Pakisthan beef boneless'],
        description: 'Pounded thin minute cuts of aged Pakistani beef for pasanda rolls and grills.',
        price: 640,
        grossWeight: '1000g',
        netWeight: '1000g Net Usable',
        cutTypes: ['Beef pasantha', 'Burger', 'Beef Keema'],
        images: ['https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80'],
        isStock: true,
      },
      {
        name: 'Kenyan Highland Goat Mandi Cut',
        category: categoryMap['Keniyan mutton with bone'],
        description: 'Sweet, delicate Kenyan highland mutton pieces suited for Yemeni mandi and kabsa feasts.',
        price: 920,
        grossWeight: '1000g',
        netWeight: '1000g Net Usable',
        cutTypes: ['Biriyani cutting', 'Saloona cutting'],
        images: ['https://images.unsplash.com/photo-1504973960431-1c467e159aa4?auto=format&fit=crop&w=800&q=80'],
        isStock: true,
      },
    ];

    for (const prod of sampleProducts) {
      let doc = await Product.findOne({ name: prod.name });
      if (!doc) {
        doc = await Product.create(prod);
        console.log(`+ Created Product: ${doc.name}`);
      } else {
        doc.category = prod.category;
        doc.description = prod.description;
        doc.price = prod.price;
        doc.cutTypes = prod.cutTypes;
        doc.images = prod.images;
        doc.isStock = true;
        await doc.save();
        console.log(`✓ Synchronized Product: ${doc.name}`);
      }
    }

    console.log('--- Inventory Synchronization Complete ---');
    process.exit(0);
  } catch (err) {
    console.error('Inventory seeding failed:', err);
    process.exit(1);
  }
}

seedInventory();
