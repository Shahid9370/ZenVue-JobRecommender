// Demo / fallback image utilities for the whole project.
// Uses Unsplash / placehold.co / pravatar so no local assets are required.

const UNSPLASH_BASE = "https://images.unsplash.com";
const PLACEHOLD_BASE = "https://placehold.co";

/** Primary hero image (wide) */
export const HERO_IMAGE =
  `${UNSPLASH_BASE}/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80`;

/** Alternative hero illustration */
export const HERO_ILLUSTRATION =
  `${UNSPLASH_BASE}/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80`;

/** Generic job listing / card image (landscape) */
export const JOB_LISTING_IMAGE =
  `${UNSPLASH_BASE}/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=80`;

/** Default small logo (square) */
export const DEFAULT_LOGO = `${PLACEHOLD_BASE}/80x80/EDF2FF/0F172A?text=Logo&font=roboto`;

/** Larger logo */
export const DEFAULT_LOGO_LARGE = `${PLACEHOLD_BASE}/160x160/EDF2FF/0F172A?text=Logo&font=roboto`;

/** Default avatar for testimonials or users */
export const DEFAULT_AVATAR = "https://i.pravatar.cc/150?u=ZenVue-default";

/** Pre-defined company logos for a few demo companies */
export const COMPANY_LOGOS = {
  "Acme Corp": `${PLACEHOLD_BASE}/80x80/E6F0FF/0F172A?text=AC&font=roboto`,
  "DesignHub": `${PLACEHOLD_BASE}/80x80/FFF3EC/7C3AED?text=DH&font=roboto`,
  "Marketly": `${PLACEHOLD_BASE}/80x80/FEF3C7/92400E?text=M&font=roboto`,
  "ZenVu": `${PLACEHOLD_BASE}/80x80/EEFBF7/064E3B?text=ZV&font=roboto`,
  "Supportly": `${PLACEHOLD_BASE}/80x80/F0F9FF/075985?text=S&font=roboto`,
};

/** Returns a logo URL for a given company name. */
export function companyLogoFor(name) {
  if (!name) return DEFAULT_LOGO;
  if (COMPANY_LOGOS[name]) return COMPANY_LOGOS[name];

  const initial = String(name).trim().charAt(0).toUpperCase();
  return `${PLACEHOLD_BASE}/80x80/EEF2FF/0F172A?text=${encodeURIComponent(initial)}&font=roboto`;
}

/** Returns a predictable avatar URL for a seed (email, id). */
export function testimonialAvatarFor(seed) {
  const id = typeof seed === "string" ? seed : JSON.stringify(seed || Math.random());
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(id)}`;
}

/**
 * imageForPath(path)
 * - If path is an external URL, returns it.
 * - If path is local or empty, returns an appropriate demo fallback.
 */
export function imageForPath(path) {
  if (!path) return HERO_IMAGE;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const lower = path.toLowerCase();
  if (lower.includes("hero")) return HERO_ILLUSTRATION;
  if (lower.includes("logo") || lower.includes("company")) return DEFAULT_LOGO;
  if (lower.includes("avatar") || lower.includes("testimonial")) return DEFAULT_AVATAR;
  if (lower.includes("job") || lower.includes("listing")) return JOB_LISTING_IMAGE;
  return HERO_IMAGE;
}