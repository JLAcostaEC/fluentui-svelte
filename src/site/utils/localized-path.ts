import { resolve } from '$app/paths';
import type { Path } from '$app/types';
import { localizeHref } from '#i18n/runtime.js';

/** Localizes a pathname and resolves it; `resolve` takes pathnames without a leading `/` (only route IDs have one). */
export const localizedPath = (href: string, options?: Parameters<typeof localizeHref>[1]) =>
	resolve(localizeHref(href, options).replace(/^\//, '') as Path);
