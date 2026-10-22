const sharedUpload = require('../../../../shared/middleware/upload.middleware');

/**
 * Product Upload Middleware:
 * Supports multiple gallery uploads (`images`, max 10) and cover image (`image`, max 1)
 */
const productUpload = sharedUpload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'image', maxCount: 1 },
]);

module.exports = {
  productUpload,
};
