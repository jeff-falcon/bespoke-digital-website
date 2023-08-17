import { createClient } from '@sanity/client';
import { SANITY_TOKEN, SANITY_DATASET, SANITY_PROJECT_ID } from '$env/static/private';
import type { ClientList, ColumnedText, Form, Hero, LogoGrid, Page, PageComponents, ProjectGrid, ProjectMedia } from '$lib/types';
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
		_id,
		name,
		"slug": slug.current,
		description,
		"bgColor": bg_color,
		"footerHasContactForm": footer_contact,
		hero->{...,project->},
		components[]{
			_type == 'logo_grid_ref' => @->{..., "desktop": desktop.asset->url, "mobile": mobile.asset->url},
			_type == 'projects' => @->{...,projects[]->},
			_type == 'project_media_ref' => @->,
			_type == 'text_only_ref' => @->{..., "bgColor": background_color},
			_type == 'columned_text_ref' => @->{..., "borderedTitle": bordered_title, "bgColor": background_color},
			_type == 'client_list_ref' => @->{..., "bgColor": background_color},
			_type == 'form_ref' => @->{..., "bgColor": background_color},
		}
	}`;
	try {
		const result = await client.fetch(groq);
		if (!result || !result.length) return error(404, 'Page not found');
		const pageData = result[0];
		const page: Page = {
			_type: 'page',
			_id: pageData._id,
			name: pageData.name,
			bgColor: pageData.bgColor,
			slug: pageData.slug,
			description: pageData.description,
			footerHasContactForm: Boolean(pageData.footerHasContactForm ?? true),
			hero: pageData.hero
				? ({
					_type: 'hero',
					name: pageData.hero.name,
					subtitle: pageData.hero.subtitle,
					image_desktop: parseCloudinaryImage(pageData.hero.image_desktop),
					image_mobile: parseCloudinaryImage(pageData.hero.image_mobile),
					kind: pageData.hero.kind,
					videoBgSrc: pageData.hero.thumb_vimeo_src,
					videoBgSrcHd: pageData.hero.thumb_vimeo_src_hd,
					project: pageData.hero.project ? parseProjectFromData(pageData.hero.project) : undefined
				} satisfies Hero)
				: undefined,
			components:
				pageData.components?.map((component: any) => {
					if (component._type === 'project_grid') {
						const grid: ProjectGrid = {
							_type: 'project_grid',
							name: component.name,
							title: component.title,
							moreLink: component.more_link?.url ? {
								buttonTitle: component.more_link.button_title,
								url: component.more_link.url
							} : undefined,
							useFeature: component.feature_first ?? false,
							projects: component.projects?.map((data: any) => parseProjectFromData(data)) ?? []
						};
						return grid;
					} else if (component._type === 'project_media') {
						return parseProjectMediaFromData(component);
					} else if (component._type === 'logo_grid') {
						return component as LogoGrid;
					} else if (component._type === 'text_only') {
						return component as TextOnly;
					} else if (component._type === 'columned_text') {
						return component as ColumnedText;
					} else if (component._type === 'client_list') {
						const clients: ClientList = {
							_type: 'client_list',
							title: component.title,
							clients: component.clients.replace(/\n\s*\n+/g, '\n').split('\n'),
							bgColor: component.bg_color
						}
						return clients
					} else if (component._type === 'form') {
						return component as Form;
					} else {
						console.log('unknown component', component);
					}
				}).filter((component: PageComponents) => component != null) ?? []
		};

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
