const sharedUpload = require('../../../../shared/middleware/upload.middleware');

/**
 * Category Image Upload Middleware:
 * Handles single image upload for meat category banners / plates
 */
const categoryUpload = sharedUpload.single('image');

module.exports = {
  categoryUpload,
};
