const categoryService = require('../admin/categories/category.service');
const productService = require('../admin/products/product.service');

class CatalogController {
  /**
   * GET /api/categories or /api/categories/public
   * Returns active categories for customer navigation
   */
  async getActiveCategories(req, res, next) {
    try {
      const { search } = req.query;
      const result = await categoryService.getAllCategories({
        search,
        status: 'active',
      });

      return res.status(200).json({
        success: true,
        categories: result.categories,
        total: result.categories.length,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/products or /api/products/public
   * Returns products with optional filtering by category, cutType, search, stockStatus
   */
  async getPublicProducts(req, res, next) {
    try {
      const { search, category, cutType, recipe, stockStatus, page, limit } = req.query;

      const result = await productService.getAllProducts({
        search,
        category,
        cutType,
        recipe,
        stockStatus,
        page: page || 1,
        limit: limit ? parseInt(limit, 10) : 50,
      });

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/products/:id
   * Fetch single product details by ID
   */
  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      return res.status(200).json({
        success: true,
        product,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CatalogController();
