import type { Reroute } from '@sveltejs/kit/hooks';
import { deLocalizeUrl } from '#i18n/runtime.js';

export const reroute: Reroute = (request) => deLocalizeUrl(request.url).pathname;
