/**
 * Helper to get full image URL whether it is a local upload path (/uploads/...),
 * an external URL (https://...), a blob URL (blob:...) or data URL (data:...)
 */
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('blob:') ||
    imagePath.startsWith('data:')
  ) {
    return imagePath;
  }

  const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const serverOrigin = rawBase.replace(/\/api\/?$/, '');
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${serverOrigin}${cleanPath}`;
};

export default getFullImageUrl;
