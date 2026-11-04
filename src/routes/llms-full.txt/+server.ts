import { llmsFull, textResponse } from '#site/llms.js';

export const prerender = true;

export const GET = async () => textResponse(await llmsFull(), 'text/plain');
