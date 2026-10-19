import React, { useState, useEffect } from 'react';
import categoryService from '../services/categoryService';
import CategoryModal from '../components/CategoryModal';
import { getFullImageUrl } from '../../../../utils/imageUrl';
import {
  FolderTree,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await categoryService.getCategories(params);
      setCategories(res.categories || []);
      if (res.summary) setSummary(res.summary);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCategories();
    }, 200);
    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter]);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingCategory) {
        const id = editingCategory._id || editingCategory.id;
        const res = await categoryService.updateCategory(id, formData);
        toast.success(res.message || 'Category updated successfully');
      } else {
        const res = await categoryService.createCategory(formData);
        toast.success(res.message || 'Category created successfully');
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (cat) => {
    const id = cat._id || cat.id;
    try {
      setTogglingId(id);
      const newStatus = !cat.isActive;
      await categoryService.updateCategory(id, { isActive: newStatus });
      setCategories((prev) =>
        prev.map((c) => ((c._id || c.id) === id ? { ...c, isActive: newStatus } : c))
      );
      toast.success(`Category "${cat.name}" is now ${newStatus ? 'Active' : 'Inactive'}`);
      // Update summary counts locally
      setSummary((prev) => ({
        ...prev,
        active: newStatus ? prev.active + 1 : prev.active - 1,
        inactive: newStatus ? prev.inactive - 1 : prev.inactive + 1,
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle category status');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (cat) => {
    const id = cat._id || cat.id;
    if (!window.confirm(`Are you sure you want to permanently delete category "${cat.name}"?`)) {
      return;
    }

    try {
      const res = await categoryService.deleteCategory(id);
      toast.success(res.message || 'Category deleted');
      setCategories((prev) => prev.filter((c) => (c._id || c.id) !== id));
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-black tracking-tight flex items-center gap-2">
            <FolderTree size={20} className="text-black" />
            Category Management
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure butcher shop departments, meat classifications, and visibility.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition active:scale-[0.99] cursor-pointer"
        >
          <Plus size={15} />
          Add Category
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-zinc-200">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Total Categories</p>
          <p className="text-2xl font-black text-black mt-1">{summary.total}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-zinc-200">
          <p className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-zinc-800" /> Active in Store
          </p>
          <p className="text-2xl font-black text-black mt-1">{summary.active}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-zinc-200">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <XCircle size={13} className="text-zinc-400" /> Inactive / Hidden
          </p>
          <p className="text-2xl font-black text-black mt-1">{summary.inactive}</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-zinc-200 flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category name..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
            <Filter size={13} className="text-zinc-500" />
            <span>Filter:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-black cursor-pointer font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
          <button
            type="button"
            onClick={fetchCategories}
            title="Refresh"
            className="p-2 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-lg transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Categories Data Table */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {loading && categories.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-zinc-300 border-t-black rounded-full animate-spin"></div>
            <p className="text-xs font-medium">Loading categories catalog...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-zinc-400">
            <FolderTree size={36} className="mx-auto mb-2 text-zinc-300 stroke-[1.5]" />
            <p className="text-sm font-semibold text-zinc-800">No categories found</p>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              {search ? 'Try adjusting your search query or filter.' : 'Get started by creating your first product category.'}
            </p>
            {!search && (
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="mt-4 px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Create Category
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Description</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                  <th className="py-3.5 px-5">Created</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {categories.map((cat) => {
                  const id = cat._id || cat.id;
                  return (
                    <tr key={id} className="hover:bg-zinc-50/60 transition">
                      {/* Name & Thumbnail */}
                      <td className="py-3.5 px-5 font-medium text-zinc-900">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-center shrink-0 overflow-hidden">
                            {cat.image ? (
                              <img
                                src={getFullImageUrl(cat.image)}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <ImageIcon size={16} className="text-zinc-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-black text-xs block">{cat.name}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">ID: {String(id).slice(-6)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-5 text-zinc-500 max-w-xs truncate">
                        {cat.description || <span className="text-zinc-300 italic">No description</span>}
                      </td>

                      {/* Status Toggle Badge */}
                      <td className="py-3.5 px-5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(cat)}
                          disabled={togglingId === id}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                            cat.isActive
                              ? 'bg-zinc-100 text-zinc-900 border border-zinc-300 hover:bg-zinc-200'
                              : 'bg-white text-zinc-400 border border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              cat.isActive ? 'bg-black' : 'bg-zinc-300'
                            }`}
                          ></span>
                          {togglingId === id ? 'Updating...' : cat.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-5 text-zinc-500 text-[11px]">
                        {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-lg transition cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat)}
                          className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Create/Edit Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        category={editingCategory}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AdminCategoriesPage;
