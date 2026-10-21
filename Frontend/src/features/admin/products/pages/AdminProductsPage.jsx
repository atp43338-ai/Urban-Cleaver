import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import categoryService from '../../categories/services/categoryService';
import cutService from '../../cuts/services/cutService';
import ProductModal from '../components/ProductModal';
import CutModal from '../../cuts/components/CutModal';
import { getFullImageUrl } from '../../../../utils/imageUrl';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Layers,
  Scissors,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cuts, setCuts] = useState([]);
  const [summary, setSummary] = useState({ total: 0, inStock: 0, outOfStock: 0 });
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    totalProducts: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Product Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // Cut Modal
  const [isCutModalOpen, setIsCutModalOpen] = useState(false);
  const [isSubmittingCut, setIsSubmittingCut] = useState(false);

  // Fetch Categories for dropdown filter & modal
  const fetchCategoriesList = async () => {
    try {
      const res = await categoryService.getCategories();
      setCategories(res.categories || []);
    } catch (err) {
      console.error('Failed to load categories dropdown:', err);
    }
  };

  // Fetch Cuts for modal & tags
  const fetchCutsList = async () => {
    try {
      const res = await cutService.getCuts();
      setCuts(res.cuts || []);
    } catch (err) {
      console.error('Failed to load cuts:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
      };
      if (search.trim()) params.search = search.trim();
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (stockFilter !== 'all') params.stockStatus = stockFilter;

      const res = await productService.getProducts(params);
      setProducts(res.products || []);
      if (res.summary) setSummary(res.summary);
      if (res.pagination) setPagination(res.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesList();
    fetchCutsList();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, stockFilter]);

  // Debounced fetch on filter/page changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 200);
    return () => clearTimeout(delayDebounce);
  }, [search, categoryFilter, stockFilter, page]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingProduct) {
        const id = editingProduct._id || editingProduct.id;
        const res = await productService.updateProduct(id, formData);
        toast.success(res.message || 'Product updated successfully');
      } else {
        const res = await productService.createProduct(formData);
        toast.success(res.message || 'Product created successfully');
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add Cut Submit handler
  const handleCutSubmit = async (cutData) => {
    try {
      setIsSubmittingCut(true);
      const res = await cutService.createCut(cutData);
      toast.success(res.message || `Cut "${res.cut?.name}" created successfully`);
      setIsCutModalOpen(false);
      fetchCutsList();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create cut');
    } finally {
      setIsSubmittingCut(false);
    }
  };

  const handleToggleStock = async (prod) => {
    const id = prod._id || prod.id;
    try {
      setTogglingId(id);
      const newStatus = !prod.isStock;
      await productService.updateProduct(id, { isStock: newStatus });
      setProducts((prev) =>
        prev.map((p) => ((p._id || p.id) === id ? { ...p, isStock: newStatus } : p))
      );
      toast.success(
        `"${prod.name}" marked as ${newStatus ? 'In Stock' : 'Out of Stock'}`
      );
      setSummary((prev) => ({
        ...prev,
        inStock: newStatus ? prev.inStock + 1 : prev.inStock - 1,
        outOfStock: newStatus ? prev.outOfStock - 1 : prev.outOfStock + 1,
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle stock status');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (prod) => {
    const id = prod._id || prod.id;
    if (!window.confirm(`Are you sure you want to delete product "${prod.name}"?`)) {
      return;
    }

    try {
      const res = await productService.deleteProduct(id);
      toast.success(res.message || 'Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-black tracking-tight flex items-center gap-2">
            <Package size={20} className="text-black" />
            Butcher Product Management
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage fresh cuts, gross vs. net weights, culinary cut variations, and real-time inventory.
          </p>
        </div>

        {/* Action Buttons: Add Cut + Add Product */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsCutModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 rounded-lg text-xs font-semibold transition active:scale-[0.99] cursor-pointer shadow-xs"
          >
            <Scissors size={14} />
            Add Cut
          </button>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition active:scale-[0.99] cursor-pointer shadow-xs"
          >
            <Plus size={15} />
            Add Product
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-zinc-200">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Total Products</p>
          <p className="text-2xl font-black text-black mt-1">{summary.total}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-zinc-200">
          <p className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-zinc-800" /> In Stock (Available)
          </p>
          <p className="text-2xl font-black text-black mt-1">{summary.inStock}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-zinc-200">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <XCircle size={13} className="text-zinc-400" /> Out of Stock
          </p>
          <p className="text-2xl font-black text-black mt-1">{summary.outOfStock}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-zinc-200">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
            <Scissors size={13} className="text-zinc-500" /> Active Cuts ({cuts.length})
          </p>
          <p className="text-2xl font-black text-black mt-1">{cuts.length}</p>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-zinc-200 flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product name..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-black cursor-pointer font-medium"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="h-9 px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-black cursor-pointer font-medium"
          >
            <option value="all">All Inventory</option>
            <option value="in_stock">In Stock Only</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          <button
            type="button"
            onClick={fetchProducts}
            className="h-9 px-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Weights</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Cut Types</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-xs">
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-zinc-400">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-zinc-400" />
                    <span>Loading butchery inventory...</span>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-zinc-400">
                    <Package size={28} className="mx-auto mb-2 opacity-40" />
                    <p className="font-medium text-black">No butchery products found</p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Try adjusting search filters or create a new product above.
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const id = prod._id || prod.id;
                  const firstImg =
                    Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : null;

                  return (
                    <tr key={id} className="hover:bg-zinc-50/70 transition">
                      {/* Name & Photo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0">
                            {firstImg ? (
                              <img
                                src={getFullImageUrl(firstImg)}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon size={16} className="text-zinc-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-black block text-xs">
                              {prod.name}
                            </span>
                            <span className="text-[11px] text-zinc-400 font-mono">
                              SKU #UC-{(id || '').slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-zinc-100 text-zinc-700">
                          {prod.category?.name || 'Unassigned'}
                        </span>
                      </td>

                      {/* Weights */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-600">
                        <div>Gross: <span className="text-black font-semibold">{prod.grossWeight || '1000g'}</span></div>
                        <div className="text-[10px] text-zinc-500 font-medium">Net: {prod.netWeight || '1000g'}</div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-mono font-bold text-black text-xs">
                        ₹{Number(prod.price).toFixed(2)}
                      </td>

                      {/* Available Cuts */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {Array.isArray(prod.cutTypes) && prod.cutTypes.length > 0 ? (
                            prod.cutTypes.map((c, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 font-medium"
                              >
                                {c}
                              </span>
                            ))
                          ) : (
                            <span className="text-zinc-400 text-[11px]">Standard</span>
                          )}
                        </div>
                      </td>

                      {/* Stock Switch */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStock(prod)}
                          disabled={togglingId === id}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                            prod.isStock
                              ? 'bg-zinc-100 text-black border border-zinc-300 hover:bg-zinc-200'
                              : 'bg-zinc-50 text-zinc-400 border border-zinc-200 hover:bg-zinc-100'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              prod.isStock ? 'bg-black' : 'bg-zinc-400'
                            }`}
                          />
                          <span>{prod.isStock ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(prod)}
                            className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(prod)}
                            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs">
            <span className="text-zinc-500 font-mono">
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.totalProducts} items)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
                className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNextPage}
                className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        product={editingProduct}
        categories={categories}
        cuts={cuts}
        onOpenAddCutModal={() => setIsCutModalOpen(true)}
        isSubmitting={isSubmitting}
      />

      {/* Dynamic Cut Creation Modal */}
      <CutModal
        isOpen={isCutModalOpen}
        onClose={() => setIsCutModalOpen(false)}
        onSubmit={handleCutSubmit}
        isSubmitting={isSubmittingCut}
      />
    </div>
  );
};

export default AdminProductsPage;
