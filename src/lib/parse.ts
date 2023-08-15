import type { Project, ProjectMedia, CloudinaryImage, Hero } from '$lib/types';

export function parseCloudinaryImage(image: any) {
	if (!image) return undefined;
	const url: string =
		image.derived?.[0]?.secure_url ??
		image.secure_url.replace(/\/upload\/v/, `/upload/f_auto,q_auto:good/v`);
	const matches = url.match(/\/upload\/(.*)(w_\d+,*)(.*)\/v/);
	return <CloudinaryImage>{
		url,
		sizes: {
			sm: matches?.length
				? url.replace(matches[1], 'w_900')
				: url.replace(/\/upload\/(.*?)\/v/, `/upload/w_900,$1/v`),
			md: matches?.length
				? url.replace(matches[1], 'w_1600')
				: url.replace(/\/upload\/(.*?)\/v/, `/upload/w_1600,$1/v`),
			lg: url
		},
		width: image.width,
		height: image.height
	};
}

export function parseProjectMediaFromData(project: any) {
	if (project?._type !== 'project_media') return undefined;
	const media: ProjectMedia = {
		_type: 'project_media',
		_key: project._id,
		name: project.name,
		image: parseCloudinaryImage(project.image),
		kind: project.kind,
		videoPlayerSrc: project.vimeo_player_src,
		videoBgSrc: project.thumb_vimeo_src,
		videoBgSrcHd: project.thumb_vimeo_src_hd
	};
	return media;
}

export function parseProjectFromData(data: any) {
	if (data?._type !== 'project') return undefined;
	const project: Project = {
		_type: 'project',
		pageTitle: data.name,
		name: data.name,
		shortName: data.short_name ?? '',
		slug: data.slug.current ?? '',
		description: data.description,
		client: data.client,
		kind: data.kind,
		image: parseCloudinaryImage(data.image),
		videoBgSrc: data.thumb_vimeo_src,
		videoBgSrcHd: data.thumb_vimeo_src_hd
	}
	return project;
}

export function parseHeroFromData(data: any) {
	if (data?._type !== 'hero') return undefined;
	return <Hero>{
		_type: 'hero',
		name: data.name,
		subtitle: data.subtitle,
		image_desktop: parseCloudinaryImage(data.image_desktop),
		image_mobile: parseCloudinaryImage(data.image_mobile),
		kind: data.kind,
		thumb_vimeo_src: data.thumb_vimeo_src,
		thumb_vimeo_src_hd: data.thumb_vimeo_src_hd,
		project: data.project ? parseProjectFromData(data.project) : undefined
	}
}