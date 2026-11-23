import { locales, localizeHref } from '#i18n/runtime.js';
import { SITE_URL } from '#site/constants.js';

export function sitePageUrl(path: string, locale: (typeof locales)[number]) {
	const url = new URL(localizeHref(path, { locale }), SITE_URL);
	url.pathname = url.pathname.replace(/\/$/, '') || '/';
	return url.href;
}
