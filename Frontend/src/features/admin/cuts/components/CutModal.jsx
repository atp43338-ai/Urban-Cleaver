import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, UtensilsCrossed } from 'lucide-react';
import cutService from '../services/cutService';
import toast from 'react-hot-toast';

const MEAT_TYPES = ['All', 'Beef', 'Mutton', 'Poultry'];

const CutModal = ({
  isOpen,
  onClose,
  onSuccess,
  cut = null,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sublabel: '',
    targetMeat: 'All',
    description: '',
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cut) {
      setFormData({
        name: cut.name || '',
        sublabel: cut.sublabel || '',
        targetMeat: cut.targetMeat || 'All',
        description: cut.description || '',
        isActive: cut.isActive !== undefined ? cut.isActive : true,
      });
    } else {
      setFormData({
        name: '',
        sublabel: '',
        targetMeat: 'All',
        description: '',
        isActive: true,
      });
    }
    setError('');
  }, [cut, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Cut name is required (e.g. Biriyani cutting)');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      if (cut) {
        const id = cut._id || cut.id;
        const res = await cutService.updateCut(id, formData);
        toast.success(res.message || 'Cut updated successfully');
        if (onSuccess) onSuccess(res.cut || res);
      } else {
        const res = await cutService.createCut(formData);
        toast.success(res.message || 'Cut style created successfully');
        if (onSuccess) onSuccess(res.cut || res);
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save cut style';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xl w-full max-w-md overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-black">
              <UtensilsCrossed size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-black tracking-tight">
                {cut ? 'Edit Culinary Cut' : 'Add New Culinary Cut'}
              </h3>
              <p className="text-[11px] text-zinc-500">
                Define master knife styles &amp; cooking purposes.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* Cut Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
              Cut Name <span className="text-black">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Biriyani cutting, Beef Keema"
              disabled={isSubmitting}
              className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              required
            />
          </div>

          {/* Sublabel / Cooking Purpose */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
              Sublabel / Cooking Purpose
            </label>
            <input
              type="text"
              name="sublabel"
              value={formData.sublabel}
              onChange={handleChange}
              placeholder="e.g. Dum Pieces, Stew / Curry, Mince"
              disabled={isSubmitting}
              className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
            />
          </div>

          {/* Target Meat Type */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
              Target Meat Type
            </label>
            <select
              name="targetMeat"
              value={formData.targetMeat}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition cursor-pointer font-medium"
            >
              {MEAT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              placeholder="Specific knife angle or grain recommendation..."
              disabled={isSubmitting}
              className="w-full p-3 text-xs bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition resize-none"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="cut-isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-black cursor-pointer"
            />
            <label htmlFor="cut-isActive" className="text-xs font-medium text-zinc-700 cursor-pointer">
              Active cut option in customer filters &amp; product builder
            </label>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={13} />
                  <span>{cut ? 'Save Changes' : 'Create Cut'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CutModal;
