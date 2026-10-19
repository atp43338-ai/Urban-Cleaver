import React, { useState, useEffect } from 'react';
import catalogService from '../services/catalogService';
import HeroSection from '../components/HeroSection';
import ValuePropositionBar from '../components/ValuePropositionBar';
import CategoryFilterBar from '../components/CategoryFilterBar';
import RecipeFilterBar from '../components/RecipeFilterBar';
import ProductGrid from '../components/ProductGrid';
import CleaverStandardSection from '../components/CleaverStandardSection';
import NetWeightModal from '../components/NetWeightModal';
import { Search, X, Sparkles } from 'lucide-react';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState('all');
  const [search, setSearch] = useState('');

  // Info Modal State
  const [isNetWeightModalOpen, setIsNetWeightModalOpen] = useState(false);

  // Fetch Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await catalogService.getCategories();
        setCategories(res.categories || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products whenever filters change (with debounce)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedCategory !== 'all') params.category = selectedCategory;
        if (selectedRecipe !== 'all') params.recipe = selectedRecipe;
        if (search.trim()) params.search = search.trim();

        const res = await catalogService.getProducts(params);
        setProducts(res.products || []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, 150);
    return () => clearTimeout(debounce);
  }, [selectedCategory, selectedRecipe, search]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedRecipe('all');
    setSearch('');
  };

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection onOpenStandardModal={() => setIsNetWeightModalOpen(true)} />

      {/* 2. Value Proposition Strip */}
      <ValuePropositionBar />

      {/* 3. Catalog Section */}
      <section id="cuts-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="space-y-8">
          {/* Catalog Header & Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                <Sparkles size={13} className="text-black" />
                <span>Morning Batch Inventory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Fresh Cuts Prepared for Your Recipe
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Selected from 100% antibiotic-free farm livestock. Zero waste, precision-sliced to order.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search cuts (e.g. biryani, boneless)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-8 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:bg-white transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black p-0.5 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Department Category Filter Bar */}
          <CategoryFilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Dish / Recipe-Based Purpose Filter Bar */}
          <RecipeFilterBar
            selectedRecipe={selectedRecipe}
            onSelectRecipe={setSelectedRecipe}
            totalCount={products.length}
          />

          {/* Products Grid */}
          <ProductGrid
            products={products}
            loading={loading}
            onResetFilters={handleResetFilters}
            onOpenStandardModal={() => setIsNetWeightModalOpen(true)}
          />
        </div>
      </section>

      {/* 4. The Cleaver Standard Comparative Section */}
      <CleaverStandardSection onOpenStandardModal={() => setIsNetWeightModalOpen(true)} />

      {/* 5. 100% Net Usable Weight Transparency Modal */}
      <NetWeightModal
        isOpen={isNetWeightModalOpen}
        onClose={() => setIsNetWeightModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
