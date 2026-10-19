import React, { useRef, useState } from 'react';
import { UploadCloud, X, RefreshCw, Image as ImageIcon, Plus } from 'lucide-react';
import { getFullImageUrl } from '../../../utils/imageUrl';

const ImageUploadField = ({
  label = 'Upload Image',
  hint = 'PNG, JPG, WEBP up to 10MB',
  multiple = false,
  value = [], // Array of { file?: File, preview: string, isExisting?: boolean }
  onChange,
  disabled = false,
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const validFiles = Array.from(fileList).filter((file) =>
      file.type.startsWith('image/')
    );

    if (validFiles.length === 0) return;

    const newItems = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
    }));

    if (multiple) {
      onChange([...(value || []), ...newItems]);
    } else {
      onChange([newItems[0]]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    processFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e) => {
    processFiles(e.target.files);
    // Reset input so re-selecting same file triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (indexToRemove) => {
    const updated = (value || []).filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const hasImages = Array.isArray(value) && value.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          {label}
        </label>
        {hint && <span className="text-[11px] text-zinc-400">{hint}</span>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        multiple={multiple}
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
      />

      {/* When no images uploaded or when in multiple mode with room for more */}
      {(!hasImages || multiple) && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border border-dashed rounded-xl p-4 sm:p-5 text-center transition cursor-pointer select-none ${
            isDragging
              ? 'border-black bg-zinc-100'
              : 'border-zinc-300 hover:border-black bg-zinc-50 hover:bg-zinc-100/60'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center justify-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 shadow-xs">
              <UploadCloud size={18} strokeWidth={1.75} />
            </div>
            <p className="text-xs text-zinc-700">
              <span className="font-semibold text-black underline underline-offset-2">
                Click to browse
              </span>{' '}
              or drag & drop {multiple ? 'images' : 'an image'}
            </p>
            <p className="text-[11px] text-zinc-400">
              High resolution photos from your computer
            </p>
          </div>
        </div>
      )}

      {/* Previews Container */}
      {hasImages && (
        <div className="space-y-2 pt-1">
          {!multiple ? (
            /* Single image preview mode (Category) */
            <div className="flex items-center gap-3 p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl">
              <div className="w-14 h-14 rounded-lg border border-zinc-200 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src={getFullImageUrl(value[0].preview || value[0])}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-black truncate">
                  {value[0].name || (typeof value[0] === 'string' ? 'Current Image' : 'Selected Image')}
                </p>
                <p className="text-[11px] text-zinc-400">
                  {value[0].size || 'Ready for upload'}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:text-black bg-white border border-zinc-200 hover:border-zinc-300 rounded-lg transition cursor-pointer"
                  title="Change image"
                >
                  <RefreshCw size={12} /> Change
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(0)}
                  disabled={disabled}
                  className="p-1 text-zinc-400 hover:text-black hover:bg-zinc-200 rounded-lg transition cursor-pointer"
                  title="Remove image"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          ) : (
            /* Multiple image preview mode (Product) */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {value.map((item, idx) => {
                const src = getFullImageUrl(item.preview || item);
                const name = item.name || `Image #${idx + 1}`;
                return (
                  <div
                    key={idx}
                    className="relative group rounded-lg border border-zinc-200 bg-white overflow-hidden aspect-square flex items-center justify-center"
                  >
                    <img
                      src={src}
                      alt={name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-1">
                      <button
                        type="button"
                        onClick={() => handleRemove(idx)}
                        disabled={disabled}
                        className="p-1.5 bg-white text-black hover:bg-zinc-100 rounded-full shadow-sm transition cursor-pointer"
                        title="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    {/* Badge if primary */}
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-black/75 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">
                        Primary
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
