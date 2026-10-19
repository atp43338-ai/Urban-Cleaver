const mongoose = require('mongoose');

/**
 * PantryItem Schema:
 * Pre-portioned culinary add-ons (produce, spices, dairy & oils, essentials)
 * measured specifically for 1kg of meat and dynamically linked to recipe intentions.
 */
const pantryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pantry item name is required'],
      trim: true,
    },
    portionSize: {
      type: String,
      required: [true, 'Portion size is required'],
      trim: true,
      default: 'Pre-portioned for 1kg meat (~200g)',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['produce', 'spices', 'dairy_oils', 'essentials'],
        message: '{VALUE} is not a valid pantry category',
      },
      default: 'produce',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    applicableRecipes: {
      type: [String],
      default: ['Biryani', 'Curry'],
    },
    isPortionKit: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Performance indexes
pantryItemSchema.index({ name: 1, category: 1 });
pantryItemSchema.index({ applicableRecipes: 1 });
pantryItemSchema.index({ inStock: 1 });

module.exports = mongoose.model('PantryItem', pantryItemSchema);
