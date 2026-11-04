import { globalGuide, textResponse } from '#site/llms.js';

export const prerender = true;

export const GET = () => textResponse(globalGuide, 'text/markdown');
