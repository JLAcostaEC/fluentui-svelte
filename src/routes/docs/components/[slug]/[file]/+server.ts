import { error } from '@sveltejs/kit';
import { componentMarkdown, textResponse } from '#site/llms.js';

// Agents guess these names too; they serve the same file as `/docs/components/<slug>.md`.
const ALIASES = new Set(['llms', 'llms.md', 'llms.txt']);

export const GET = async ({ params }) => {
	if (!ALIASES.has(params.file)) error(404, 'Not found');

	const markdown = await componentMarkdown(params.slug);
	if (markdown === null) error(404, 'Not found');

	return textResponse(markdown, params.file.endsWith('.txt') ? 'text/plain' : 'text/markdown');
};
