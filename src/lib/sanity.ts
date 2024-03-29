import { createClient } from '@sanity/client';
import { SANITY_TOKEN, SANITY_DATASET, SANITY_PROJECT_ID } from '$env/static/private';
import type {
	TextOnly,
	ClientList,
	ColumnedText,
	Form,
	LogoGrid,
	Page,
	PageComponents,
	Project,
	ProjectGrid,
	TeamGrid
} from '$lib/types';
import { error } from '@sveltejs/kit';
import {
	makeSquareThumbnail,
	parseMultiHeroFromData,
	parseProjectFromData,
	parseProjectMediaFromData
} from './parse';

export function getClient() {
	return client;
}

export async function getPage(slug: string): Promise<Page | undefined> {
	if (!slug) error(404, 'Page not found');

	const client = getClient();
	const groq = `*[_type == "page" && slug.current == "${slug}"]{
		_id,
		name,
		"slug": slug.current,
		description,
		"bgColor": bg_color,
		"footerHasContactForm": footer_contact,
		"hero": hero->{
			_type == 'hero' => @{..., project->},
			_type == 'multi_hero' => @{..., heros[]->{..., project->}},
		},
		components[]{
			_type == 'logo_grid_ref' => @->{..., "desktop": desktop.asset->url, "mobile": mobile.asset->url, "desktopMaxWidth": desktop_max_width, "mobileMaxWidth": mobile_max_width},
			_type == 'projects' => @->{...,projects[]->},
			_type == 'project_media_ref' => @->,
			_type == 'text_only_ref' => @->{..., "bgColor": background_color},
			_type == 'columned_text_ref' => @->{..., "borderedTitle": bordered_title, "bgColor": background_color},
			_type == 'client_list_ref' => @->{..., "bgColor": background_color},
			_type == 'team_grid_ref' => @->{..., "bgColor": background_color, "extraMembers": extra_members[]->, "extraMembersTitle": extra_members_title},
			_type == 'form_ref' => @->{..., "bgColor": background_color},
		}
	}`;
	const result = await client.fetch(groq);
	if (!result || !result.length) {
		console.log('no result');
		error(404, 'Page not found');
	}
	try {
		const pageData = result[0];
		const page: Page = {
			_type: 'page',
			_id: pageData._id,
			name: pageData.name,
			bgColor: pageData.bgColor?.value,
			slug: pageData.slug,
			metaDescription: pageData.description,
			footerHasContactForm: Boolean(pageData.footerHasContactForm ?? true),
			heros: parseMultiHeroFromData(pageData.hero),
			components: await getComponents(pageData.components)
		};

		return page;
	} catch (err) {
		console.log('fetch error', (err as Error).message);
		error(403, (err as Error).message);
	}
}

async function getComponents(components: any): Promise<PageComponents> {
	if (!components) return [];
	const comps: PageComponents = [];
	for (const component of components) {
		if (component._type === 'project_grid') {
			const projects: Project[] = [];
			if (component.projects && Array.isArray(component.projects)) {
				for (const project of component.projects) {
					const p = parseProjectFromData(project);
					if (p) projects.push(p);
				}
			}
			const grid: ProjectGrid = {
				_type: 'project_grid',
				name: component.name,
				title: component.title,
				moreLink: component.more_link?.url
					? {
							buttonTitle: component.more_link.button_title,
							url: component.more_link.url
						}
					: undefined,
				useFeature: component.feature_first ?? false,
				disableGrid: component.feature_all === true,
				projects
			};
			comps.push(grid);
		} else if (component._type === 'project_media') {
			const p = await parseProjectMediaFromData(component);
			if (p) comps.push(p);
		} else if (component._type === 'logo_grid') {
			comps.push(component as LogoGrid);
		} else if (component._type === 'text_only') {
			comps.push(component as TextOnly);
		} else if (component._type === 'columned_text') {
			comps.push(component as ColumnedText);
		} else if (component._type === 'client_list') {
			const clients: ClientList = {
				_type: 'client_list',
				title: component.title,
				clients: component.clients.replace(/\n\s*\n+/g, '\n').split('\n'),
				bgColor: component.bg_color
			};
			comps.push(clients);
		} else if (component._type === 'team_grid') {
			const team: TeamGrid = {
				_type: 'team_grid',
				title: component.title,
				description: component.description,
				members: component.members.map((m: any) => {
					m.image = makeSquareThumbnail(m.image);
					return m;
				}),
				extraMembersTitle: component.extra_members_title,
				extraMembers: component.extra_members,
				bgColor: component.bg_color ?? 'transparent'
			};
			comps.push(team);
		} else if (component._type === 'form') {
			comps.push(component as Form);
		} else {
			console.log('unknown component', component);
		}
	}
	return comps;
}

const date = new Date().toISOString().split('T')[0];

const client = createClient({
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET,
	apiVersion: date,
	token: SANITY_TOKEN,
	useCdn: true
});
