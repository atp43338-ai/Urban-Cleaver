const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./features/admin/categories/category.model');
const Product = require('./features/admin/products/product.model');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for catalog seed...');

    // Categories
    const categoriesToSeed = [
      {
        name: 'Farm Chicken',
        description: 'Antibiotic-residue-free pasture birds with high protein density and tender grain.',
        image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80',
        isActive: true,
      },
      {
        name: 'Prime Mutton',
        description: 'Pasture-raised young goat & sheep cuts, aged 48 hours for rich marrow and tender texture.',
        image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
        isActive: true,
      },
      {
        name: 'Artisanal Steaks',
        description: 'Prime culinary cuts trimmed to chef specifications with uniform marbling.',
        image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
        isActive: true,
      },
      {
        name: 'Fresh Catch',
        description: 'Daily coastal landings cleaned, descaled, and sliced into pan-ready fillets.',
        image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80',
        isActive: true,
      },
    ];

    const categoryDocs = {};
    for (const cat of categoriesToSeed) {
      let doc = await Category.findOne({ name: cat.name });
      if (!doc) {
        doc = await Category.create(cat);
        console.log(`Created Category: ${doc.name}`);
      } else {
        doc.image = cat.image;
        doc.description = cat.description;
        await doc.save();
      }
      categoryDocs[cat.name] = doc._id;
    }

    // Products
    const productsToSeed = [
      {
        name: 'Country Chicken Dum Biryani Cut',
        category: categoryDocs['Farm Chicken'],
        description: 'Skinless, large bone-in pieces calibrated specifically for long-grain basmati dum cooking without drying out.',
        price: 389,
        grossWeight: '1000g',
        netWeight: '1000g Net Usable',
        cutTypes: ['Biryani Cut', 'Curry Cut'],
        images: ['https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80'],
        isStock: true,
      },
      {
        name: 'Tender Farm Chicken Curry Cut',
        category: categoryDocs['Farm Chicken'],
        description: 'Even 35g-40g bone-in cubes designed for rich slow-cooked gravies with zero bone splinters.',
        price: 329,
        grossWeight: '1000g',
        netWeight: '1000g Net Usable',
        cutTypes: ['Curry Cut'],
        images: ['https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80'],
        isStock: true,
      },
      {
        name: 'Chicken Breast Fillet (Boneless)',
        category: categoryDocs['Farm Chicken'],
        description: '100% skinless, boneless fillets trimmed clean of tendon cords. Ideal for pan-searing, keto bowls, and grills.',
        price: 349,
        grossWeight: '500g',
        netWeight: '500g Net Usable',
        cutTypes: ['Boneless', 'Steaks'],
        images: ['https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80'],
        isStock: true,
      },
      {
        name: 'Prime Mutton Rogan Josh Cut',
        category: categoryDocs['Prime Mutton'],
        description: 'A rich assortment of shank, shoulder, and rib cuts with rich bone marrow for Kashmiri stews.',
        price: 849,
        grossWeight: '1000g',
        netWeight: '1000g Net Usable',
        cutTypes: ['Curry Cut', 'Soup Bones'],
        images: ['https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80'],
        isStock: true,
      },
      {
        name: 'Hyderabadi Mutton Biryani Cut',
        category: categoryDocs['Prime Mutton'],
        description: 'Tender bone-in mutton chunks from young livestock, calibrated to retain moisture through 45-minute pot seal.',
        price: 899,
        grossWeight: '1000g',
        netWeight: '1000g Net Usable',
        cutTypes: ['Biryani Cut', 'Curry Cut'],
        images: ['https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'],
        isStock: true,
      },
      {
        name: 'Artisanal Mutton Keema (Fine Mince)',
        category: categoryDocs['Prime Mutton'],
        description: 'Double-minced lean leg meat with exactly 15% fat ratio for kebabs, samosas, and pav mince.',
        price: 499,
        grossWeight: '500g',
        netWeight: '500g Net Usable',
        cutTypes: ['Keema', 'Boneless'],
        images: ['https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80'],
        isStock: true,
      },
      {
        name: 'Prime Tenderloin Medallions',
        category: categoryDocs['Artisanal Steaks'],
        description: 'Center-cut tenderloin medallions cut thick for high-heat butter basting and maximum juiciness.',
        price: 649,
        grossWeight: '500g',
        netWeight: '500g Net Usable',
        cutTypes: ['Steaks', 'Boneless'],
        images: ['https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80'],
        isStock: true,
      },
      {
        name: 'Wild Atlantic Salmon Fillet',
        category: categoryDocs['Fresh Catch'],
        description: 'Skin-on, pin-bone removed Norwegian wild salmon portions, flash chilled at catch point.',
        price: 799,
        grossWeight: '400g',
        netWeight: '400g Net Usable',
        cutTypes: ['Boneless', 'Steaks'],
        images: ['https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80'],
        isStock: true,
      },
    ];

    for (const prod of productsToSeed) {
      const existing = await Product.findOne({ name: prod.name });
      if (!existing) {
        await Product.create(prod);
        console.log(`Created Product: ${prod.name}`);
      }
    }

    console.log('Seed completed successfully!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedData();
