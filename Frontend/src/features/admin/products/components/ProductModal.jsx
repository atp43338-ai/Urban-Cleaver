import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, Plus, Tag, Scissors } from 'lucide-react';
import ImageUploadField from '../../shared/ImageUploadField';

const DEFAULT_CUT_TYPES = [
  'Beef Keema',
  'Mutton keema',
  'Beef cube',
  'Beef kurma',
  'Biriyani cutting',
  'Saloona cutting',
  'Finger cutting (French fries)',
  'Beef pasantha',
  'Burger',
  'Kebab cutting',
];

const ProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  product = null,
  categories = [],
  cuts = [],
  onOpenAddCutModal = null,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    grossWeight: '',
    netWeight: '',
    cutTypes: ['Curry Cut', 'Biryani Cut'],
    isStock: true,
  });
  const [images, setImages] = useState([]);
  const [customCut, setCustomCut] = useState('');
  const [error, setError] = useState('');

  const availableCuts = Array.isArray(cuts) && cuts.length > 0
    ? cuts.map((c) => (typeof c === 'string' ? c : c.name))
    : DEFAULT_CUT_TYPES;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category?._id || product.category || '',
        description: product.description || '',
        price: product.price !== undefined ? String(product.price) : '',
        grossWeight: product.grossWeight || '',
        netWeight: product.netWeight || '',
        cutTypes: Array.isArray(product.cutTypes) && product.cutTypes.length > 0
          ? product.cutTypes
          : ['Curry Cut', 'Biryani Cut'],
        isStock: product.isStock !== undefined ? product.isStock : true,
      });

      // Populate existing images
      const existing = [];
      if (Array.isArray(product.images)) {
        product.images.forEach((img, idx) => {
          if (img) existing.push({ preview: img, name: `Product Image #${idx + 1}` });
        });
      } else if (typeof product.images === 'string' && product.images) {
        existing.push({ preview: product.images, name: 'Product Image #1' });
      }
      setImages(existing);
    } else {
      setFormData({
        name: '',
        category: categories.length > 0 ? (categories[0]._id || categories[0].id) : '',
        description: '',
        price: '',
        grossWeight: '1000g',
        netWeight: '1000g Net Usable',
        cutTypes: availableCuts.slice(0, 2),
        isStock: true,
      });
      setImages([]);
    }
    setCustomCut('');
    setError('');
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleToggleCutType = (cut) => {
    setFormData((prev) => {
      const exists = prev.cutTypes.includes(cut);
      return {
        ...prev,
        cutTypes: exists
          ? prev.cutTypes.filter((c) => c !== cut)
          : [...prev.cutTypes, cut],
      };
    });
  };

  const handleAddCustomCut = (e) => {
    e.preventDefault();
    if (!customCut.trim()) return;
    const trimmed = customCut.trim();
    if (!formData.cutTypes.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        cutTypes: [...prev.cutTypes, trimmed],
      }));
    }
    setCustomCut('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!formData.category) {
      setError('Please select a category');
      return;
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      setError('Please provide a valid price');
      return;
    }
    if (!formData.grossWeight.trim()) {
      setError('Gross weight is required (e.g. 1000g)');
      return;
    }
    if (!formData.netWeight.trim()) {
      setError('Net usable weight is required (e.g. 750g - 800g)');
      return;
    }
    if (formData.cutTypes.length === 0) {
      setError('Please select at least one available cut type');
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name.trim());
    payload.append('category', formData.category);
    payload.append('price', Number(formData.price));
    payload.append('grossWeight', formData.grossWeight.trim());
    payload.append('netWeight', formData.netWeight.trim());
    payload.append('description', formData.description ? formData.description.trim() : '');
    payload.append('isStock', formData.isStock);
    payload.append('cutTypes', JSON.stringify(formData.cutTypes));

    // Handle files and existing images
    const existingImages = [];
    images.forEach((item) => {
      if (item.file) {
        payload.append('images', item.file);
      } else if (item.preview) {
        existingImages.push(item.preview);
      }
    });
    payload.append('existingImages', JSON.stringify(existingImages));

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xl w-full max-w-2xl overflow-hidden text-left flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 shrink-0">
          <div>
            <h3 className="text-base font-bold text-black tracking-tight">
              {product ? 'Edit Butchery Product' : 'Add New Butchery Product'}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Specify cut details, weights, pricing, and stock availability with local photo uploads.
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
        <form id="product-form" onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-zinc-100 border border-zinc-300 rounded-lg text-xs text-black font-medium">
              {error}
            </div>
          )}

          {/* Row 1: Name, Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-1">
              <label
                className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5"
                htmlFor="prod-name"
              >
                Product Name <span className="text-black">*</span>
              </label>
              <input
                id="prod-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Country Chicken Curry Cut"
                disabled={isSubmitting}
                className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                required
              />
            </div>

            <div className="sm:col-span-1">
              <label
                className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5"
                htmlFor="prod-category"
              >
                Category <span className="text-black">*</span>
              </label>
              <select
                id="prod-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition cursor-pointer font-medium"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.name} {!c.isActive ? '(Inactive)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-1">
              <label
                className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5"
                htmlFor="prod-price"
              >
                Price (₹) <span className="text-black">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-medium text-sm">
                  ₹
                </span>
                <input
                  id="prod-price"
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="349"
                  disabled={isSubmitting}
                  className="w-full h-10 pl-7 pr-3 text-sm bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition font-mono"
                  required
                />
              </div>
            </div>
          </div>


          {/* Row 3: Cut Types Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Available Cut Options <span className="text-black">*</span>
              </label>
              {onOpenAddCutModal && (
                <button
                  type="button"
                  onClick={onOpenAddCutModal}
                  className="text-[11px] font-semibold text-black hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Scissors size={12} />
                  <span>+ Define New Cut</span>
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {availableCuts.map((cut) => {
                const selected = formData.cutTypes.includes(cut);
                return (
                  <button
                    key={cut}
                    type="button"
                    onClick={() => handleToggleCutType(cut)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer select-none ${
                      selected
                        ? 'bg-black text-white border-black shadow-none'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <Tag size={12} />
                    {cut}
                    {selected && <Check size={12} className="ml-0.5" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Cut Adder */}
            <div className="flex gap-2 items-center mt-2">
              <input
                type="text"
                value={customCut}
                onChange={(e) => setCustomCut(e.target.value)}
                placeholder="Quick custom cut..."
                className="h-8 px-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition flex-1 max-w-xs"
              />
              <button
                type="button"
                onClick={handleAddCustomCut}
                className="h-8 px-3 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                <Plus size={12} /> Add
              </button>
            </div>
          </div>

          {/* Row 4: Local Image Upload Field (Multiple Supported) */}
          <ImageUploadField
            label="Product Images"
            hint="Upload single or multiple photos from computer"
            multiple={true}
            value={images}
            onChange={setImages}
            disabled={isSubmitting}
          />

          {/* Row 5: Description */}
          <div>
            <label
              className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5"
              htmlFor="prod-desc"
            >
              Product Description & Culinary Details <span className="text-zinc-400 normal-case font-normal">(Optional)</span>
            </label>
            <textarea
              id="prod-desc"
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleChange}
              placeholder="Fresh, tender cuts sourced from antibiotic-free livestock..."
              disabled={isSubmitting}
              className="w-full p-3 text-sm bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition resize-none"
            />
          </div>

          {/* Row 6: In-Stock Toggle Switch */}
          <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
            <div>
              <p className="text-xs font-semibold text-black">Inventory Stock Status</p>
              <p className="text-[11px] text-zinc-500">Available for customer checkout and fulfillment</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isStock"
                checked={formData.isStock}
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
            form="product-form"
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
                {product ? 'Save Changes' : 'Create Product'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
