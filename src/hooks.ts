import type { Reroute } from '@sveltejs/kit';
import { deLocalizeUrl } from '$i18n/runtime.js';

export const reroute: Reroute = (request) => deLocalizeUrl(request.url).pathname;
