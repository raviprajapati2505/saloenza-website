/**
 * Saloenza — SEO Content Tokens
 *
 * Central location for all site-level SEO defaults.
 * Override per-page in each page.tsx via generateMetadata.
 */

export const siteConfig = {
  name: 'Saloenza',
  tagline: 'Salon Management Software',
  description:
    'Saloenza is modern all-in-one salon management software for independent studios, spas, and multi-branch businesses.',
  url: 'https://saloenza.com',
  ogImage: 'https://saloenza.com/og-image.png',
  twitterHandle: '@saloenza',
  locale: 'en_IN',
} as const;

/** Per-page SEO data shape */
export interface PageSEO {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}
