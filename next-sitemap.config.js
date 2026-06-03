/**
 * ======================================================================
 * Next Sitemap Configuration
 * ======================================================================
 * Purpose: Generate sitemaps and robots.txt to help search engines
 *          discover and index site content.
 *          Use `npx next-sitemap` for local testing.
 * Docs:    https://github.com/iamvishnusankar/next-sitemap
 * ======================================================================
 */

const { createSitemapConfig } = require('@vijayhardaha/dev-config/next-sitemap');

/**
 * Live site domain.
 */
const siteDomain = 'https://findllm.vercel.app';

/**
 * Base sitemap configuration from shared dev-config package.
 */
const baseConfig = createSitemapConfig({
  siteUrl: siteDomain,
  outDir: process.env.NODE_ENV === 'production' ? '/vercel/output/static' : './public',
});

/**
 * Explicitly includes the root path in the sitemap.
 * Required because next-sitemap 4.x may not auto-discover
 * App Router pages in Next.js 16 build output.
 *
 * @param {import('next-sitemap').IConfig} sitemapConfig - Resolved sitemap config.
 *
 * @returns {Promise<import('next-sitemap').ISitemapField[]>} Sitemap entries.
 */
const includeRootPath = async (sitemapConfig) => [await sitemapConfig.transform(sitemapConfig, '/')];

/**
 * Merged sitemap configuration with explicit root-path entry.
 *
 * @type {import('next-sitemap').IConfig}
 */
const config = { ...baseConfig, additionalPaths: includeRootPath };

module.exports = config;
