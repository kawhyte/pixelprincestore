export const ETSY_MAIN_SHOP = "https://thepixelprince.etsy.com";
export const ETSY_PRINTABLES_SHOP = "https://pixelprinceprintable.etsy.com";

/** Every outbound Etsy link must go through this. */
export function etsyUrl(base: string, campaign: string): string {
  const url = new URL(base);
  url.searchParams.set("utm_source", "pixelprince");
  url.searchParams.set("utm_medium", "site");
  url.searchParams.set("utm_campaign", campaign);
  return url.toString();
}
