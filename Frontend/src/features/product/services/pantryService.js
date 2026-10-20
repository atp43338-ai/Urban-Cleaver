import api from '../../../services/api';

/**
 * Service for fetching public pantry add-ons and recipe kits
 * Backed by /api/public/pantry
 */
const pantryService = {
  /**
   * Fetch active, in-stock pantry items matching target recipe(s)
   * e.g., recipes: 'Biryani' or 'Beef Roast,Curry'
   */
  async fetchPantryByRecipe(recipes, category) {
    const params = {};
    if (recipes) params.recipes = recipes;
    if (category) params.category = category;

    const response = await api.get('/public/pantry', { params });
    return response.data;
  },

  /**
   * Fetch all active in-stock pantry items
   */
  async getAllPublicPantry() {
    const response = await api.get('/public/pantry');
    return response.data;
  },
};

export default pantryService;
