import React, { useState, useEffect, useCallback } from 'react';
import pantryAdminService from '../services/pantryAdminService';
import PantryFormModal from '../components/PantryFormModal';
import { getFullImageUrl } from '../../../utils/imageUrl';
import {
  UtensilsCrossed,
  Plus,
  Search,
  X,
  Edit3,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Package,
  Layers,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'produce', label: 'Produce' },
  { id: 'spices', label: 'Spices' },
  { id: 'dairy_oils', label: 'Dairy & Oils' },
  { id: 'essentials', label: 'Essentials' },
];

const RECIPE_FILTERS = [
  { id: 'all', label: 'All Recipes' },
  { id: 'Biryani', label: 'Biryani' },
  { id: 'Beef Roast', label: 'Beef Roast' },
  { id: 'Beef Fry', label: 'Beef Fry' },
  { id: 'Curry', label: 'Curry' },
  { id: 'Mandi', label: 'Mandi' },
];

/**
 * PantryManagementPage:
 * Admin portal module for managing pre-portioned recipe kits & cooking add-ons.
 */
const PantryManagementPage = () => {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ totalItems: 0, inStock: 0, outOfStock: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [recipeFilter, setRecipeFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation State
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Items
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (recipeFilter !== 'all') params.recipe = recipeFilter;
      if (stockFilter !== 'all') params.inStock = stockFilter === 'inStock';

      const res = await pantryAdminService.getAllPantryItems(params);
      setItems(res.items || []);
      if (res.summary) setSummary(res.summary);
    } catch (err) {
      console.error('Failed to fetch pantry items:', err);
      toast.error('Failed to load pantry items');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, recipeFilter, stockFilter]);

  useEffect(() => {
    const debounce = setTimeout(fetchItems, 180);
    return () => clearTimeout(debounce);
  }, [fetchItems]);

  // Handle Create / Update Submit
  const handleFormSubmit = async (payload) => {
    try {
      setIsSubmitting(true);
      if (editingItem) {
        await pantryAdminService.updatePantryItem(editingItem._id, payload);
        toast.success(`Updated "${payload.get('name')}" successfully`);
      } else {
        await pantryAdminService.createPantryItem(payload);
        toast.success(`Created "${payload.get('name')}" successfully`);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      console.error('Error saving pantry item:', err);
      toast.error(err.response?.data?.message || 'Failed to save pantry item');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle 1-Click Stock Toggle
  const handleToggleStock = async (item) => {
    try {
      // Optimistic update
      setItems((prev) =>
        prev.map((it) => (it._id === item._id ? { ...it, inStock: !it.inStock } : it))
      );

      const res = await pantryAdminService.toggleStockStatus(item._id);
      toast.success(
        `"${item.name}" is now ${res.item.inStock ? 'In Stock' : 'Out of Stock'}`
      );
      if (res.summary) setSummary(res.summary);
    } catch (err) {
      console.error('Failed to toggle stock status:', err);
      toast.error('Failed to update stock status');
      fetchItems(); // revert
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    try {
      setIsDeleting(true);
      await pantryAdminService.deletePantryItem(deletingItem._id);
      toast.success(`Deleted "${deletingItem.name}"`);
      setDeletingItem(null);
      fetchItems();
    } catch (err) {
      console.error('Failed to delete item:', err);
      toast.error(err.response?.data?.message || 'Failed to delete pantry item');
    } finally {
      setIsDeleting(false);
    }
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'produce':
        return 'Produce (Fresh)';
      case 'spices':
        return 'Spices & Potli';
      case 'dairy_oils':
        return 'Dairy & Oils';
      case 'essentials':
        return 'Essentials';
      default:
        return cat;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Add Kit Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight">
              Pantry &amp; Recipe Kits
            </h1>
            <span className="text-[11px] font-mono uppercase bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded text-zinc-600 font-semibold">
              Pre-Portioned
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Pre-measured aromatics, spices, ghee, and accompaniments tailored for 1kg meat recipes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs active:scale-[0.99] shrink-0"
        >
          <Plus size={15} />
          <span>Add Recipe Kit Pack</span>
        </button>
      </div>

      {/* 2. Metrics / Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-zinc-200 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Total Recipe Packs
            </span>
            <div className="text-xl font-mono font-black text-black">
              {summary.totalItems}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-black flex items-center justify-center">
            <Package size={16} />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Active In Stock
            </span>
            <div className="text-xl font-mono font-black text-black">
              {summary.inStock}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-black flex items-center justify-center">
            <Check size={16} />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Out of Stock
            </span>
            <div className="text-xl font-mono font-black text-black">
              {summary.outOfStock}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-400 flex items-center justify-center">
            <AlertCircle size={16} />
          </div>
        </div>
      </div>

      {/* 3. Search & Multi-level Filter Controls */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Quick Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by pack name, portion, or recipe..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-8 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Stock Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500 whitespace-nowrap">
              Stock:
            </span>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-black focus:bg-white transition cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="inStock">In Stock Only</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Recipe Filter Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-100">
          {/* Category Pill Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-black text-white font-semibold shadow-2xs'
                      : 'bg-zinc-50 text-zinc-600 border border-zinc-200 hover:border-black hover:text-black hover:bg-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Recipe Select Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold text-zinc-500 whitespace-nowrap">
              Target Recipe:
            </span>
            <select
              value={recipeFilter}
              onChange={(e) => setRecipeFilter(e.target.value)}
              className="h-8 px-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-black focus:bg-white transition cursor-pointer"
            >
              {RECIPE_FILTERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Clean Monochrome Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 size={24} className="animate-spin text-black" />
            <p className="text-xs text-zinc-500">Loading recipe kits...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
              <Package size={20} />
            </div>
            <h3 className="text-sm font-bold text-black">No pantry kit items found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {search || categoryFilter !== 'all' || recipeFilter !== 'all'
                ? 'Try clearing active search or category filters.'
                : 'Click "Add Recipe Kit Pack" above to configure your first pre-portioned add-on.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Recipe Kit Item</th>
                  <th className="py-3 px-4">Portion Specs</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Applicable Recipes</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-center">In-Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {items.map((item) => {
                  const imageSrc = item.imageUrl ? getFullImageUrl(item.imageUrl) : null;
                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-zinc-50/70 transition-colors group"
                    >
                      {/* Item Thumbnail & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0">
                            {imageSrc ? (
                              <img
                                src={imageSrc}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <ImageIcon size={18} className="text-zinc-300" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-black block truncate max-w-xs">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-400">
                              #{(item._id || '').slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Portion Specs */}
                      <td className="py-3.5 px-4 font-medium text-zinc-700">
                        <span className="block max-w-xs truncate">{item.portionSize}</span>
                        {item.isPortionKit && (
                          <span className="text-[10px] text-zinc-400 font-mono block">
                            Standard 1kg portion
                          </span>
                        )}
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded text-[11px] font-semibold border border-zinc-200">
                          {getCategoryBadge(item.category)}
                        </span>
                      </td>

                      {/* Applicable Recipe Tags */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {Array.isArray(item.applicableRecipes) &&
                          item.applicableRecipes.length > 0 ? (
                            item.applicableRecipes.map((r, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] font-medium bg-white text-zinc-700 border border-zinc-200"
                              >
                                {r}
                              </span>
                            ))
                          ) : (
                            <span className="text-zinc-400 text-[11px]">Any recipe</span>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-mono font-black text-black text-sm">
                          ₹{Number(item.price).toFixed(2)}
                        </span>
                      </td>

                      {/* In-Stock Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStock(item)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            item.inStock ? 'bg-black' : 'bg-zinc-200'
                          }`}
                          title={`Click to mark as ${
                            item.inStock ? 'Out of Stock' : 'In Stock'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                              item.inStock ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem(item);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-lg transition cursor-pointer"
                            title="Edit Item"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingItem(item)}
                            className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Create / Edit Modal */}
      <PantryFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleFormSubmit}
        item={editingItem}
        isSubmitting={isSubmitting}
      />

      {/* 6. Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl max-w-sm w-full p-6 text-left space-y-4">
            <div className="w-10 h-10 rounded-full bg-zinc-100 text-black flex items-center justify-center">
              <Trash2 size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-black tracking-tight">
                Delete Recipe Kit Item?
              </h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Are you sure you want to remove{' '}
                <strong className="text-black">&ldquo;{deletingItem.name}&rdquo;</strong>? This
                action cannot be undone and will remove it from all matching recipe suggestions.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isDeleting && <Loader2 size={13} className="animate-spin" />}
                <span>Delete Pack</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PantryManagementPage;
