import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, Scissors } from 'lucide-react';

const CutModal = ({ isOpen, onClose, onSubmit, cut = null, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    sublabel: '',
    targetMeat: 'All',
    description: '',
    isActive: true,
  });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Cut name is required (e.g. Biriyani cutting)');
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      sublabel: formData.sublabel.trim(),
      targetMeat: formData.targetMeat,
      description: formData.description.trim(),
      isActive: formData.isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xl w-full max-w-lg overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
              <Scissors size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-black tracking-tight">
                {cut ? 'Edit Culinary Cut' : 'Add New Culinary Cut'}
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Configure butchery slicing style, piece dimensions, and recipe target.
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

        {/* Modal Form Body */}
        <form id="cut-form" onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-zinc-100 border border-zinc-300 rounded-lg text-xs text-black font-medium">
              {error}
            </div>
          )}

          {/* Cut Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-600 mb-1">
              Cut Name <span className="text-black font-bold">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Biriyani cutting, Beef Keema, Saloona cutting"
              className="w-full h-10 px-3.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition"
              required
            />
          </div>

          {/* Sublabel / Cooking Purpose */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-600 mb-1">
              Cooking Purpose / Sublabel
            </label>
            <input
              type="text"
              name="sublabel"
              value={formData.sublabel}
              onChange={handleChange}
              placeholder="e.g. Calibrated 45-55g Dum Pieces, Fine Mince, Bone-in Stew"
              className="w-full h-10 px-3.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition"
            />
          </div>

          {/* Target Meat Type */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-600 mb-1">
              Target Meat Type
            </label>
            <select
              name="targetMeat"
              value={formData.targetMeat}
              onChange={handleChange}
              className="w-full h-10 px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-black cursor-pointer font-medium"
            >
              <option value="All">All Livestock (Beef, Mutton, Goat)</option>
              <option value="Beef">Beef Only</option>
              <option value="Mutton">Mutton / Goat Only</option>
              <option value="Chicken">Chicken / Poultry</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-600 mb-1">
              Culinary Description (Optional)
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain piece size, cooking reason, bone splinter prevention, etc."
              className="w-full p-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition resize-none"
            />
          </div>

          {/* Status Checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 accent-black cursor-pointer rounded"
              />
              <span className="text-xs font-semibold text-zinc-800">
                Active in Storefront &amp; Product Cut Selector
              </span>
            </label>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-200 bg-zinc-50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-black hover:bg-zinc-200/60 rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="cut-form"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition active:scale-[0.99] cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Saving Cut...</span>
              </>
            ) : (
              <>
                <Check size={14} />
                <span>{cut ? 'Save Changes' : 'Create Cut'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CutModal;
