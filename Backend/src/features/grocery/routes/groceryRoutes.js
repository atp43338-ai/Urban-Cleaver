const express = require('express');
const pantryController = require('../controllers/groceryController');
const { pantryUpload } = require('../middleware/upload');
const { protect } = require('../../../shared/middleware/auth.middleware');
const { requireAdmin } = require('../../../shared/middleware/admin.middleware');

const router = express.Router();
const adminRouter = express.Router();
const publicRouter = express.Router();

/**
 * ========================================================
 * Admin Pantry Routes (/api/admin/pantry)
 * Protected by protect + requireAdmin
 * ========================================================
 */
adminRouter.post('/', pantryUpload, (req, res, next) =>
  pantryController.createPantryItem(req, res, next)
);

adminRouter.get('/', (req, res, next) =>
  pantryController.getAllPantryItemsAdmin(req, res, next)
);

adminRouter.get('/:id', (req, res, next) =>
  pantryController.getPantryItemById(req, res, next)
);

adminRouter.put('/:id', pantryUpload, (req, res, next) =>
  pantryController.updatePantryItem(req, res, next)
);

adminRouter.patch('/:id/toggle-stock', (req, res, next) =>
  pantryController.toggleStockStatus(req, res, next)
);

adminRouter.delete('/:id', (req, res, next) =>
  pantryController.deletePantryItem(req, res, next)
);

/**
 * ========================================================
 * Public Customer Pantry Routes (/api/pantry & /api/public/pantry)
 * No authentication required
 * ========================================================
 */
publicRouter.get('/', (req, res, next) =>
  pantryController.getPublicPantryByRecipe(req, res, next)
);

publicRouter.get('/by-recipe', (req, res, next) =>
  pantryController.getPublicPantryByRecipe(req, res, next)
);

// Combined router (default export)
router.use('/', publicRouter);

module.exports = {
  router,
  adminRouter,
  publicRouter,
};
