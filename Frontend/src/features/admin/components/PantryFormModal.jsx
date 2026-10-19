import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, Plus, Tag, UtensilsCrossed } from 'lucide-react';
import ImageUploadField from '../shared/ImageUploadField';

const STANDARD_RECIPES = [
  'Biryani',
  'Beef Roast',
  'Beef Fry',
  'Mandi',
  'Curry',
  'Pan Fry',
  'Mutton Sukka',
];

const CATEGORY_OPTIONS = [
  { value: 'produce', label: 'Produce (Shallots, Chillies, Herbs)' },
  { value: 'spices', label: 'Spices & Potli Blends' },
  { value: 'dairy_oils', label: 'Dairy & Artisanal Oils (Ghee, etc.)' },
  { value: 'essentials', label: 'Cooking Essentials & Rice' },
];

/**
 * PantryFormModal:
 * Clean monochromatic modal for creating & editing pre-portioned recipe kit packs
 */
const PantryFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  item = null,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    portionSize: 'Pre-portioned for 1kg meat (~200g)',
    category: 'produce',
    price: '',
    inStock: true,
    isPortionKit: true,
    applicableRecipes: ['Biryani', 'Curry'],
  });

  const [images, setImages] = useState([]);
  const [customRecipe, setCustomRecipe] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        portionSize: item.portionSize || 'Pre-portioned for 1kg meat (~200g)',
        category: item.category || 'produce',
        price: item.price !== undefined ? String(item.price) : '',
        inStock: item.inStock !== undefined ? item.inStock : true,
        isPortionKit: item.isPortionKit !== undefined ? item.isPortionKit : true,
        applicableRecipes:
          Array.isArray(item.applicableRecipes) && item.applicableRecipes.length > 0
            ? item.applicableRecipes
            : ['Biryani', 'Curry'],
      });

      if (item.imageUrl) {
        setImages([{ preview: item.imageUrl, name: item.name || 'Current Item Photo' }]);
      } else {
        setImages([]);
      }
    } else {
      setFormData({
        name: '',
        portionSize: 'Pre-portioned for 1kg meat (~200g)',
        category: 'produce',
        price: '',
        inStock: true,
        isPortionKit: true,
        applicableRecipes: ['Biryani', 'Curry'],
      });
      setImages([]);
    }
    setError('');
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const toggleRecipe = (recipe) => {
    setFormData((prev) => {
      const exists = prev.applicableRecipes.includes(recipe);
      return {
        ...prev,
        applicableRecipes: exists
          ? prev.applicableRecipes.filter((r) => r !== recipe)
          : [...prev.applicableRecipes, recipe],
      };
    });
  };

  const handleAddCustomRecipe = (e) => {
    e.preventDefault();
    if (!customRecipe.trim()) return;
    const trimmed = customRecipe.trim();
    if (!formData.applicableRecipes.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        applicableRecipes: [...prev.applicableRecipes, trimmed],
      }));
    }
    setCustomRecipe('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Item name is required');
      return;
    }
    if (!formData.portionSize.trim()) {
      setError('Portion specification is required');
      return;
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      setError('Please provide a valid price');
      return;
    }
    if (formData.applicableRecipes.length === 0) {
      setError('Select at least one applicable meat recipe');
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name.trim());
    payload.append('portionSize', formData.portionSize.trim());
    payload.append('category', formData.category);
    payload.append('price', Number(formData.price));
    payload.append('inStock', formData.inStock);
    payload.append('isPortionKit', formData.isPortionKit);
    payload.append('applicableRecipes', JSON.stringify(formData.applicableRecipes));

    if (images.length > 0) {
      if (images[0].file) {
        payload.append('image', images[0].file);
      } else if (images[0].preview) {
        payload.append('imageUrl', images[0].preview);
      }
    } else {
      payload.append('imageUrl', '');
    }

    onSubmit(payload);
  };

  // Combine standard and any custom recipes present in current selection
  const allDisplayRecipes = Array.from(
    new Set([...STANDARD_RECIPES, ...(formData.applicableRecipes || [])])
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-2xl overflow-hidden text-left flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 shrink-0">
          <div>
            <h3 className="text-base font-bold text-black tracking-tight flex items-center gap-2">
              <UtensilsCrossed size={16} />
              <span>{item ? 'Edit Recipe Kit Pack' : 'Add Recipe Kit Pack'}</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Pre-portioned add-ons measured for 1kg meat recipes (Produce, Spices, Oils).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 bg-zinc-100 border border-zinc-300 rounded-xl text-xs font-medium text-black">
              {error}
            </div>
          )}

          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
              Kit Item Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Peeled Sambar Shallots or Thenga Kothu"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition"
            />
          </div>

          {/* Portion Size & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                Portion Specification *
              </label>
              <input
                type="text"
                name="portionSize"
                placeholder="e.g. Pre-portioned 200g for 1kg meat"
                value={formData.portionSize}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-black focus:bg-white transition cursor-pointer"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Stock Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                Pack Price (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-zinc-400">
                  ₹
                </span>
                <input
                  type="number"
                  name="price"
                  placeholder="35"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className="w-full pl-8 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col justify-end space-y-2 pb-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black accent-black cursor-pointer"
                />
                <span className="text-xs font-semibold text-zinc-700">
                  Currently In Stock &amp; Active
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="isPortionKit"
                  checked={formData.isPortionKit}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black accent-black cursor-pointer"
                />
                <span className="text-xs text-zinc-500">
                  Portioned specifically for 1kg meat
                </span>
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <ImageUploadField
            label="Pack Photo Preview"
            hint="Upload clear pack picture from computer (PNG, JPG, WEBP)"
            multiple={false}
            value={images}
            onChange={setImages}
            disabled={isSubmitting}
          />

          {/* Recipe Compatibility Selector */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Recipe Compatibility Tags *
              </label>
              <span className="text-[11px] font-mono text-zinc-400">
                {formData.applicableRecipes.length} recipes linked
              </span>
            </div>

            {/* Toggleable Pills */}
            <div className="flex flex-wrap gap-2">
              {allDisplayRecipes.map((recipe) => {
                const isSelected = formData.applicableRecipes.includes(recipe);
                return (
                  <button
                    key={recipe}
                    type="button"
                    onClick={() => toggleRecipe(recipe)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer select-none flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-black text-white shadow-2xs font-semibold'
                        : 'bg-white text-zinc-700 border border-zinc-200 hover:border-black hover:bg-zinc-50'
                    }`}
                  >
                    <span>{recipe}</span>
                    {isSelected && <Check size={11} strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>

            {/* Add Custom Recipe Inline */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Custom recipe name (e.g. Mutton Stew, Korma)..."
                value={customRecipe}
                onChange={(e) => setCustomRecipe(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomRecipe(e);
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition"
              />
              <button
                type="button"
                onClick={handleAddCustomRecipe}
                className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-lg transition cursor-pointer shrink-0"
              >
                + Add Tag
              </button>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 size={13} className="animate-spin" />}
            <span>{item ? 'Save Changes' : 'Create Kit Pack'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PantryFormModal;
