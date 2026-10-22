const pantryService = require('../services/groceryService');

class PantryController {
  /**
   * Helper to extract image URL from multer upload or body
   */
  _extractImageUrl(req) {
    if (req.file) {
      return `/uploads/${req.file.filename}`;
    }
    if (req.files) {
      if (Array.isArray(req.files) && req.files.length > 0) {
        return `/uploads/${req.files[0].filename}`;
      }
      if (req.files.image && req.files.image.length > 0) {
        return `/uploads/${req.files.image[0].filename}`;
      }
    }
    if (req.body.imageUrl && typeof req.body.imageUrl === 'string') {
      return req.body.imageUrl.trim();
    }
    if (req.body.image && typeof req.body.image === 'string') {
      return req.body.image.trim();
    }
    return '';
  }

  /**
   * Helper to parse boolean fields from FormData
   */
  _parseBoolean(val, fallback = true) {
    if (val === undefined || val === null || val === '') return fallback;
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') {
      const lower = val.toLowerCase().trim();
      return lower === 'true' || lower === '1';
    }
    return Boolean(val);
  }

  /**
   * POST /api/admin/pantry
   */
  async createPantryItem(req, res, next) {
    try {
      const {
        name,
        portionSize,
        category,
        price,
        inStock,
        applicableRecipes,
        isPortionKit,
      } = req.body;

      const imageUrl = this._extractImageUrl(req);

      const item = await pantryService.createPantryItem({
        name,
        portionSize,
        category,
        price,
        imageUrl,
        inStock: this._parseBoolean(inStock, true),
        applicableRecipes,
        isPortionKit: this._parseBoolean(isPortionKit, true),
      });

      return res.status(201).json({
        success: true,
        message: 'Pantry kit item created successfully',
        item,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/admin/pantry
   */
  async getAllPantryItemsAdmin(req, res, next) {
    try {
      const { search, category, recipe, inStock, page, limit } = req.query;

      const result = await pantryService.getAllPantryItemsAdmin({
        search,
        category,
        recipe,
        inStock,
        page,
        limit,
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
   * GET /api/admin/pantry/:id
   */
  async getPantryItemById(req, res, next) {
    try {
      const { id } = req.params;
      const item = await pantryService.getPantryItemById(id);

      return res.status(200).json({
        success: true,
        item,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/admin/pantry/:id
   */
  async updatePantryItem(req, res, next) {
    try {
      const { id } = req.params;
      const {
        name,
        portionSize,
        category,
        price,
        inStock,
        applicableRecipes,
        isPortionKit,
      } = req.body;

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (portionSize !== undefined) updateData.portionSize = portionSize;
      if (category !== undefined) updateData.category = category;
      if (price !== undefined) updateData.price = price;
      if (inStock !== undefined) updateData.inStock = this._parseBoolean(inStock, true);
      if (isPortionKit !== undefined) updateData.isPortionKit = this._parseBoolean(isPortionKit, true);
      if (applicableRecipes !== undefined) updateData.applicableRecipes = applicableRecipes;

      const uploadedImage = this._extractImageUrl(req);
      if (uploadedImage) {
        updateData.imageUrl = uploadedImage;
      }

      const item = await pantryService.updatePantryItem(id, updateData);

      return res.status(200).json({
        success: true,
        message: 'Pantry kit item updated successfully',
        item,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/admin/pantry/:id
   */
  async deletePantryItem(req, res, next) {
    try {
      const { id } = req.params;
      const result = await pantryService.deletePantryItem(id);

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/admin/pantry/:id/toggle-stock
   */
  async toggleStockStatus(req, res, next) {
    try {
      const { id } = req.params;
      const item = await pantryService.toggleStockStatus(id);

      return res.status(200).json({
        success: true,
        message: `Stock status updated: ${item.inStock ? 'In Stock' : 'Out of Stock'}`,
        item,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/public/pantry or /api/public/pantry/by-recipe
   * Public customer storefront endpoint
   */
  async getPublicPantryByRecipe(req, res, next) {
    try {
      const { recipes, recipe, category } = req.query;
      const recipeQuery = recipes || recipe;

      const items = await pantryService.getPublicPantryByRecipe({
        recipes: recipeQuery,
        category,
      });

      return res.status(200).json({
        success: true,
        items,
        total: items.length,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PantryController();
