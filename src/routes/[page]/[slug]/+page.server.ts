import type { PageServerLoad } from './$types';
import { getClient } from '$lib/sanity';
import type { Project, ProjectMedia, ProjectMediaPair } from '$lib/types';
import { error, type HttpError } from '@sveltejs/kit';
import { parseCloudinaryImage, parseProjectFromData, parseProjectMediaFromData } from '$lib/parse';

export const load: PageServerLoad = async ({
	params
}): Promise<{ project?: Project } | HttpError> => {
	if (params.page === 'work') {
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
			},
			"tags": tags[]->prefLabel,
			"relatedProjects": *[_type == "project" && count(tags[@._ref in ^.^.tags[]._ref]) > 0 && slug.current != "${params.slug}" && !(_id in path("drafts.**"))]{
				_type,
				_id,
				image,
				kind,
				"tags": tags[]->prefLabel,
				"videoBgSrc": thumb_vimeo_src,
				"videoBgSrcHd": thumb_vimeo_src_hd,
				"shortName": short_name,
				"slug": slug.current,
				"title": title,
				"client": client,
			}
		}`;
		const data = await client.fetch(groq);
		if (!data || !data.length) {
			console.log('no result');
			throw error(404, 'Page not found');
		}
		const projectData = data[0];
		const mediaList: Array<ProjectMedia | ProjectMediaPair> = [];
		if (projectData.media) {
			for (const media of projectData.media) {
				if (media._type === 'project_media') {
					const item = await parseProjectMediaFromData(media);
					if (item) mediaList.push(item);
				}
				if (media._type === 'item_pair') {
					const left = await parseProjectMediaFromData(media.left, false);
					const right = await parseProjectMediaFromData(media.right, false);
					if (!left && !right) {
						continue;
					}
					if (!left || !right) {
						const item = left ?? right;
						if (item) mediaList.push(item);
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
		const title = projectData.title || projectData.name;
		const project: Project = {
			_type: 'project',
			_id: projectData._id,
			pageTitle: title + ' | Work | Bespoke Digital',
			name: projectData.name,
			title: title,
			metaDescription: projectData.meta_description,
			shortName: projectData.short_name || title || '',
			slug: projectData.slug.current,
			descriptionIntro: projectData.description_intro,
			description: projectData.description,
			client: projectData.client,
			credits: projectData.credits ?? [],
			image: parseCloudinaryImage(projectData.image, projectData.image_mobile),
			videoBgSrc: projectData.thumb_vimeo_src,
			videoBgSrcHd: projectData.thumb_vimeo_src_hd,
			media: mediaList,
			bgColor: projectData.bg_color?.value,
			relatedProjects:
				projectData.show_related_projects !== false ? projectData.relatedProjects ?? [] : [],
			relatedProjectsBgColor: projectData.related_projects_bg_color?.value,
			showRelatedProjects: projectData.show_related_projects !== false,
			tags: projectData.tags ?? []
		};
		let rp = project.relatedProjects;
		if (rp?.length) {
			const groupedRelatedProjects = new Map<string, Project[]>();
			project.tags?.map((tag) => {
				groupedRelatedProjects.set(tag, []);
			});
			rp.forEach((p) => {
				p.image = parseCloudinaryImage(p.image);
			});
			rp.sort(() => {
				return Math.random() - 0.5;
			});
			const ids = new Set<string>();
			groupedRelatedProjects.forEach((value, key) => {
				groupedRelatedProjects.set(
					key,
					rp?.filter((p) => {
						const exists = p.tags?.includes(key) && !ids.has(p._id);
						return exists;
					}) ?? []
				);
				groupedRelatedProjects.get(key)?.forEach((p) => {
					ids.add(p._id);
				});
			});
			rp = Array.from(groupedRelatedProjects).flatMap((p) => p[1]);
			project.relatedProjects = rp.slice(0, rp.length < 4 ? 2 : 4);
		}

		return { project };
	}

	throw error(404, 'Page not found');
};
