// since there's no dynamic data here, we can prerender
import type { PageServerLoad } from './$types';
import { getClient } from '$lib/sanity';

// it so that it gets served as a static asset in production
export const prerender = true;

interface Project {
	pageTitle: string;
	name: string;
	description: string;
	client: string;
	image: {
		secure_url: string;
		width: number;
		height: number;
	};
}

export const load: PageServerLoad = async ({ params }) => {
	const client = getClient();
	const data = await client.fetch(`*[_type == "project" && slug.current == "${params.slug}"]`);
	const project = data[0];
	console.log({ project });
	return {
		pageTitle: project.name + ' | Work | Bespoke Digital',
		name: project.name,
		description: project.description,
		client: project.client,
		image: project.image
	} satisfies Project;
};
