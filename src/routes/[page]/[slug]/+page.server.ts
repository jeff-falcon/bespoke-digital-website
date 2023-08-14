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
			vimeoPlayerSrc: projectData.vimeo_player_src,
			vimeoSrc: projectData.thumb_vimeo_src,
			vimeoSrcHd: projectData.thumb_vimeo_src_hd,
			media:
				projectData.media
					?.map((media: any) => {
						if (media === null) return null;

						if (media._type === 'project_media') {
							return parseProjectMediaFromData(media);
						}
						if (media._type === 'item_pair') {
							const left = parseProjectMediaFromData(media.left)
							const right = parseProjectMediaFromData(media.right)
							if (!left && !right) return null;
							if (!left || !right) return left ?? right;
							return <ProjectMediaPair>{
								_type: 'item_pair',
								left,
								right
							};
						}
					})
					.filter((media: ProjectMedia | null) => media != null) ?? []
		};
		return { project };
	}

	return error(404, 'Page not found');
};
