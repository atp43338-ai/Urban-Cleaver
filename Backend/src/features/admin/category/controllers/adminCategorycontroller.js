const adminCategoryService = require('../services/adminCategoryservices');

class AdminCategoryController {
  /**
   * POST /api/admin/categories
   */
  async createCategory(req, res, next) {
    try {
      const { name, description, isActive } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
      const parsedIsActive = isActive === 'false' || isActive === false ? false : true;

      const category = await adminCategoryService.createCategory({
        name,
        description,
        image,
        isActive: parsedIsActive,
      });

      return res.status(201).json({
        success: true,
        message: 'Category created successfully',
        category,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/admin/categories
   */
  async getAllCategories(req, res, next) {
    try {
      const { search, status } = req.query;
      const result = await adminCategoryService.getAllCategories({ search, status });

      return res.status(200).json({
        success: true,
        categories: result.categories,
        total: result.total,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/admin/categories/:id
   */
  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await adminCategoryService.getCategoryById(id);

      return res.status(200).json({
        success: true,
        category,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/admin/categories/:id
   */
  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, isActive } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

      let parsedIsActive;
      if (isActive !== undefined) {
        parsedIsActive = isActive === 'true' || isActive === true;
      }

      const category = await adminCategoryService.updateCategory(id, {
        name,
        description,
        image,
        isActive: parsedIsActive,
      });

      return res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        category,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/admin/categories/:id
   */
  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminCategoryService.deleteCategory(id);

      return res.status(200).json({
        success: true,
        message: result.message,
        id: result.id,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminCategoryController();
