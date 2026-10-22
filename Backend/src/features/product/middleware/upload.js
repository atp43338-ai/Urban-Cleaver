const sharedUpload = require('../../../shared/middleware/upload.middleware');

/**
 * Product Upload Middleware:
 * Supports multiple image gallery uploads (`images`) and primary cover image (`image`).
 */
const productUpload = sharedUpload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'image', maxCount: 1 },
]);

module.exports = {
  productUpload,
  upload: sharedUpload,
};
