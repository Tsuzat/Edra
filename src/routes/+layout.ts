import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
import { injectAnalytics } from '@vercel/analytics/sveltekit';
injectSpeedInsights();
injectAnalytics();

export const prerender = true;
export const ssr = false;
