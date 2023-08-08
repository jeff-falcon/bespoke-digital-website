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
	return <ProjectMedia>{
		_type: 'project_media',
		_key: project._id,
		name: project.name,
		image: parseCloudinaryImage(project.image),
		kind: project.kind,
		thumb_vimeo_id: project.thumb_vimeo_id,
		thumb_vimeo_src: project.thumb_vimeo_src,
		thumb_vimeo_src_hd: project.thumb_vimeo_src_hd
	};
}

export function parseProjectFromData(project: any) {
	if (project?._type !== 'project') return undefined;
	return <Project>{
		_type: 'project',
		pageTitle: project.name,
		name: project.name,
		shortName: project.short_name ?? '',
		slug: project.slug.current ?? '',
		description: project.description,
		client: project.client,
		image: parseCloudinaryImage(project.image),
		thumb_vimeo_id: project.thumb_vimeo_id,
		thumb_vimeo_src: project.thumb_vimeo_src,
		thumb_vimeo_src_hd: project.thumb_vimeo_src_hd
	}
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