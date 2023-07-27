import { createClient } from '@sanity/client';
import { SANITY_TOKEN, SANITY_DATASET, SANITY_PROJECT_ID } from '$env/static/private';
import type { Hero, Page, ProjectGrid } from '$lib/types';
import { error } from '@sveltejs/kit';
import { parseCloudinaryImage, parseProjectFromData } from './parse';

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
		hero->{...,project->},
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
			hero: pageData.hero
				? ({
						_type: 'hero',
						name: pageData.hero.name,
						client: pageData.hero.client,
						category: pageData.hero.category,
						description: pageData.hero.description,
						image_desktop: parseCloudinaryImage(pageData.hero.image_desktop),
						image_mobile: parseCloudinaryImage(pageData.hero.image_mobile)
				  } satisfies Hero)
				: undefined,
			components:
				pageData.components?.map((component: any) => {
					if (component._type === 'project_grid') {
						return {
							_type: component._type,
							name: component.name,
							projects: component.projects?.map((data: any) => parseProjectFromData(data)) ?? []
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
