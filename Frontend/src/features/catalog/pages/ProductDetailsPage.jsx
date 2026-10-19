import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import catalogService from '../services/catalogService';
import ProductGallery from '../components/pdp/ProductGallery';
import CutSelectorSection from '../components/pdp/CutSelectorSection';
import CutAnatomyCard from '../components/pdp/CutAnatomyCard';
import ServingsCalculator from '../components/pdp/ServingsCalculator';
import NetWeightAssuranceCard from '../components/pdp/NetWeightAssuranceCard';
import ChefPairingsSection from '../components/pdp/ChefPairingsSection';
import FreshnessStamp from '../components/pdp/FreshnessStamp';
import NetWeightModal from '../components/NetWeightModal';
import ProductCard from '../components/ProductCard';
import {
  ChevronRight,
  ShoppingBag,
  Minus,
  Plus,
  Scale,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User selections
  const [selectedCut, setSelectedCut] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isNetWeightModalOpen, setIsNetWeightModalOpen] = useState(false);

  // Fetch product detail
  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const res = await catalogService.getProductById(id);
        if (isMounted && res.product) {
          setProduct(res.product);

          const defaultCut =
            Array.isArray(res.product.cutTypes) && res.product.cutTypes.length > 0
              ? res.product.cutTypes[0]
              : 'Biryani Cut';
          setSelectedCut(defaultCut);

          // Fetch related cuts in same category
          if (res.product.category?._id) {
            const relRes = await catalogService.getProducts({
              category: res.product.category._id,
              limit: 4,
            });
            if (isMounted) {
              setRelatedProducts(
                (relRes.products || []).filter((p) => p._id !== id)
              );
            }
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        if (isMounted) {
          setError(err.response?.data?.message || 'Product not found or currently unavailable.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleApplyCalculatedQuantity = ({ people, totalKg, packs }) => {
    setQuantity(packs);
    toast.success(
      `Calibrated for ${people} people: Added ${packs} ${
        packs === 1 ? 'pack' : 'packs'
      } (~${totalKg}kg net meat) of ${selectedCut} to your bag!`
    );
  };

  const handleAddWithPairings = ({ meatProduct, meatQuantity, selectedCut, addons, grandTotal }) => {
    toast.success(
      `Added ${meatQuantity}x ${meatProduct} (${selectedCut}) + ${addons.length} pairings to your bag! Total: ₹${grandTotal.toFixed(
        2
      )}`
    );
  };

  const handleAddToCart = () => {
    if (!product?.isStock) return;
    toast.success(
      `Added ${quantity}x ${product.name} (${selectedCut} - ${product.netWeight}) to your bag!`
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
          <div className="h-4 bg-zinc-100 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div className="w-full aspect-4/3 bg-zinc-100 rounded-2xl"></div>
              <div className="h-28 bg-zinc-100 rounded-2xl"></div>
            </div>
            <div className="lg:col-span-6 space-y-4">
              <div className="h-6 bg-zinc-100 rounded w-1/3"></div>
              <div className="h-10 bg-zinc-100 rounded w-3/4"></div>
              <div className="h-20 bg-zinc-100 rounded"></div>
              <div className="h-32 bg-zinc-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="bg-white min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center space-y-4 p-8 border border-zinc-200 rounded-2xl bg-zinc-50">
          <div className="w-12 h-12 rounded-full bg-zinc-200 text-black flex items-center justify-center mx-auto font-bold text-lg">
            !
          </div>
          <h2 className="text-xl font-bold text-black">Product Cut Unavailable</h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            {error || 'The requested butchery cut could not be retrieved from our morning inventory.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl transition hover:bg-zinc-800 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Return to Catalog</span>
          </button>
        </div>
      </div>
    );
  }

  // Parse weight numbers if present
  const packWeightGrams = product.netWeight?.includes('1000')
    ? 1000
    : product.netWeight?.includes('500')
    ? 500
    : 1000;

  const totalPrice = (Number(product.price || 0) * quantity).toFixed(2);

  return (
    <div className="bg-white text-zinc-900 min-h-screen pb-20">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-zinc-100 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-1.5 text-xs text-zinc-500 overflow-x-auto scrollbar-none">
            <Link to="/" className="hover:text-black transition shrink-0">
              Home
            </Link>
            <ChevronRight size={12} className="shrink-0 text-zinc-400" />
            <Link
              to={`/?category=${product.category?._id || 'all'}`}
              className="hover:text-black transition shrink-0"
            >
              {product.category?.name || 'Artisanal Cuts'}
            </Link>
            <ChevronRight size={12} className="shrink-0 text-zinc-400" />
            <span className="font-semibold text-black truncate max-w-xs sm:max-w-md">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-6 space-y-6">
            {/* Gallery */}
            <ProductGallery
              images={product.images}
              productName={product.name}
              isStock={product.isStock}
            />

            {/* Freshness Certificate & Cold Chain Stamp */}
            <FreshnessStamp />

            {/* 100% Net Usable Weight Verification Card */}
            <NetWeightAssuranceCard
              grossWeight={product.grossWeight}
              netWeight={product.netWeight}
              onOpenModal={() => setIsNetWeightModalOpen(true)}
            />
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="lg:col-span-6 space-y-6">
            {/* Title & Category Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                  {product.category?.name || 'Department Cut'}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  SKU #UC-{(product._id || '').slice(-6).toUpperCase()}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight">
                {product.name}
              </h1>

              {product.description && (
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Pricing Block */}
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                  Pan-Ready Usable Price
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-black font-mono">
                    ₹{Number(product.price).toFixed(2)}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    / {product.netWeight || '1000g net usable'}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-200">
                <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold text-black">
                  <Scale size={13} />
                  <span>100% Edible Yield</span>
                </div>
                <span className="text-[11px] text-zinc-500 block">
                  Gross: {product.grossWeight || '1000g'} &bull; 0% dressing waste
                </span>
              </div>
            </div>

            {/* 1. Cut Selector Section */}
            <CutSelectorSection
              cutTypes={product.cutTypes}
              selectedCut={selectedCut}
              onSelectCut={setSelectedCut}
            />

            {/* 2. Culinary Cut Breakdown & Anatomy (The Butcher's Guide) */}
            <CutAnatomyCard selectedCut={selectedCut} />

            {/* 3. Interactive Servings & Quantity Estimator */}
            <ServingsCalculator
              recipeName={selectedCut || product.name}
              packWeightGrams={packWeightGrams}
              unitPrice={Number(product.price || 0)}
              onApplyCalculatedQuantity={handleApplyCalculatedQuantity}
            />

            {/* 4. Chef's Pairing & Spice Kit (1-Click Add-on Drawer) */}
            <ChefPairingsSection
              meatProductName={product.name}
              meatPrice={Number(product.price || 0)}
              meatQuantity={quantity}
              selectedCut={selectedCut}
              onAddWithPairings={handleAddWithPairings}
            />

            {/* 5. Primary Quantity & Direct Add to Bag CTA */}
            <div className="p-5 bg-white border-2 border-black rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                    Pack Quantity
                  </span>
                  <span className="text-xs font-bold text-black">
                    {quantity} {quantity === 1 ? 'Pack' : 'Packs'} ({quantity * (packWeightGrams / 1000)} kg Net Usable)
                  </span>
                </div>

                {/* Counter */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    disabled={quantity <= 1 || !product.isStock}
                    className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:border-black hover:text-black transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Decrease packs"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-8 text-center text-xs font-bold font-mono text-black">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => quantity < 20 && setQuantity(quantity + 1)}
                    disabled={quantity >= 20 || !product.isStock}
                    className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:border-black hover:text-black transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Increase packs"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.isStock}
                className={`w-full h-12 rounded-xl text-xs font-bold transition flex items-center justify-between px-5 active:scale-[0.99] cursor-pointer ${
                  product.isStock
                    ? 'bg-black hover:bg-zinc-800 text-white shadow-md'
                    : 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag size={15} />
                  <span>
                    {product.isStock
                      ? `Add ${quantity}x ${selectedCut} to Bag`
                      : 'Currently Out of Stock'}
                  </span>
                </div>
                {product.isStock && (
                  <span className="font-mono text-xs font-black">₹{totalPrice}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ================= RELATED CUTS SECTION ================= */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-zinc-200 space-y-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                <Sparkles size={12} className="text-black" />
                <span>Pair with Other Cuts</span>
              </div>
              <h3 className="text-xl font-black text-black tracking-tight">
                More from {product.category?.name || 'Urban Cleaver'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onOpenStandardModal={() => setIsNetWeightModalOpen(true)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 100% Net Weight Standard Modal */}
      <NetWeightModal
        isOpen={isNetWeightModalOpen}
        onClose={() => setIsNetWeightModalOpen(false)}
      />
    </div>
  );
};

export default ProductDetailsPage;
