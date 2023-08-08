// since there's no dynamic data here, we can prerender
import type { PageServerLoad } from './$types';
import { getClient } from '$lib/sanity';
import type { Project, ProjectMedia, ProjectMediaPair } from '$lib/types';
import { error } from '@sveltejs/kit';
import { parseCloudinaryImage, parseProjectMediaFromData } from '$lib/parse';

// it so that it gets served as a static asset in production
export const prerender = true;

export const load: PageServerLoad = async ({ params }) => {
	if (params.page === 'work') {
		console.log('loading work/' + params.slug);

		const client = getClient();
		const groq = `*[_type == "project" && slug.current == "${params.slug}"]{
			...,
			media[]{
				_type == 'item' => @->,
				_type == 'item_pair' => {
					_type,
					left->,
					right->
				},
			}
		}`;
		const data = await client.fetch(groq);
		const projectData = data[0];
		const project: Project = {
			_type: 'project',
			pageTitle: projectData.name + ' | Work | Bespoke Digital',
			name: projectData.name,
			shortName: projectData.short_name ?? '',
			slug: projectData.slug.current,
			description: projectData.description,
			client: projectData.client,
			credits: projectData.credits ?? [],
			image: parseCloudinaryImage(projectData.image),
			thumb_vimeo_id: projectData.thumb_vimeo_id,
			thumb_vimeo_src: projectData.thumb_vimeo_src,
			media:
				projectData.media
					?.map((media: any) => {
						if (media === null) return null;

						if (media._type === 'project_media') {
							return parseProjectMediaFromData(media);
						}
						if (media._type === 'item_pair') {
							return {
								_type: 'item_pair',
								left: parseProjectMediaFromData(media.left),
								right: parseProjectMediaFromData(media.right)
							} satisfies ProjectMediaPair;
						}
					})
					.filter((media: ProjectMedia | null) => media != null) ?? []
		};
		return { project };
	}

	return error(404, 'Page not found');
};
