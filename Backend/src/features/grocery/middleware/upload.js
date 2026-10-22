const sharedUpload = require('../../../shared/middleware/upload.middleware');

/**
 * Pantry Image Upload Middleware:
 * Supports single image upload for pantry ingredient cards (`image`).
 */
const pantryUpload = sharedUpload.single('image');

module.exports = {
  pantryUpload,
  upload: sharedUpload,
};
