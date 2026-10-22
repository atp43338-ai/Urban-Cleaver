const sharedUpload = require('../../../shared/middleware/upload.middleware');

/**
 * Category Upload Middleware:
 * Supports single category banner / plate image upload (`image`).
 */
const categoryUpload = sharedUpload.single('image');

module.exports = {
  categoryUpload,
  upload: sharedUpload,
};
