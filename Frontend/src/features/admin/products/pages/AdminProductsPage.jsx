import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import categoryService from '../../categories/services/categoryService';
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
  UtensilsCrossed,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCutModalOpen, setIsCutModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // Fetch Categories for dropdown filter & modal
  const fetchCategoriesList = async () => {
    try {
      const res = await categoryService.getCategories();
      setCategories(res.categories || []);
    } catch (err) {
      console.error('Failed to load categories dropdown:', err);
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

        <div className="flex items-center gap-2">
          {/* Add Cut Button */}
          <button
            type="button"
            onClick={() => setIsCutModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg text-xs font-semibold transition active:scale-[0.99] cursor-pointer shadow-xs"
          >
            <UtensilsCrossed size={14} />
            Add Cut
          </button>

          {/* Add Product Button */}
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition active:scale-[0.99] cursor-pointer"
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
            <Layers size={13} className="text-zinc-500" /> Active Categories
          </p>
          <p className="text-2xl font-black text-black mt-1">{categories.length}</p>
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
            <option value="inStock">In Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>

          <button
            type="button"
            onClick={fetchProducts}
            title="Refresh Table"
            className="p-2 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-lg transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Product Data Table */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {loading && products.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-zinc-300 border-t-black rounded-full animate-spin"></div>
            <p className="text-xs font-medium">Loading butchery catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-zinc-400">
            <Package size={36} className="mx-auto mb-2 text-zinc-300 stroke-[1.5]" />
            <p className="text-sm font-semibold text-zinc-800">No butchery products found</p>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              {search || categoryFilter !== 'all' || stockFilter !== 'all'
                ? 'Try adjusting your search criteria or filter selections.'
                : 'Get started by adding your first fresh cut product.'}
            </p>
            {!search && categoryFilter === 'all' && (
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="mt-4 px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Add First Product
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  <th className="py-3.5 px-5">Product &amp; Cut</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Price</th>
                  <th className="py-3.5 px-5">Weight (Gross / Net)</th>
                  <th className="py-3.5 px-5">Cut Options</th>
                  <th className="py-3.5 px-5 text-center">Stock</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.map((prod) => {
                  const id = prod._id || prod.id;
                  const thumb = Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : null;

                  return (
                    <tr key={id} className="hover:bg-zinc-50/60 transition">
                      {/* Name & Thumbnail */}
                      <td className="py-3.5 px-5 font-medium text-zinc-900">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-center shrink-0 overflow-hidden">
                            {thumb ? (
                              <img
                                src={getFullImageUrl(thumb)}
                                alt={prod.name}
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
                            <span className="font-semibold text-black text-xs block">{prod.name}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">ID: {String(id).slice(-6)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {prod.category?.name || 'Unassigned'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-5 font-bold text-black font-mono text-sm">
                        ₹{Number(prod.price).toFixed(2)}
                      </td>

                      {/* Weight Breakdown */}
                      <td className="py-3.5 px-5">
                        <div className="flex flex-col gap-0.5 text-[11px]">
                          <span className="text-zinc-600 font-medium">
                            Gross: <strong className="font-mono text-zinc-900">{prod.grossWeight}</strong>
                          </span>
                          <span className="text-zinc-500">
                            Net: <strong className="font-mono text-black bg-zinc-100 px-1 py-0.5 rounded border border-zinc-200">{prod.netWeight}</strong>
                          </span>
                        </div>
                      </td>

                      {/* Cut Types */}
                      <td className="py-3.5 px-5 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(prod.cutTypes) && prod.cutTypes.length > 0 ? (
                            prod.cutTypes.slice(0, 3).map((cut, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-medium bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded border border-zinc-200"
                              >
                                {cut}
                              </span>
                            ))
                          ) : (
                            <span className="text-zinc-300 italic text-[11px]">Standard</span>
                          )}
                          {prod.cutTypes?.length > 3 && (
                            <span className="text-[10px] text-zinc-400 self-center">
                              +{prod.cutTypes.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock Toggle Badge */}
                      <td className="py-3.5 px-5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStock(prod)}
                          disabled={togglingId === id}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                            prod.isStock
                              ? 'bg-zinc-100 text-zinc-900 border border-zinc-300 hover:bg-zinc-200'
                              : 'bg-white text-zinc-400 border border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              prod.isStock ? 'bg-black' : 'bg-zinc-300'
                            }`}
                          ></span>
                          {togglingId === id ? '...' : prod.isStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-lg transition cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(prod)}
                          className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition cursor-pointer"
                          title="Delete Product"
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

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs text-zinc-600">
            <span>
              Showing page <strong className="text-black">{pagination.page}</strong> of{' '}
              <strong className="text-black">{pagination.totalPages}</strong> ({pagination.totalProducts} products)
            </span>

            <div className="flex items-center gap-2">
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
        isSubmitting={isSubmitting}
      />

      {/* Cut Modal */}
      <CutModal
        isOpen={isCutModalOpen}
        onClose={() => setIsCutModalOpen(false)}
        onSuccess={() => {
          fetchProducts();
        }}
      />
    </div>
  );
};

export default AdminProductsPage;
