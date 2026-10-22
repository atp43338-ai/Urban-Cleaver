const Category = require('../models/Category');

class AdminCategoryService {
  /**
   * Create a new base meat category
   */
  async createCategory({ name, description, image, isActive }) {
    if (!name || !name.trim()) {
      const error = new Error('Category name is required');
      error.statusCode = 400;
      throw error;
    }

    const trimmedName = name.trim();
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
    });

    if (existing) {
      const error = new Error('A category with this name already exists');
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
   * Get all categories with search and status filters
   */
  async getAllCategories({ search, status } = {}) {
    const query = {};

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const categories = await Category.find(query).sort({ createdAt: -1 });
    return {
      categories,
      total: categories.length,
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
      const duplicate = await Category.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
      });

      if (duplicate) {
        const error = new Error('Another category with this name already exists');
        error.statusCode = 409;
        throw error;
      }

      category.name = trimmedName;
    }

    if (description !== undefined) {
      category.description = description.trim();
    }

    if (image !== undefined && image !== null) {
      category.image = image.trim();
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

    await category.deleteOne();
    return { message: 'Category deleted successfully', id };
  }
}

module.exports = new AdminCategoryService();
