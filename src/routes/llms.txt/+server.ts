import { llmsIndex, textResponse } from '#site/llms.js';

export const prerender = true;

export const GET = () => textResponse(llmsIndex(), 'text/plain');
