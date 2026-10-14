// Imágenes de producto: redimensionado server-side vía Supabase Image
// Transformations. WebP + quality 75 recorta ~60% extra frente al PNG.
// resize=contain + height=width mantiene la proporción sin recortar (el modo
// por defecto, cover, recorta a una franja cuando sólo se manda width).
// Las URLs que no son de Storage vuelven intactas.
export const productImageUrl = (url: string, width = 800): string => {
  if (!url) return url;
  const marker = '/storage/v1/object/public/';
  const i = url.indexOf(marker);
  if (i === -1) return url;
  const sep = url.includes('?') ? '&' : '?';
  return (
    url.slice(0, i) +
    '/storage/v1/render/image/public/' +
    url.slice(i + marker.length) +
    `${sep}width=${width}&height=${width}&resize=contain&quality=75&format=webp`
  );
};
