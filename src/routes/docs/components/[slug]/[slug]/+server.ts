import { error } from '@sveltejs/kit';

export const GET = async ({ url, params }) => {
	if (!params.slug.endsWith('llms') && !params.slug.endsWith('llms.md')) error(404, { message: 'Not found' });

	let docs;

	const componentName = url.pathname.split('/')[3];

	try {
		docs = (await import(`$components/${componentName}/docs/llms.md?raw`)).default;
	} catch (err) {
		error(500, {
			message: `Error loading llms.md for component ${componentName}: ${err instanceof Error ? err.message : String(err)}`
		});
	}

	if (!docs) error(404, { message: 'Not found' });

	return new Response(String(docs), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
};
