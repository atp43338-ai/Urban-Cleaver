const express = require('express');
const pantryController = require('../controllers/pantry.controller');
const upload = require('../../../middlewares/upload.middleware');

const adminRouter = express.Router();
const publicRouter = express.Router();

/**
 * ========================================================
 * Admin Pantry Routes (/api/admin/pantry)
 * Protected upstream by protect + requireAdmin
 * ========================================================
 */
adminRouter.post('/', upload.single('image'), (req, res, next) =>
  pantryController.createPantryItem(req, res, next)
);

adminRouter.get('/', (req, res, next) =>
  pantryController.getAllPantryItemsAdmin(req, res, next)
);

adminRouter.get('/:id', (req, res, next) =>
  pantryController.getPantryItemById(req, res, next)
);

adminRouter.put('/:id', upload.single('image'), (req, res, next) =>
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
 * Public Customer Pantry Routes (/api/public/pantry)
 * No authentication required
 * ========================================================
 */
publicRouter.get('/', (req, res, next) =>
  pantryController.getPublicPantryByRecipe(req, res, next)
);

publicRouter.get('/by-recipe', (req, res, next) =>
  pantryController.getPublicPantryByRecipe(req, res, next)
);

module.exports = {
  adminRouter,
  publicRouter,
};
