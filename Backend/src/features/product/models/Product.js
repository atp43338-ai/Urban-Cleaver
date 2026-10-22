const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters long'],
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    cutStyle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cut',
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    grossWeight: {
      type: String,
      required: [true, 'Gross weight is required (e.g., 1000g, 1kg)'],
      trim: true,
    },
    netWeight: {
      type: String,
      required: [true, 'Net usable weight is required (e.g., 750g - 800g)'],
      trim: true,
    },
    cutTypes: {
      type: [String],
      default: ['Curry Cut', 'Biryani Cut'],
    },
    images: {
      type: [String],
      default: [],
    },
    isStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, isStock: 1 });
productSchema.index({ cutStyle: 1 });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
