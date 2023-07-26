import { createClient } from '@sanity/client';
import { SANITY_TOKEN, SANITY_DATASET, SANITY_PROJECT_ID } from '$env/static/private';
import type { Page, Project, ProjectGrid } from '$lib/types';
import { error } from '@sveltejs/kit';

export function getClient() {
	return client;
}

export async function getPage(slug: string) {
	if (!slug) return error(404, 'Page not found');

	const client = getClient();
	const groq = `*[_type == "page" && slug.current == "${slug}"]{
		name,
		"slug": slug.current,
		description,
		hero->,
		components[]->{..., projects[]->}
	}`;
	try {
		const result = await client.fetch(groq);
		if (!result || !result.length) return error(404, 'Page not found');
		const pageData = result[0];
		console.log(JSON.stringify(pageData, null, 2));
		const page: Page = {
			_type: 'page',
			name: pageData.name,
			slug: pageData.slug,
			description: pageData.description,
			hero: pageData.hero,
			components:
				pageData.components?.map((component: any) => {
					if (component._type === 'project_grid') {
						return {
							_type: component._type,
							name: component.name,
							projects:
								component.projects?.map((project: any) => {
									return {
										_type: 'project',
										pageTitle: project.name,
										name: project.name,
										slug: project.slug.current ?? '',
										description: project.description,
										client: project.client,
										image: project.image,
										thumb_vimeo_id: project.thumb_vimeo_id,
										thumb_vimeo_src: project.thumb_vimeo_src,
										thumb_vimeo_src_hd: project.thumb_vimeo_src_hd
									} satisfies Project;
								}) ?? []
						} satisfies ProjectGrid;
					}
				}) ?? []
		};
		return { page };
	} catch (err) {
		console.log('fetch error', (err as Error).message);
		return error(403, (err as Error).message);
	}
}

const date = new Date().toISOString().split('T')[0];

const client = createClient({
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET,
	apiVersion: date,
	token: SANITY_TOKEN,
	useCdn: true
});
