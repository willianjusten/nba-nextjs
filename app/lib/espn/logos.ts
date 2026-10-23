export const NBA_LOGO_URL =
  "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png";

const ESPN_IMAGE_RESIZER = "https://a.espncdn.com/combiner/i";

// The ESPN CDN resizes images server-side, so the app ships small PNGs without Next image optimization.
export function resizedImageUrl(
  imageUrl: string,
  width: number,
  height: number,
) {
  const imagePath = new URL(imageUrl).pathname;
  return `${ESPN_IMAGE_RESIZER}?img=${imagePath}&w=${width}&h=${height}`;
}

export function resizedLogoUrl(logoUrl: string, size: number) {
  return resizedImageUrl(logoUrl, size, size);
}
