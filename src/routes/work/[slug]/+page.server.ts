// since there's no dynamic data here, we can prerender
import type { PageServerLoad } from './$types';
import { getClient } from '$lib/sanity';
import type { Project } from '$lib/types';

// it so that it gets served as a static asset in production
export const prerender = true;

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
		image: project.image,
		thumb_vimeo_id: project.thumb_vimeo_id,
		thumb_vimeo_src: project.thumb_vimeo_src
	} satisfies Project;
};