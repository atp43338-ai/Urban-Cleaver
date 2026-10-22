const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Category = require('./features/admin/categories/category.model');
const Product = require('./features/admin/products/product.model');

const BASE_CATEGORIES = [
  {
    name: 'Indian beef boneless',
    description: '100% net usable boneless Indian beef, trimmed of sinew and excess fat. Pan-ready for fry, roast, and keema.',
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
    description: 'Tender prime boneless cuts from young Indian livestock. Zero waste, calibrated for kebabs, tikka, and boti.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'Pakisthan beef boneless',
    description: 'Richly marbled prime Pakistani beef. Aged and precision-sliced for melt-in-mouth nihari, pasantha, and fry.',
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
    description: 'Tender Kenyan highland goat cuts with sweet delicate marrow. Uniform pieces tailored for mandi and feasts.',
    image: 'https://images.unsplash.com/photo-1504973960431-1c467e159aa4?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
];

const SEED_PRODUCTS = [
  // 1. Indian beef boneless
  {
    catName: 'Indian beef boneless',
    name: 'Indian Boneless Beef Keema (Double Minced)',
    description: 'Prime boneless beef shoulder minced twice to 85/15 lean ratio for juicy burger patties, kebabs, and samosa fillings.',
    price: 360,
    grossWeight: '1000g',
    netWeight: '1000g Net Usable',
    cutTypes: ['Beef Keema', 'Burger'],
    images: ['https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80'],
  },
  {
    catName: 'Indian beef boneless',
    name: 'Kerala Style Beef Cube Cut (Boneless)',
    description: 'Even 30g cubes cleanly trimmed of fat and silver skin, tailored for traditional Kerala beef roast and slow dry fry.',
    price: 390,
    grossWeight: '1000g',
    netWeight: '1000g Net Usable',
    cutTypes: ['Beef cube', 'Beef kurma'],
    images: ['https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80'],
  },
  {
    catName: 'Indian beef boneless',
    name: 'Thin Sliced Beef Pasantha Steaks',
    description: 'Hand-hammered paper-thin escalopes of tender beef topside designed for quick pan searing and royal pasantha gravy.',
    price: 420,
    grossWeight: '500g',
    netWeight: '500g Net Usable',
    cutTypes: ['Beef pasantha', 'Kebab cutting'],
    images: ['https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80'],
  },
  {
    catName: 'Indian beef boneless',
    name: 'Crispy Beef Finger Cutting (French Fries Style)',
    description: 'Thin batonnet strips of uniform 8mm width, perfect for deep crisp beef chilli fry and Indo-Chinese stir fries.',
    price: 380,
    grossWeight: '500g',
    netWeight: '500g Net Usable',
    cutTypes: ['Finger cutting (French fries)'],
    images: ['https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'],
  },
  {
    catName: 'Indian beef boneless',
    name: 'Gourmet Beef Burger Patties Blend',
    description: 'Coarse minced boneless beef with natural intermuscular fat cap for maximum sizzle, crust, and flavor retention.',
    price: 370,
    grossWeight: '500g',
    netWeight: '500g Net Usable',
    cutTypes: ['Burger', 'Beef Keema'],
    images: ['https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80'],
  },

  // 2. Indian mutton with bone
  {
    catName: 'Indian mutton with bone',
    name: 'Hyderabadi Dum Biriyani Mutton Cut',
    description: 'Calibrated 50g cuts with shoulder bone and ribs to lock in juices through long sealed dum cooking cycles.',
    price: 780,
    grossWeight: '1000g',
    netWeight: '1000g Net Usable',
    cutTypes: ['Biriyani cutting', 'Saloona cutting'],
    images: ['https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80'],
  },
  {
    catName: 'Indian mutton with bone',
    name: 'Slow-Cooked Mutton Saloona Cut',
    description: 'Tender bone-in mutton pieces selected for Arabic tomato and vegetable saloona with deep bone marrow essence.',
    price: 740,
    grossWeight: '1000g',
    netWeight: '1000g Net Usable',
    cutTypes: ['Saloona cutting', 'Beef kurma'],
    images: ['https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'],
  },
  {
    catName: 'Indian mutton with bone',
    name: 'Traditional Indian Mutton Curry Cut',
    description: 'Balanced mix of leg, shoulder, and neck cuts with clean bone edges. No splinters, maximum gelatinous body.',
    price: 720,
    grossWeight: '1000g',
    netWeight: '1000g Net Usable',
    cutTypes: ['Biriyani cutting', 'Beef kurma'],
    images: ['https://images.unsplash.com/photo-1504973960431-1c467e159aa4?auto=format&fit=crop&w=800&q=80'],
  },

  // 3. Indian mutton boneless
  {
    catName: 'Indian mutton boneless',
    name: 'Fine Hand-Pounded Mutton Keema',
    description: '100% deboned pasture goat meat with strictly 10% fat content, ideal for seekh kebabs, keema matar, and samosas.',
    price: 880,
    grossWeight: '500g',
    netWeight: '500g Net Usable',
    cutTypes: ['Mutton keema', 'Kebab cutting'],
    images: ['https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80'],
  },
  {
    catName: 'Indian mutton boneless',
    name: 'Artisanal Mutton Kebab Boti Cuts',
    description: 'Tender boneless mutton cubes from leg muscle, trimmed to uniform 25mm dimensions for charcoal skewers and grills.',
    price: 920,
    grossWeight: '500g',
    netWeight: '500g Net Usable',
    cutTypes: ['Kebab cutting', 'Beef cube'],
    images: ['https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80'],
  },
  {
    catName: 'Indian mutton boneless',
    name: 'Boneless Mutton Kurma Cubes',
    description: 'Velvety boneless goat cuts calibrated for rich white cashew kurmas and Mughlai delicacies.',
    price: 890,
    grossWeight: '500g',
    netWeight: '500g Net Usable',
    cutTypes: ['Beef kurma', 'Beef cube'],
    images: ['https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80'],
  },

  // 4. Pakisthan beef boneless
  {
    catName: 'Pakisthan beef boneless',
    name: 'Lahori Nihari Boneless Beef Cuts',
    description: 'Aged boneless prime beef cuts with rich gelatinous collagen layers that dissolve into silky richness during overnight simmering.',
    price: 490,
    grossWeight: '1000g',
    netWeight: '1000g Net Usable',
    cutTypes: ['Beef cube', 'Beef kurma'],
    images: ['https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80'],
  },
  {
    catName: 'Pakisthan beef boneless',
    name: 'Prime Pakistani Beef Pasantha Fillets',
    description: 'Hand-flattened Pakistani beef slices with tender grain, prepared for traditional spicy Mughlai pasantha roast.',
    price: 520,
    grossWeight: '500g',
    netWeight: '500g Net Usable',
    cutTypes: ['Beef pasantha', 'Kebab cutting'],
    images: ['https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'],
  },
  {
    catName: 'Pakisthan beef boneless',
    name: 'Smoked Pakistani Chapli Beef Keema',
    description: 'Specially ground Pakistani beef with authentic fat ratio and coarse texture tailored for Peshawar chapli kebabs.',
    price: 460,
    grossWeight: '1000g',
    netWeight: '1000g Net Usable',
    cutTypes: ['Beef Keema', 'Burger'],
    images: ['https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80'],
  },

  // 5. Pakisthan beef with bone
  {
    catName: 'Pakisthan beef with bone',
    name: 'Authentic Nalli Nihari Shank with Marrow Bone',
    description: 'Center-cut Pakistani beef shanks with pipe marrow bone intact. The pinnacle cut for royal Awadhi and Lahori gravies.',
    price: 540,
    grossWeight: '1000g',
    netWeight: '1000g Net Usable',
    cutTypes: ['Biriyani cutting', 'Saloona cutting'],
    images: ['https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80'],
  },
  {
    catName: 'Pakisthan beef with bone',
    name: 'Karachi Biryani Beef Cut (Bone-In)',
    description: 'Succulent Pakistani bone-in beef chunks with light fat marbling, retaining maximum moisture during rice steaming.',
    price: 480,
    grossWeight: '1000g',
    netWeight: '1000g Net Usable',
    cutTypes: ['Biriyani cutting', 'Saloona cutting'],
    images: ['https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80'],
  },
  {
    catName: 'Pakisthan beef with bone',
    name: 'Pakistani Beef Saloona Pot Cuts',
    description: 'Rich bone-in stew cuts packed with collagen and natural beef flavor for slow simmering with vegetables and broth.',
    price: 460,
    grossWeight: '1000g',
    netWeight: '1000g Net Usable',
    cutTypes: ['Saloona cutting', 'Beef kurma'],
    images: ['https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80'],
  },

  // 6. Keniyan mutton with bone
  {
    catName: 'Keniyan mutton with bone',
    name: 'Kenyan Mandi Prime Cuts (Bone-In)',
    description: 'Sweet, delicate young Kenyan highland goat meat. Uniformly cut for Arabic smoked Mandi and Bukhari rice.',
    price: 760,
    grossWeight: '1000g',
    netWeight: '1000g Net Usable',
    cutTypes: ['Biriyani cutting', 'Saloona cutting'],
    images: ['https://images.unsplash.com/photo-1504973960431-1c467e159aa4?auto=format&fit=crop&w=800&q=80'],
  },
  {
    catName: 'Keniyan mutton with bone',
    name: 'Highland Kenyan Goat Stew / Saloona Cut',
    description: 'Tender rib and loin chops with clean bone edges, creating an aromatic clear broth and melting tender bites.',
    price: 730,
    grossWeight: '1000g',
    netWeight: '1000g Net Usable',
    cutTypes: ['Saloona cutting', 'Beef kurma'],
    images: ['https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80'],
  },
  {
    catName: 'Keniyan mutton with bone',
    name: 'Kenyan Goat Biriyani Feast Pieces',
    description: 'Generous bone-in pieces aged in sterile cold chain, ready for family gatherings and festive preparations.',
    price: 780,
    grossWeight: '1000g',
    netWeight: '1000g Net Usable',
    cutTypes: ['Biriyani cutting', 'Kebab cutting'],
    images: ['https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas...');

    // 1. Ensure all 6 base categories exist
    const categoryMap = {};
    for (const cat of BASE_CATEGORIES) {
      let doc = await Category.findOne({ name: cat.name });
      if (!doc) {
        doc = await Category.create(cat);
        console.log(`Created Category: ${doc.name}`);
      } else {
        doc.description = cat.description;
        doc.image = cat.image;
        doc.isActive = true;
        await doc.save();
        console.log(`Updated Category: ${doc.name}`);
      }
      categoryMap[cat.name] = doc._id;
    }

    // 2. Clear old products to avoid duplicates and seed clean inventory
    const deleted = await Product.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing products.`);

    // 3. Insert fresh inventory
    const productsToInsert = SEED_PRODUCTS.map((p) => {
      const catId = categoryMap[p.catName];
      if (!catId) throw new Error(`Missing category ID for ${p.catName}`);
      return {
        name: p.name,
        category: catId,
        description: p.description,
        price: p.price,
        grossWeight: p.grossWeight,
        netWeight: p.netWeight,
        cutTypes: p.cutTypes,
        images: p.images,
        isStock: true,
      };
    });

    const inserted = await Product.insertMany(productsToInsert);
    console.log(`Successfully seeded ${inserted.length} artisanal products across all 6 base categories!`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
