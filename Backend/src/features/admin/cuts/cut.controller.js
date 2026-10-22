const cutService = require('./cut.service');

class CutController {
  /**
   * POST /api/admin/cuts or /api/cuts
   * Creates a new culinary cut style. Responds with status 201.
   */
  async createCut(req, res, next) {
    try {
      const { name, sublabel, targetMeat, description, isActive } = req.body;
      const parsedIsActive = isActive === 'false' || isActive === false ? false : true;

      const cut = await cutService.createCut({
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

  /**
   * GET /api/admin/cuts or /api/cuts or /api/public/cuts
   */
  async getAllCuts(req, res, next) {
    try {
      const { search, targetMeat, status } = req.query;
      const result = await cutService.getAllCuts({ search, targetMeat, status });

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/admin/cuts/:id
   */
  async getCutById(req, res, next) {
    try {
      const { id } = req.params;
      const cut = await cutService.getCutById(id);

      return res.status(200).json({
        success: true,
        cut,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/admin/cuts/:id
   */
  async updateCut(req, res, next) {
    try {
      const { id } = req.params;
      const { name, sublabel, targetMeat, description, isActive } = req.body;

      const updatePayload = {};
      if (name !== undefined) updatePayload.name = name;
      if (sublabel !== undefined) updatePayload.sublabel = sublabel;
      if (targetMeat !== undefined) updatePayload.targetMeat = targetMeat;
      if (description !== undefined) updatePayload.description = description;
      if (isActive !== undefined) {
        updatePayload.isActive = isActive === 'false' || isActive === false ? false : true;
      }

      const cut = await cutService.updateCut(id, updatePayload);

      return res.status(200).json({
        success: true,
        message: 'Cut updated successfully',
        cut,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/admin/cuts/:id
   */
  async deleteCut(req, res, next) {
    try {
      const { id } = req.params;
      const result = await cutService.deleteCut(id);

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

module.exports = new CutController();
