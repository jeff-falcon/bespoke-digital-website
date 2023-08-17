// since there's no dynamic data here, we can prerender
import type { PageServerLoad } from './$types';
import { getClient } from '$lib/sanity';
import type { Project, ProjectMedia, ProjectMediaPair } from '$lib/types';
import { error, type HttpError } from '@sveltejs/kit';
import { parseCloudinaryImage, parseProjectMediaFromData } from '$lib/parse';

// it so that it gets served as a static asset in production
export const prerender = true;

export const load: PageServerLoad = async ({ params }): Promise<{ project?: Project } | HttpError> => {
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
		let mediaList: Array<ProjectMedia | ProjectMediaPair> = []
		if (projectData.media) {
			for (const media of projectData.media) {
				if (media._type === 'project_media') {
					const item = await parseProjectMediaFromData(media);
					if (item) mediaList.push(item)
				}
				if (media._type === 'item_pair') {
					const left = await parseProjectMediaFromData(media.left)
					const right = await parseProjectMediaFromData(media.right)
					if (!left && !right) {
						continue;
					}
					if (!left || !right) {
						const item = left ?? right;
						if (item) mediaList.push(item)
					} else {
						mediaList.push(<ProjectMediaPair>{
							_type: 'item_pair',
							left,
							right
						});
					}
				}
			}

		}
		const project: Project = {
			_type: 'project',
			pageTitle: projectData.name + ' | Work | Bespoke Digital',
			name: projectData.name,
			shortName: projectData.short_name ?? '',
			slug: projectData.slug.current,
			descriptionIntro: projectData.description_intro,
			description: projectData.description,
			client: projectData.client,
			credits: projectData.credits ?? [],
			image: parseCloudinaryImage(projectData.image, projectData.image_mobile),
			videoBgSrc: projectData.thumb_vimeo_src,
			videoBgSrcHd: projectData.thumb_vimeo_src_hd,
			media: mediaList
		};
		return { project };
	}

	return error(404, 'Page not found');
};
