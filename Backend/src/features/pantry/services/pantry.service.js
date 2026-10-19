const PantryItem = require('../models/pantryItem.model');

class PantryService {
  /**
   * Helper to normalize recipe tags array
   */
  _normalizeRecipes(recipes) {
    if (!recipes) return ['Biryani', 'Curry'];
    if (Array.isArray(recipes)) {
      return recipes.map((r) => String(r).trim()).filter(Boolean);
    }
    if (typeof recipes === 'string') {
      try {
        const parsed = JSON.parse(recipes);
        if (Array.isArray(parsed)) return parsed.map((r) => String(r).trim()).filter(Boolean);
      } catch {
        return recipes
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean);
      }
    }
    return ['Biryani', 'Curry'];
  }

  /**
   * Create a new pantry/recipe kit item
   */
  async createPantryItem({
    name,
    portionSize,
    category,
    price,
    imageUrl,
    inStock = true,
    applicableRecipes = [],
    isPortionKit = true,
  }) {
    if (!name || !name.trim()) {
      const error = new Error('Pantry item name is required');
      error.statusCode = 400;
      throw error;
    }

    if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
      const error = new Error('Valid non-negative price is required');
      error.statusCode = 400;
      throw error;
    }

    const item = new PantryItem({
      name: name.trim(),
      portionSize: portionSize ? portionSize.trim() : 'Pre-portioned for 1kg meat (~200g)',
      category: category || 'produce',
      price: Number(price),
      imageUrl: imageUrl ? String(imageUrl).trim() : '',
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      applicableRecipes: this._normalizeRecipes(applicableRecipes),
      isPortionKit: isPortionKit !== undefined ? Boolean(isPortionKit) : true,
    });

    await item.save();
    return item;
  }

  /**
   * Get all pantry items for Admin with filters, pagination, and stock summary
   */
  async getAllPantryItemsAdmin({
    search = '',
    category,
    recipe,
    inStock,
    page = 1,
    limit = 50,
  }) {
    const query = {};

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { portionSize: regex }, { applicableRecipes: regex }];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (recipe && recipe !== 'all') {
      query.applicableRecipes = { $regex: new RegExp(recipe.trim(), 'i') };
    }

    if (inStock !== undefined && inStock !== 'all') {
      query.inStock = inStock === 'true' || inStock === true;
    }

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));
    const skip = (parsedPage - 1) * parsedLimit;

    const [items, totalCount, inStockCount, totalAll] = await Promise.all([
      PantryItem.find(query).sort({ createdAt: -1 }).skip(skip).limit(parsedLimit),
      PantryItem.countDocuments(query),
      PantryItem.countDocuments({ inStock: true }),
      PantryItem.countDocuments(),
    ]);

    return {
      items,
      pagination: {
        total: totalCount,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(totalCount / parsedLimit) || 1,
      },
      summary: {
        totalItems: totalAll,
        inStock: inStockCount,
        outOfStock: totalAll - inStockCount,
      },
    };
  }

  /**
   * Get single pantry item by ID
   */
  async getPantryItemById(id) {
    const item = await PantryItem.findById(id);
    if (!item) {
      const error = new Error('Pantry item not found');
      error.statusCode = 404;
      throw error;
    }
    return item;
  }

  /**
   * Update pantry item
   */
  async updatePantryItem(id, updateData) {
    const item = await PantryItem.findById(id);
    if (!item) {
      const error = new Error('Pantry item not found');
      error.statusCode = 404;
      throw error;
    }

    if (updateData.name !== undefined) item.name = updateData.name.trim();
    if (updateData.portionSize !== undefined) item.portionSize = updateData.portionSize.trim();
    if (updateData.category !== undefined) item.category = updateData.category;
    if (updateData.price !== undefined) item.price = Number(updateData.price);
    if (updateData.imageUrl !== undefined) item.imageUrl = String(updateData.imageUrl).trim();
    if (updateData.inStock !== undefined) item.inStock = Boolean(updateData.inStock);
    if (updateData.isPortionKit !== undefined) item.isPortionKit = Boolean(updateData.isPortionKit);
    if (updateData.applicableRecipes !== undefined) {
      item.applicableRecipes = this._normalizeRecipes(updateData.applicableRecipes);
    }

    await item.save();
    return item;
  }

  /**
   * Delete pantry item
   */
  async deletePantryItem(id) {
    const item = await PantryItem.findById(id);
    if (!item) {
      const error = new Error('Pantry item not found');
      error.statusCode = 404;
      throw error;
    }
    await PantryItem.findByIdAndDelete(id);
    return { success: true, message: 'Pantry item deleted successfully' };
  }

  /**
   * Toggle in-stock status (1-click switch)
   */
  async toggleStockStatus(id) {
    const item = await PantryItem.findById(id);
    if (!item) {
      const error = new Error('Pantry item not found');
      error.statusCode = 404;
      throw error;
    }
    item.inStock = !item.inStock;
    await item.save();
    return item;
  }

  /**
   * Public storefront: Get active, in-stock pantry items matching recipe(s)
   * Example: ?recipes=Biryani,Beef Roast,Curry or ?category=produce
   */
  async getPublicPantryByRecipe({ recipes, category }) {
    const query = { inStock: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (recipes && recipes.trim()) {
      const recipeList = recipes
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);

      if (recipeList.length > 0) {
        const regexConditions = recipeList.map((r) => ({
          applicableRecipes: { $regex: new RegExp(r, 'i') },
        }));
        query.$or = regexConditions;
      }
    }

    const items = await PantryItem.find(query).sort({ price: 1, createdAt: -1 });
    return items;
  }
}

module.exports = new PantryService();
