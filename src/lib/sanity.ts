import { createClient } from '@sanity/client';
import { SANITY_TOKEN, SANITY_DATASET, SANITY_PROJECT_ID } from '$env/static/private';
import type { ColumnedText, Hero, LogoGrid, Page, ProjectGrid, ProjectMedia } from '$lib/types';
import { type HttpError, error } from '@sveltejs/kit';
import { parseCloudinaryImage, parseProjectFromData, parseProjectMediaFromData } from './parse';
import type TextOnly from './ui/content/TextOnly.svelte';

export function getClient() {
	return client;
}

export async function getPage(slug: string): Promise<Page | HttpError> {
	if (!slug) return error(404, 'Page not found');

	const client = getClient();
	const groq = `*[_type == "page" && slug.current == "${slug}"]{
		name,
		"slug": slug.current,
		description,
		hero->{...,project->},
		components[]{
			_type == 'logo_grid_ref' => @->{..., "desktop": desktop.asset->url, "mobile": mobile.asset->url},
			_type == 'projects' => @->{...,projects[]->},
			_type == 'project_media_ref' => @->,
			_type == 'text_only_ref' => @->,
			_type == 'columned_text_ref' => @->,
		}
	}`;
	try {
		const result = await client.fetch(groq);
		if (!result || !result.length) return error(404, 'Page not found');
		const pageData = result[0];
		const page: Page = {
			_type: 'page',
			name: pageData.name,
			slug: pageData.slug,
			description: pageData.description,
			hero: pageData.hero
				? ({
					_type: 'hero',
					name: pageData.hero.name,
					subtitle: pageData.hero.subtitle,
					image_desktop: parseCloudinaryImage(pageData.hero.image_desktop),
					image_mobile: parseCloudinaryImage(pageData.hero.image_mobile),
					kind: pageData.hero.kind,
					vimeoSrc: pageData.hero.thumb_vimeo_src,
					vimeoSrcHd: pageData.hero.thumb_vimeo_src_hd,
					project: pageData.hero.project ? parseProjectFromData(pageData.hero.project) : undefined
				} satisfies Hero)
				: undefined,
			components:
				pageData.components?.map((component: any) => {
					if (component._type === 'project_grid') {
						return <ProjectGrid>{
							_type: 'project_grid',
							name: component.name,
							title: component.title,
							useFeature: component.feature_first ?? false,
							projects: component.projects?.map((data: any) => parseProjectFromData(data)) ?? []
						};
					} else if (component._type === 'project_media') {
						return parseProjectMediaFromData(component);
					} else if (component._type === 'logo_grid') {
						return component as LogoGrid;
					} else if (component._type === 'text_only') {
						return component as TextOnly;
					} else if (component._type === 'columned_text') {
						return component as ColumnedText;
					} else {
						console.log('unknown component', component);
					}
				}).filter((component: ProjectMedia | LogoGrid | ProjectGrid) => component != null) ?? []
		};
		console.log({ components: page.components });

		return page;
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
