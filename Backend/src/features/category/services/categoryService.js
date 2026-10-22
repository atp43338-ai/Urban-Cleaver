const Category = require('../models/Category');

class CategoryService {
  /**
   * Create a new category
   */
  async createCategory({ name, description, image, isActive }) {
    if (!name || !name.trim()) {
      const error = new Error('Category name is required');
      error.statusCode = 400;
      throw error;
    }

    const trimmedName = name.trim();

    // Check if category name already exists (case-insensitive)
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
    });

    if (existing) {
      const error = new Error(`Category "${trimmedName}" already exists`);
      error.statusCode = 409;
      throw error;
    }

    const category = await Category.create({
      name: trimmedName,
      description: description ? description.trim() : '',
      image: image ? image.trim() : '',
      isActive: typeof isActive === 'boolean' ? isActive : true,
    });

    return category;
  }

  /**
   * Get all categories with search and filter
   */
  async getAllCategories({ search, status } = {}) {
    const query = {};

    if (search && search.trim()) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const categories = await Category.find(query).sort({ createdAt: -1 });
    const totalCount = await Category.countDocuments();
    const activeCount = await Category.countDocuments({ isActive: true });
    const inactiveCount = totalCount - activeCount;

    return {
      categories,
      summary: {
        total: totalCount,
        active: activeCount,
        inactive: inactiveCount,
      },
    };
  }

  /**
   * Get single category by ID
   */
  async getCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    return category;
  }

  /**
   * Update category
   */
  async updateCategory(id, { name, description, image, isActive }) {
    const category = await Category.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }

    if (name && name.trim()) {
      const trimmedName = name.trim();
      // If changing name, ensure uniqueness
      if (trimmedName.toLowerCase() !== category.name.toLowerCase()) {
        const existing = await Category.findOne({
          name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
          _id: { $ne: id },
        });
        if (existing) {
          const error = new Error(`Category "${trimmedName}" already exists`);
          error.statusCode = 409;
          throw error;
        }
      }
      category.name = trimmedName;
    }

    if (description !== undefined) {
      category.description = description ? description.trim() : '';
    }

    if (image !== undefined) {
      category.image = image ? image.trim() : '';
    }

    if (typeof isActive === 'boolean') {
      category.isActive = isActive;
    }

    await category.save();
    return category;
  }

  /**
   * Delete category
   */
  async deleteCategory(id) {
    const category = await Category.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }

    await Category.findByIdAndDelete(id);
    return { id, message: `Category "${category.name}" deleted successfully` };
  }
}

module.exports = new CategoryService();
