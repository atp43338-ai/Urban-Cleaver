import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Check, ZoomIn } from 'lucide-react';
import { getFullImageUrl } from '@/utils/imageUrl';

/**
 * ProductGallery:
 * Monochromatic high-contrast image gallery with primary preview,
 * batch fresh indicator, and thumbnail strip.
 */
const ProductGallery = ({ images = [], productName = 'Product Cut', isStock = true }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Normalize image URLs
  const normalizedImages = Array.isArray(images) && images.length > 0
    ? images.map((img) => getFullImageUrl(img))
    : [];

  const activeImage = normalizedImages[selectedIdx] || null;

  return (
    <div className="space-y-3">
      {/* Primary Preview Frame */}
      <div className="relative w-full aspect-4/3 rounded-2xl bg-zinc-100 border border-zinc-200 overflow-hidden group select-none flex items-center justify-center">
        {activeImage ? (
          <img
            src={activeImage}
            alt={productName}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-400 p-8 text-center">
            <ImageIcon size={48} className="mb-2 stroke-1" />
            <span className="text-xs font-mono">Precision Butchery Cut</span>
          </div>
        )}

        {/* Micro Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="bg-white/95 backdrop-blur-xs text-black border border-zinc-200 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={11} className="text-black" />
            Morning Butchery Batch
          </span>
          <span className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
            100% Net Usable Meat
          </span>
        </div>

        {/* Stock Status Watermark */}
        {!isStock && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="text-sm font-bold text-white uppercase tracking-wider bg-black/90 px-4 py-2 rounded-lg border border-zinc-700">
              Sold Out for Today
            </span>
          </div>
        )}

        {/* Zoom Hint Icon */}
        {activeImage && (
          <button
            type="button"
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-black p-2 rounded-lg border border-zinc-200 opacity-80 group-hover:opacity-100 transition shadow-xs cursor-pointer"
            title={isZoomed ? 'Zoom Out' : 'Zoom In'}
          >
            <ZoomIn size={14} />
          </button>
        )}
      </div>

      {/* Thumbnails Strip */}
      {normalizedImages.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {normalizedImages.map((img, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedIdx(idx);
                  setIsZoomed(false);
                }}
                className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'border-black ring-1 ring-black'
                    : 'border-zinc-200 hover:border-zinc-400 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
