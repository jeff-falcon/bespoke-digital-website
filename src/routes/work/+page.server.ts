// since there's no dynamic data here, we can prerender
import type { PageServerLoad } from './$types';
import { getClient } from '$lib/sanity';
import type { Page, Project, ProjectGrid } from '$lib/types';
import { error } from '@sveltejs/kit';

// it so that it gets served as a static asset in production
export const prerender = true;

export const load: PageServerLoad = async () => {
	const client = getClient();
	const groq = `*[_type == "page" && slug.current == "work"]{
		name,
		"slug": slug.current,
		description,
		hero->,
		components[]->{..., "projects": projects[]->}
	}`;
	const pageData = (await client.fetch(groq))[0];
	console.log({ pageData });
	if (!pageData) {
		error(404, 'Page not found');
	} else {
		const page: Page = {
			_type: 'page',
			name: pageData.name,
			slug: pageData.slug,
			description: pageData.description,
			hero: pageData.hero,
			components: pageData.components.map((component: any) => {
				if (component._type === 'project_grid') {
					return {
						_type: component._type,
						name: component.name,
						projects: component.projects.map((project: any) => ({
							pageTitle: project.name,
							name: project.name,
							slug: project.slug,
							description: project.description,
							client: project.client,
							image: project.image,
							thumb_vimeo_id: project.thumb_vimeo_id,
							thumb_vimeo_src: project.thumb_vimeo_src
						})) satisfies Project
					} satisfies ProjectGrid;
				}
			})
		};

		console.log({ page: JSON.stringify(page, null, 2) });
		return page;
	}
};
