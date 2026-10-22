const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Cut = require('./features/admin/cuts/cut.model');

const BASE_CUTS = [
  {
    name: 'Beef Keema',
    slug: 'beef-keema',
    sublabel: 'Mince',
    targetMeat: 'Beef',
    description: 'Fine double-ground boneless beef with 85/15 lean ratio for juicy burger patties and samosas.',
  },
  {
    name: 'Mutton keema',
    slug: 'mutton-keema',
    sublabel: 'Mince',
    targetMeat: 'Mutton',
    description: 'Freshly minced deboned goat meat for seekh kebabs, keema matar, and delicate fillings.',
  },
  {
    name: 'Beef cube',
    slug: 'beef-cube',
    sublabel: 'Stew / Curry',
    targetMeat: 'Beef',
    description: 'Uniform 30g cubes cleanly trimmed of excess fat, calibrated for Kerala beef roast and curries.',
  },
  {
    name: 'Beef kurma',
    slug: 'beef-kurma',
    sublabel: 'Slow Cook',
    targetMeat: 'Beef',
    description: 'Tender beef cuts suitable for deep simmered, velvety Mughlai kurmas and gravies.',
  },
  {
    name: 'Biriyani cutting',
    slug: 'biriyani-cutting',
    sublabel: 'Dum Pieces',
    targetMeat: 'All',
    description: 'Generous 50g-60g pieces with marrow bones to lock in moisture through 45-minute dum cycles.',
  },
  {
    name: 'Saloona cutting',
    slug: 'saloona-cutting',
    sublabel: 'Arabic Stew',
    targetMeat: 'All',
    description: 'Collagen-rich cuts tailored for traditional Arabic tomato, root vegetable, and spice saloona.',
  },
  {
    name: 'Finger cutting (French fries)',
    slug: 'finger-cutting',
    sublabel: 'French Fries Cut',
    targetMeat: 'Beef',
    description: 'Uniform 8mm batonnet meat strips for quick high-heat deep crisp frying and stir fries.',
  },
  {
    name: 'Beef pasantha',
    slug: 'beef-pasantha',
    sublabel: 'Thin Cut',
    targetMeat: 'Beef',
    description: 'Hand-hammered paper-thin escalopes of top round designed for pan searing and rolls.',
  },
  {
    name: 'Burger',
    slug: 'burger',
    sublabel: 'Patty Cut',
    targetMeat: 'Beef',
    description: 'Coarse minced beef blend with natural fat marbling for smash burgers and thick gourmet patties.',
  },
  {
    name: 'Kebab cutting',
    slug: 'kebab-cutting',
    sublabel: 'Skewer / Boti',
    targetMeat: 'All',
    description: 'Square 25mm boti cubes trimmed clean of tendon cords for charcoal skewers and grills.',
  },
];

async function seedCuts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas...');

    let inserted = 0;
    let updated = 0;

    for (const cut of BASE_CUTS) {
      const allDocs = await Cut.find();
      let doc = allDocs.find(
        (d) => d.name.toLowerCase() === cut.name.toLowerCase() || d.slug === cut.slug
      );

      if (!doc) {
        await Cut.create({ ...cut, isActive: true });
        console.log(`Created Cut: ${cut.name}`);
        inserted++;
      } else {
        doc.name = cut.name;
        doc.sublabel = cut.sublabel;
        doc.targetMeat = cut.targetMeat;
        doc.description = cut.description;
        doc.isActive = true;
        await doc.save();
        console.log(`Updated Cut: ${cut.name}`);
        updated++;
      }
    }

    console.log(`Seed Cuts Finished! Inserted: ${inserted}, Updated: ${updated}`);
    process.exit(0);
  } catch (err) {
    console.error('Seed cuts error:', err);
    process.exit(1);
  }
}

seedCuts();
