const mongoose = require('mongoose');

const cutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Cut name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Cut name must be at least 2 characters long'],
      maxlength: [80, 'Cut name cannot exceed 80 characters'],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    sublabel: {
      type: String,
      trim: true,
      default: '',
      maxlength: [120, 'Sublabel cannot exceed 120 characters'],
    },
    targetMeat: {
      type: String,
      trim: true,
      default: 'All', // e.g., 'Beef', 'Mutton', 'All'
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Slug generation before save
cutSchema.pre('save', function () {
  if (this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
});

cutSchema.index({ name: 'text' });

const Cut = mongoose.model('Cut', cutSchema);

module.exports = Cut;
