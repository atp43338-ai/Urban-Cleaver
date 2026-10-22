const categoryService = require('../services/categoryService');

class CategoryController {
  /**
   * POST /api/admin/categories
   */
  async createCategory(req, res, next) {
    try {
      const { name, description, isActive } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
      const parsedIsActive = isActive === 'false' || isActive === false ? false : true;

      const category = await categoryService.createCategory({
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
      const result = await categoryService.getAllCategories({ search, status });

      return res.status(200).json({
        success: true,
        ...result,
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
      const category = await categoryService.getCategoryById(id);

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
      const updatePayload = {};

      if (name !== undefined) updatePayload.name = name;
      if (description !== undefined) updatePayload.description = description;
      if (isActive !== undefined) {
        updatePayload.isActive = isActive === 'false' || isActive === false ? false : true;
      }
      if (req.file) {
        updatePayload.image = `/uploads/${req.file.filename}`;
      } else if (req.body.image !== undefined) {
        updatePayload.image = req.body.image;
      }

      const category = await categoryService.updateCategory(id, updatePayload);

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
      const result = await categoryService.deleteCategory(id);

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

module.exports = new CategoryController();
