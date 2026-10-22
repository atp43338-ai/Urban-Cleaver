const Cut = require('./cut.model');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

class CutService {
  /**
   * Create a new culinary cut
   */
  async createCut({ name, sublabel, targetMeat, description, isActive }) {
    if (!name || !name.trim()) {
      const error = new Error('Cut name is required');
      error.statusCode = 400;
      throw error;
    }

    const trimmedName = name.trim();

    // Check if cut name already exists (case-insensitive)
    const existing = await Cut.findOne({
      name: { $regex: new RegExp(`^${escapeRegex(trimmedName)}$`, 'i') },
    });

    if (existing) {
      const error = new Error(`Cut "${trimmedName}" already exists`);
      error.statusCode = 409;
      throw error;
    }

    const cut = await Cut.create({
      name: trimmedName,
      sublabel: sublabel ? sublabel.trim() : '',
      targetMeat: targetMeat ? targetMeat.trim() : 'All',
      description: description ? description.trim() : '',
      isActive: typeof isActive === 'boolean' ? isActive : true,
    });

    return cut;
  }

  /**
   * Get all cuts with optional search and filters
   */
  async getAllCuts({ search, targetMeat, status } = {}) {
    const query = {};

    if (search && search.trim()) {
      const cleanSearch = search.trim();
      query.$or = [
        { name: { $regex: cleanSearch, $options: 'i' } },
        { sublabel: { $regex: cleanSearch, $options: 'i' } },
        { targetMeat: { $regex: cleanSearch, $options: 'i' } },
      ];
    }

    if (targetMeat && targetMeat !== 'all') {
      query.targetMeat = { $regex: new RegExp(`^${targetMeat.trim()}$`, 'i') };
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const cuts = await Cut.find(query).sort({ createdAt: 1 });
    const totalCount = await Cut.countDocuments();
    const activeCount = await Cut.countDocuments({ isActive: true });

    return {
      cuts,
      summary: {
        total: totalCount,
        active: activeCount,
        inactive: totalCount - activeCount,
      },
    };
  }

  /**
   * Get single cut by ID
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
   * Update cut
   */
  async updateCut(id, { name, sublabel, targetMeat, description, isActive }) {
    const cut = await Cut.findById(id);
    if (!cut) {
      const error = new Error('Cut not found');
      error.statusCode = 404;
      throw error;
    }

    if (name && name.trim()) {
      const trimmedName = name.trim();
      if (trimmedName.toLowerCase() !== cut.name.toLowerCase()) {
        const existing = await Cut.findOne({
          name: { $regex: new RegExp(`^${escapeRegex(trimmedName)}$`, 'i') },
          _id: { $ne: id },
        });
        if (existing) {
          const error = new Error(`Cut "${trimmedName}" already exists`);
          error.statusCode = 409;
          throw error;
        }
      }
      cut.name = trimmedName;
    }

    if (sublabel !== undefined) {
      cut.sublabel = sublabel ? sublabel.trim() : '';
    }

    if (targetMeat !== undefined) {
      cut.targetMeat = targetMeat ? targetMeat.trim() : 'All';
    }

    if (description !== undefined) {
      cut.description = description ? description.trim() : '';
    }

    if (typeof isActive === 'boolean') {
      cut.isActive = isActive;
    }

    await cut.save();
    return cut;
  }

  /**
   * Delete cut
   */
  async deleteCut(id) {
    const cut = await Cut.findById(id);
    if (!cut) {
      const error = new Error('Cut not found');
      error.statusCode = 404;
      throw error;
    }

    await Cut.findByIdAndDelete(id);
    return { id, message: `Cut "${cut.name}" deleted successfully` };
  }
}

module.exports = new CutService();
