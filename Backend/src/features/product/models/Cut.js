const mongoose = require('mongoose');

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

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
      unique: true,
      lowercase: true,
      trim: true,
    },
    sublabel: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'Sublabel cannot exceed 100 characters'],
    },
    targetMeat: {
      type: String,
      trim: true,
      default: 'All',
    },
    description: {
      type: String,
      trim: true,
      default: '',
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

cutSchema.pre('validate', function () {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name);
  }
});

cutSchema.index({ name: 'text', sublabel: 'text' });

module.exports = mongoose.models.Cut || mongoose.model('Cut', cutSchema);
