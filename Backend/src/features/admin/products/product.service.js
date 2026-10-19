const Product = require('./product.model');
const Category = require('../categories/category.model');

class ProductService {
  /**
   * Helper to normalize cut types array
   */
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

  /**
   * Helper to normalize images array
   */
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
   * Create a new product
   */
  async createProduct({
    name,
    category,
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

    // Verify category exists
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
      description: description ? description.trim() : '',
      price: Number(price),
      grossWeight: grossWeight.trim(),
      netWeight: netWeight.trim(),
      cutTypes: this._normalizeCutTypes(cutTypes),
      images: this._normalizeImages(images),
      isStock: typeof isStock === 'boolean' ? isStock : true,
    });

    return await product.populate('category', 'name isActive');
  }

  /**
   * Get all products with filters, category population, and pagination
   */
  async getAllProducts({
    search,
    category,
    stockStatus,
    page = 1,
    limit = 10,
  } = {}) {
    const query = {};

    if (search && search.trim()) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (stockStatus === 'inStock') {
      query.isStock = true;
    } else if (stockStatus === 'outOfStock') {
      query.isStock = false;
    }

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (parsedPage - 1) * parsedLimit;

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .populate('category', 'name isActive')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit),
      Product.countDocuments(query),
    ]);

    const [totalProducts, inStockCount] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isStock: true }),
    ]);

    return {
      products,
      pagination: {
        totalProducts: totalCount,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(totalCount / parsedLimit) || 1,
        hasNextPage: skip + products.length < totalCount,
        hasPrevPage: parsedPage > 1,
      },
      summary: {
        total: totalProducts,
        inStock: inStockCount,
        outOfStock: totalProducts - inStockCount,
      },
    };
  }

  /**
   * Get single product by ID
   */
  async getProductById(id) {
    const product = await Product.findById(id).populate('category', 'name isActive');
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  /**
   * Update product
   */
  async updateProduct(id, updateData) {
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    if (updateData.name && updateData.name.trim()) {
      product.name = updateData.name.trim();
    }

    if (updateData.category) {
      const catExists = await Category.findById(updateData.category);
      if (!catExists) {
        const error = new Error('Selected category does not exist');
        error.statusCode = 404;
        throw error;
      }
      product.category = catExists._id;
    }

    if (updateData.description !== undefined) {
      product.description = updateData.description.trim();
    }

    if (updateData.price !== undefined && !isNaN(Number(updateData.price))) {
      product.price = Number(updateData.price);
    }

    if (updateData.grossWeight && updateData.grossWeight.trim()) {
      product.grossWeight = updateData.grossWeight.trim();
    }

    if (updateData.netWeight && updateData.netWeight.trim()) {
      product.netWeight = updateData.netWeight.trim();
    }

    if (updateData.cutTypes !== undefined) {
      product.cutTypes = this._normalizeCutTypes(updateData.cutTypes);
    }

    if (updateData.images !== undefined) {
      product.images = this._normalizeImages(updateData.images);
    }

    if (typeof updateData.isStock === 'boolean') {
      product.isStock = updateData.isStock;
    }

    await product.save();
    return await product.populate('category', 'name isActive');
  }

  /**
   * Delete product
   */
  async deleteProduct(id) {
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    await Product.findByIdAndDelete(id);
    return { id, message: `Product "${product.name}" deleted successfully` };
  }
}

module.exports = new ProductService();
