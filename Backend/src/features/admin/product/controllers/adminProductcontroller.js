const adminProductService = require('../services/adminProductservices');

class AdminProductController {
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

  // --- PRODUCT HANDLERS ---

  async createProduct(req, res, next) {
    try {
      const {
        name,
        category,
        cutStyle,
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

      let parsedCutTypes = cutTypes;
      if (typeof cutTypes === 'string') {
        try {
          const parsed = JSON.parse(cutTypes);
          if (Array.isArray(parsed)) parsedCutTypes = parsed;
        } catch {
          parsedCutTypes = cutTypes.split(',').map((c) => c.trim()).filter(Boolean);
        }
      }

      const parsedIsStock = isStock === 'false' || isStock === false ? false : true;

      const product = await adminProductService.createProduct({
        name,
        category,
        cutStyle,
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

  async getAllProducts(req, res, next) {
    try {
      const { search, category, stockStatus, cutType, recipe, page, limit } = req.query;
      const result = await adminProductService.getAllProducts({
        search,
        category,
        stockStatus,
        cutType,
        recipe,
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

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await adminProductService.getProductById(id);

      return res.status(200).json({
        success: true,
        product,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const uploadedImages = this._extractUploadedFiles(req);
      const updateData = { ...req.body };

      if (uploadedImages.length > 0) {
        let existingImages = [];
        if (req.body.existingImages) {
          try {
            existingImages = JSON.parse(req.body.existingImages);
          } catch {
            existingImages = Array.isArray(req.body.existingImages)
              ? req.body.existingImages
              : [req.body.existingImages];
          }
        }
        updateData.images = [...existingImages, ...uploadedImages];
      } else if (req.body.images) {
        try {
          updateData.images = JSON.parse(req.body.images);
        } catch {
          updateData.images = Array.isArray(req.body.images)
            ? req.body.images
            : [req.body.images];
        }
      }

      if (req.body.cutTypes) {
        try {
          updateData.cutTypes = JSON.parse(req.body.cutTypes);
        } catch {
          updateData.cutTypes = req.body.cutTypes
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean);
        }
      }

      if (req.body.isStock !== undefined) {
        updateData.isStock = req.body.isStock === 'true' || req.body.isStock === true;
      }

      const product = await adminProductService.updateProduct(id, updateData);

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminProductService.deleteProduct(id);

      return res.status(200).json({
        success: true,
        message: result.message,
        id: result.id,
      });
    } catch (err) {
      next(err);
    }
  }

  // --- CULINARY CUT HANDLERS ("Add Cut" & Cut Management) ---

  async createCut(req, res, next) {
    try {
      const { name, sublabel, targetMeat, description, isActive } = req.body;
      const parsedIsActive = isActive === 'false' || isActive === false ? false : true;

      const cut = await adminProductService.createCut({
        name,
        sublabel,
        targetMeat,
        description,
        isActive: parsedIsActive,
      });

      return res.status(201).json({
        success: true,
        message: 'Culinary cut created successfully',
        cut,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllCuts(req, res, next) {
    try {
      const { search, targetMeat, status } = req.query;
      const result = await adminProductService.getAllCuts({ search, targetMeat, status });

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getCutById(req, res, next) {
    try {
      const { id } = req.params;
      const cut = await adminProductService.getCutById(id);

      return res.status(200).json({
        success: true,
        cut,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateCut(req, res, next) {
    try {
      const { id } = req.params;
      const { name, sublabel, targetMeat, description, isActive } = req.body;

      let parsedIsActive;
      if (isActive !== undefined) {
        parsedIsActive = isActive === 'true' || isActive === true;
      }

      const cut = await adminProductService.updateCut(id, {
        name,
        sublabel,
        targetMeat,
        description,
        isActive: parsedIsActive,
      });

      return res.status(200).json({
        success: true,
        message: 'Culinary cut updated successfully',
        cut,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteCut(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminProductService.deleteCut(id);

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

module.exports = new AdminProductController();
