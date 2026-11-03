import type { Handle } from '@sveltejs/kit/hooks';
import { getTextDirection } from '#i18n/runtime.js';
import { paraglideMiddleware } from '#i18n/server.js';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		return resolve(
			{ ...event, request },
			{
				transformPageChunk: ({ html }) =>
					html.replace('%paraglide.lang%', locale).replace('%paraglide.dir%', getTextDirection(locale))
			}
		);
	});

export const handle: Handle = handleParaglide;
