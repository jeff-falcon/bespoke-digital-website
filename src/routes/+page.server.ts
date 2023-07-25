// since there's no dynamic data here, we can prerender
import type { PageServerLoad } from './$types';
import { getClient } from '$lib/sanity';

// it so that it gets served as a static asset in production
export const prerender = true;

export const load: PageServerLoad = async () => {
	const client = getClient();
	const projects = await client.fetch('*[_type == "project"]');
	console.log(projects.map((project: any) => `${project.name}: ${project.slug.current}}`));
	return {
		title: 'Bespoke Digital',
		projects
	};
};
