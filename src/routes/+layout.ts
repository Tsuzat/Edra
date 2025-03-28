import { injectAnalytics } from '@vercel/analytics/sveltekit';
injectAnalytics();
export const prerender = true;
export const ssr = true;
