const productService = require('./product.service');

class ProductController {
  /**
   * Helper to collect uploaded files from multer
   */
  _extractUploadedFiles(req) {
    const filePaths = [];
    if (req.files) {
      if (Array.isArray(req.files)) {
        req.files.forEach((f) => filePaths.push(`/uploads/${f.filename}`));
      } else {
        if (req.files.images) {
          req.files.images.forEach((f) => filePaths.push(`/uploads/${f.filename}`));
        }
        if (req.files.image) {
          req.files.image.forEach((f) => filePaths.push(`/uploads/${f.filename}`));
        }
      }
    } else if (req.file) {
      filePaths.push(`/uploads/${req.file.filename}`);
    }
    return filePaths;
  }

  /**
   * POST /api/admin/products
   */
  async createProduct(req, res, next) {
    try {
      const {
        name,
        category,
        description,
        price,
        grossWeight,
        netWeight,
        cutTypes,
        isStock,
      } = req.body;

      const uploadedImages = this._extractUploadedFiles(req);

      let finalImages = [...uploadedImages];
      if (req.body.images) {
        if (Array.isArray(req.body.images)) {
          finalImages.push(...req.body.images);
        } else if (typeof req.body.images === 'string') {
          try {
            const parsed = JSON.parse(req.body.images);
            if (Array.isArray(parsed)) finalImages.push(...parsed);
            else if (req.body.images.trim()) finalImages.push(req.body.images.trim());
          } catch {
            if (req.body.images.trim()) finalImages.push(req.body.images.trim());
          }
        }
      }

      // Parse cutTypes if passed as JSON string
      let parsedCutTypes = cutTypes;
      if (typeof cutTypes === 'string') {
        try {
          const parsed = JSON.parse(cutTypes);
          if (Array.isArray(parsed)) parsedCutTypes = parsed;
        } catch {}
      }

      const parsedIsStock = isStock === 'false' || isStock === false ? false : true;

      const product = await productService.createProduct({
        name,
        category,
        description,
        price,
        grossWeight,
        netWeight,
        cutTypes: parsedCutTypes,
        images: finalImages,
        isStock: parsedIsStock,
      });

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/admin/products
   */
  async getAllProducts(req, res, next) {
    try {
      const { search, category, stockStatus, page, limit } = req.query;
      const result = await productService.getAllProducts({
        search,
        category,
        stockStatus,
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
   * GET /api/admin/products/:id
   */
  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      return res.status(200).json({
        success: true,
        product,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/admin/products/:id
   */
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      const uploadedImages = this._extractUploadedFiles(req);

      // Handle existing and newly uploaded images
      let existingImages = [];
      if (req.body.existingImages) {
        try {
          const parsed = JSON.parse(req.body.existingImages);
          if (Array.isArray(parsed)) existingImages = parsed;
          else if (typeof req.body.existingImages === 'string') existingImages = [req.body.existingImages];
        } catch {
          existingImages = [req.body.existingImages];
        }
      } else if (req.body.images && !Array.isArray(req.body.images)) {
        try {
          const parsed = JSON.parse(req.body.images);
          if (Array.isArray(parsed)) existingImages = parsed;
          else existingImages = [req.body.images];
        } catch {
          existingImages = [req.body.images];
        }
      } else if (Array.isArray(req.body.images)) {
        existingImages = req.body.images;
      }

      if (uploadedImages.length > 0 || req.body.existingImages !== undefined || req.body.images !== undefined) {
        updateData.images = [...existingImages, ...uploadedImages];
      }

      if (updateData.cutTypes && typeof updateData.cutTypes === 'string') {
        try {
          const parsed = JSON.parse(updateData.cutTypes);
          if (Array.isArray(parsed)) updateData.cutTypes = parsed;
        } catch {}
      }

      if (updateData.isStock !== undefined) {
        updateData.isStock = updateData.isStock === 'false' || updateData.isStock === false ? false : true;
      }

      if (updateData.price !== undefined) {
        updateData.price = Number(updateData.price);
      }

      const product = await productService.updateProduct(id, updateData);

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/admin/products/:id
   */
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const result = await productService.deleteProduct(id);

      return res.status(200).json({
        success: true,
        message: result.message,
        id: result.id,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductController();
