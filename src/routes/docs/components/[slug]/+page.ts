import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	let docs;

	try {
		docs = (await import(`$docs/${params.slug}.svx`)).default;
	} catch (error) {
		console.log(error);
	}

	if (!docs) error(404, { message: 'Not found' });

	return { docs: docs };
};
