import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import ImageUploadField from '../../shared/ImageUploadField';

const CategoryModal = ({ isOpen, onClose, onSubmit, category = null, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        isActive: category.isActive !== undefined ? category.isActive : true,
      });
      setImages(category.image ? [{ preview: category.image, name: 'Current Image' }] : []);
    } else {
      setFormData({
        name: '',
        description: '',
        isActive: true,
      });
      setImages([]);
    }
    setError('');
  }, [category, isOpen]);

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
      setError('Category name is required');
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name.trim());
    payload.append('description', formData.description ? formData.description.trim() : '');
    payload.append('isActive', formData.isActive);

    if (images.length > 0) {
      if (images[0].file) {
        payload.append('image', images[0].file);
      } else if (images[0].preview) {
        payload.append('image', images[0].preview);
      }
    } else {
      payload.append('image', '');
    }

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xl w-full max-w-lg overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 shrink-0">
          <div>
            <h3 className="text-base font-bold text-black tracking-tight">
              {category ? 'Edit Category' : 'Create New Category'}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {category
                ? 'Update category information, department visuals, and store visibility.'
                : 'Configure a new butchery department with local image upload.'}
            </p>
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

        {/* Modal Form Body (Scrollable) */}
        <form id="category-form" onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-zinc-100 border border-zinc-300 rounded-lg text-xs text-black font-medium">
              {error}
            </div>
          )}

          {/* Category Name */}
          <div>
            <label
              className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5"
              htmlFor="category-name"
            >
              Category Name <span className="text-black">*</span>
            </label>
            <input
              id="category-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Fresh Chicken, Mutton Cuts, Exotic Steaks"
              disabled={isSubmitting}
              className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              required
            />
          </div>

          {/* Local Image Upload Field */}
          <ImageUploadField
            label="Category Image"
            hint="Drag & drop or browse from computer (PNG, JPG, WEBP)"
            multiple={false}
            value={images}
            onChange={setImages}
            disabled={isSubmitting}
          />

          {/* Description */}
          <div>
            <label
              className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5"
              htmlFor="category-desc"
            >
              Description <span className="text-zinc-400 normal-case font-normal">(Optional)</span>
            </label>
            <textarea
              id="category-desc"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of this butcher department..."
              disabled={isSubmitting}
              className="w-full p-3 text-sm bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition resize-none"
            />
          </div>

          {/* Active Status Toggle */}
          <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
            <div>
              <p className="text-xs font-semibold text-black">Active Store Visibility</p>
              <p className="text-[11px] text-zinc-500">Available to customers in catalog browsing</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                disabled={isSubmitting}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
            </label>
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-200 bg-zinc-50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-black hover:bg-zinc-200 rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="category-form"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold text-white bg-black hover:bg-zinc-800 rounded-lg shadow-none transition active:scale-[0.99] flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check size={14} />
                {category ? 'Save Changes' : 'Create Category'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
