const Cut = require('./cut.model');

class CutService {
  /**
   * Create a new culinary cut
   */
  async createCut(data) {
    const { name, sublabel, targetMeat, description, isActive } = data;

    if (!name || !name.trim()) {
      const error = new Error('Cut name is required');
      error.statusCode = 400;
      throw error;
    }

    const trimmedName = name.trim();
    const existing = await Cut.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
    });

    if (existing) {
      const error = new Error(`Cut "${trimmedName}" already exists`);
      error.statusCode = 409;
      throw error;
    }

    const slug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const cut = await Cut.create({
      name: trimmedName,
      slug,
      sublabel: sublabel ? sublabel.trim() : '',
      targetMeat: targetMeat ? targetMeat.trim() : 'All',
      description: description ? description.trim() : '',
      isActive: isActive !== undefined ? isActive : true,
    });

    return cut;
  }

  /**
   * Retrieve cuts with optional filtering
   */
  async getAllCuts(filter = {}) {
    const query = {};

    if (filter.status === 'active') {
      query.isActive = true;
    } else if (filter.status === 'inactive') {
      query.isActive = false;
    }

    if (filter.targetMeat && filter.targetMeat !== 'all' && filter.targetMeat !== 'All') {
      query.$or = [
        { targetMeat: filter.targetMeat },
        { targetMeat: 'All' },
      ];
    }

    if (filter.search && filter.search.trim()) {
      query.name = { $regex: filter.search.trim(), $options: 'i' };
    }

    const cuts = await Cut.find(query).sort({ createdAt: -1 });
    const total = await Cut.countDocuments(query);

    return {
      cuts,
      total,
    };
  }

  /**
   * Retrieve single cut by ID
   */
  async getCutById(id) {
    const cut = await Cut.findById(id);
    if (!cut) {
      const error = new Error('Cut not found');
      error.statusCode = 404;
      throw error;
    }
    return cut;
  }

  /**
   * Update an existing cut
   */
  async updateCut(id, payload) {
    const cut = await Cut.findById(id);
    if (!cut) {
      const error = new Error('Cut not found');
      error.statusCode = 404;
      throw error;
    }

    if (payload.name && payload.name.trim() !== cut.name) {
      const trimmed = payload.name.trim();
      const existing = await Cut.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${trimmed}$`, 'i') },
      });
      if (existing) {
        const error = new Error(`Cut "${trimmed}" already exists`);
        error.statusCode = 409;
        throw error;
      }
      cut.name = trimmed;
      cut.slug = trimmed
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    if (payload.sublabel !== undefined) cut.sublabel = payload.sublabel.trim();
    if (payload.targetMeat !== undefined) cut.targetMeat = payload.targetMeat.trim();
    if (payload.description !== undefined) cut.description = payload.description.trim();
    if (payload.isActive !== undefined) cut.isActive = payload.isActive;

    await cut.save();
    return cut;
  }

  /**
   * Delete a cut by ID
   */
  async deleteCut(id) {
    const cut = await Cut.findByIdAndDelete(id);
    if (!cut) {
      const error = new Error('Cut not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Cut deleted successfully', id };
  }
}

module.exports = new CutService();
