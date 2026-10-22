const mongoose = require('mongoose');
const Product = require('../models/Product');
const Cut = require('../models/Cut');
const Category = require('../../category/models/Category');

class AdminProductService {
  _normalizeCutTypes(cutTypes) {
    if (!cutTypes) return ['Curry Cut', 'Biryani Cut'];
    if (Array.isArray(cutTypes)) {
      return cutTypes.map((c) => String(c).trim()).filter(Boolean);
    }
    if (typeof cutTypes === 'string') {
      return cutTypes
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
    }
    return ['Curry Cut', 'Biryani Cut'];
  }

  _normalizeImages(images) {
    if (!images) return [];
    if (Array.isArray(images)) {
      return images.map((img) => String(img).trim()).filter(Boolean);
    }
    if (typeof images === 'string' && images.trim()) {
      return [images.trim()];
    }
    return [];
  }

  /**
   * Create Product
   */
  async createProduct({
    name,
    category,
    cutStyle,
    description,
    price,
    grossWeight,
    netWeight,
    cutTypes,
    images,
    isStock,
  }) {
    if (!name || !name.trim()) {
      const error = new Error('Product name is required');
      error.statusCode = 400;
      throw error;
    }

    if (!category) {
      const error = new Error('Category selection is required');
      error.statusCode = 400;
      throw error;
    }

    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      const error = new Error('Selected category does not exist');
      error.statusCode = 404;
      throw error;
    }

    if (price === undefined || price === null || isNaN(Number(price))) {
      const error = new Error('Valid numeric price is required');
      error.statusCode = 400;
      throw error;
    }

    if (!grossWeight || !grossWeight.trim()) {
      const error = new Error('Gross weight is required (e.g. 1000g)');
      error.statusCode = 400;
      throw error;
    }

    if (!netWeight || !netWeight.trim()) {
      const error = new Error('Net weight is required (e.g. 750g - 800g)');
      error.statusCode = 400;
      throw error;
    }

    const product = await Product.create({
      name: name.trim(),
      category: categoryDoc._id,
      cutStyle: mongoose.Types.ObjectId.isValid(cutStyle) ? cutStyle : undefined,
      description: description ? description.trim() : '',
      price: Number(price),
      grossWeight: grossWeight.trim(),
      netWeight: netWeight.trim(),
      cutTypes: this._normalizeCutTypes(cutTypes),
      images: this._normalizeImages(images),
      isStock: typeof isStock === 'boolean' ? isStock : true,
    });

    return await product.populate('category', 'name slug image isActive');
  }

  /**
   * Get all products with filters and category population
   */
  async getAllProducts({
    search,
    category,
    stockStatus,
    cutType,
    recipe,
    page = 1,
    limit = 100,
  } = {}) {
    const query = {};

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { cutTypes: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (category && category !== 'all') {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const cleanCat = String(category).toLowerCase().trim();
        const catDoc = await Category.findOne({
          $or: [
            { slug: cleanCat },
            { name: { $regex: new RegExp(`^${category.trim()}$`, 'i') } },
            { name: { $regex: cleanCat.replace(/-/g, ' '), $options: 'i' } },
          ],
        });
        if (catDoc) query.category = catDoc._id;
      }
    }

    if (stockStatus === 'inStock') {
      query.isStock = true;
    } else if (stockStatus === 'outOfStock') {
      query.isStock = false;
    }

    const cutParam = cutType || recipe;
    if (cutParam && cutParam !== 'all') {
      const cleanCut = String(cutParam).trim().replace(/-/g, ' ');
      query.$or = [
        { cutTypes: { $regex: new RegExp(cleanCut, 'i') } },
        { name: { $regex: new RegExp(cleanCut, 'i') } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 100);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug image isActive')
        .populate('cutStyle', 'name slug sublabel targetMeat')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    return {
      products,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    };
  }

  /**
   * Get single product by ID
   */
  async getProductById(id) {
    const product = await Product.findById(id)
      .populate('category', 'name slug image isActive')
      .populate('cutStyle', 'name slug sublabel targetMeat');

    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  /**
   * Update Product
   */
  async updateProduct(id, updateData) {
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    if (updateData.name) product.name = updateData.name.trim();

    if (updateData.category) {
      const catDoc = await Category.findById(updateData.category);
      if (!catDoc) {
        const error = new Error('Selected category does not exist');
        error.statusCode = 404;
        throw error;
      }
      product.category = catDoc._id;
    }

    if (updateData.cutStyle !== undefined) {
      product.cutStyle = mongoose.Types.ObjectId.isValid(updateData.cutStyle)
        ? updateData.cutStyle
        : undefined;
    }

    if (updateData.description !== undefined) {
      product.description = updateData.description.trim();
    }

    if (updateData.price !== undefined) {
      const p = Number(updateData.price);
      if (isNaN(p) || p < 0) {
        const error = new Error('Price must be a positive number');
        error.statusCode = 400;
        throw error;
      }
      product.price = p;
    }

    if (updateData.grossWeight) product.grossWeight = updateData.grossWeight.trim();
    if (updateData.netWeight) product.netWeight = updateData.netWeight.trim();

    if (updateData.cutTypes) {
      product.cutTypes = this._normalizeCutTypes(updateData.cutTypes);
    }

    if (updateData.images) {
      product.images = this._normalizeImages(updateData.images);
    }

    if (typeof updateData.isStock === 'boolean') {
      product.isStock = updateData.isStock;
    }

    await product.save();
    return await product.populate('category', 'name slug image isActive');
  }

  /**
   * Delete Product
   */
  async deleteProduct(id) {
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    await product.deleteOne();
    return { message: 'Product deleted successfully', id };
  }

  // --- CULINARY CUT OPERATIONS ("Add Cut" & Cut Management) ---

  async createCut({ name, sublabel, targetMeat, description, isActive }) {
    if (!name || !name.trim()) {
      const error = new Error('Cut name is required');
      error.statusCode = 400;
      throw error;
    }

    const cleanName = name.trim();
    const existing = await Cut.findOne({
      name: { $regex: new RegExp(`^${cleanName}$`, 'i') },
    });

    if (existing) {
      const error = new Error('A culinary cut with this name already exists');
      error.statusCode = 409;
      throw error;
    }

    const cut = await Cut.create({
      name: cleanName,
      sublabel: sublabel ? sublabel.trim() : '',
      targetMeat: targetMeat ? targetMeat.trim() : 'All',
      description: description ? description.trim() : '',
      isActive: typeof isActive === 'boolean' ? isActive : true,
    });

    return cut;
  }

  async getAllCuts({ search, targetMeat, status } = {}) {
    const query = {};

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { sublabel: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (targetMeat && targetMeat !== 'All') {
      query.$or = [
        { targetMeat: { $regex: targetMeat.trim(), $options: 'i' } },
        { targetMeat: 'All' },
      ];
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const cuts = await Cut.find(query).sort({ createdAt: -1 });
    return { cuts, total: cuts.length };
  }

  async getCutById(id) {
    const cut = await Cut.findById(id);
    if (!cut) {
      const error = new Error('Culinary cut not found');
      error.statusCode = 404;
      throw error;
    }
    return cut;
  }

  async updateCut(id, { name, sublabel, targetMeat, description, isActive }) {
    const cut = await Cut.findById(id);
    if (!cut) {
      const error = new Error('Culinary cut not found');
      error.statusCode = 404;
      throw error;
    }

    if (name && name.trim()) {
      const cleanName = name.trim();
      const duplicate = await Cut.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${cleanName}$`, 'i') },
      });

      if (duplicate) {
        const error = new Error('Another cut with this name already exists');
        error.statusCode = 409;
        throw error;
      }
      cut.name = cleanName;
    }

    if (sublabel !== undefined) cut.sublabel = sublabel.trim();
    if (targetMeat !== undefined) cut.targetMeat = targetMeat.trim();
    if (description !== undefined) cut.description = description.trim();
    if (typeof isActive === 'boolean') cut.isActive = isActive;

    await cut.save();
    return cut;
  }

  async deleteCut(id) {
    const cut = await Cut.findById(id);
    if (!cut) {
      const error = new Error('Culinary cut not found');
      error.statusCode = 404;
      throw error;
    }

    await cut.deleteOne();
    return { message: 'Culinary cut deleted successfully', id };
  }
}

module.exports = new AdminProductService();
