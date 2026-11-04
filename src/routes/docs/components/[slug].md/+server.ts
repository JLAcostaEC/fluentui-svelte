import { error } from '@sveltejs/kit';
import { componentMarkdown, llmsComponents, textResponse } from '#site/llms.js';

// The page URL plus `.md`, as https://llmstxt.org proposes. Prerendered, so it is a static file.
export const prerender = true;

export const entries = () => llmsComponents.map((meta) => ({ slug: meta.slug }));

export const GET = async ({ params }) => {
	const markdown = await componentMarkdown(params.slug);
	if (markdown === null) error(404, 'Not found');

	return textResponse(markdown, 'text/markdown');
};
