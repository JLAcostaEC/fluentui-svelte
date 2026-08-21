import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const { slug } = params;

	let docs;

	try {
		docs = (await import(`$site/pages/${slug}.svx`)).default;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (_error) {
		// console.log(_error);
	}

	if (!docs) error(404, { message: 'Not found' });

	return { docs: docs };
};
