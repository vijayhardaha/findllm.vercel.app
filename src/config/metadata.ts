import type { Metadata } from 'next';

/**
 * Site title for LLM Finder.
 */
const title = 'LLM Finder - Compare AI Models, Pricing, Context & Reasoning';

/**
 * Site description for LLM Finder.
 */
const description =
  'Compare AI models from OpenAI, Anthropic, Google, Meta, Mistral & more. Filter LLMs by pricing, context, reasoning, tool calling, speed, and multimodality.';

/**
 * Site URL for LLM Finder.
 */
const url = 'https://findllm.vercel.app';

/**
 * Next.js metadata configuration for SEO.
 */
export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: { default: title, template: '%s | LLM Finder' },
  description,
  applicationName: 'LLM Finder',
  keywords: [
    'LLM Finder',
    'AI model comparison',
    'compare AI models',
    'LLM comparison',
    'AI model directory',
    'OpenAI models',
    'Anthropic Claude',
    'Google Gemini',
    'DeepSeek models',
    'Mistral AI',
    'xAI Grok',
    'AI pricing comparison',
    'context window comparison',
    'reasoning models',
    'tool calling models',
    'multimodal AI models',
    'free AI models',
    'best coding AI models',
    'AI API comparison',
    'LLM leaderboard',
    'AI models database',
    'GPT alternatives',
    'Claude alternatives',
    'Gemini alternatives',
  ],
  authors: [{ name: 'Vijay Hardaha', url }],
  creator: 'Vijay Hardaha',
  publisher: 'LLM Finder',
  category: 'technology',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url,
    siteName: 'LLM Finder',
    title,
    description,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'LLM Finder - Compare AI Models' }],
  },
  twitter: { card: 'summary_large_image', title, description, creator: '@llmfinder', images: ['/og.png'] },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  verification: { google: '4CyrCxZi9TWgvS-GzB1QUhgEl0bKoIzT36368e_vlx0' },
  appleWebApp: { capable: true, title: 'LLM Finder', statusBarStyle: 'default' },
  formatDetection: { telephone: false },
};
