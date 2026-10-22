const ESPN_IMAGE_RESIZER = "https://a.espncdn.com/combiner/i";

// The ESPN CDN resizes logos server-side, so the app ships small PNGs without Next image optimization.
export function resizedLogoUrl(logoUrl: string, size: number) {
  const imagePath = new URL(logoUrl).pathname;
  return `${ESPN_IMAGE_RESIZER}?img=${imagePath}&w=${size}&h=${size}`;
}
