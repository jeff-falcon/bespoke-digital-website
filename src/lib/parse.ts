import type { Project, ProjectMedia, CloudinaryImage, Hero } from '$lib/types';

export function parseCloudinaryImage(image: any, mobileImage?: any, useOriginalQuality = false) {
	if (!image) return undefined;
	const originalUrl = image.derived?.[0]?.secure_url ?? image.secure_url;
	const url: string =
		image.derived?.[0]?.secure_url ??
		image.secure_url.replace(/\/upload\/v/, '/upload/f_auto,q_auto:best/v');
	const matches = url.match(/\/upload\/(.*?)(w_\d+)(.*)\/v/);
	const img: CloudinaryImage = {
		url,
		sizes: {
			sm: matches?.length
				? url
				: url.replace(/\/upload\/(.*?)\/v(\d+)/, '/upload/$1,w_900/v$2'),
			md: matches?.length
				? url
				: url.replace(/\/upload\/(.*?)\/v(\d+)/, '/upload/$1,w_1600/v$2'),
			lg: useOriginalQuality ? originalUrl : matches?.length
				? url
				: url.replace(/\/upload\/(.*?)\/v(\d+)/, '/upload/$1,w_3200/v$2')
		},
		width: image.width,
		height: image.height
	};
	if (mobileImage) {
		const mobileUrl: string = mobileImage.derived?.[0]?.secure_url ??
			mobileImage.secure_url.replace(/\/upload\/v/, '/upload/f_auto,q_auto:best,w_900/v');
		if (img.sizes) {
			img.sizes.sm = mobileUrl;
		}
	}
	return img;
}

export async function parseProjectMediaFromData(project: any): Promise<ProjectMedia | undefined> {
	if (project?._type !== 'project_media') return undefined;
	const useOriginalQuality = project.use_original_quality ?? false;
	const image = parseCloudinaryImage(project.image, project.image_mobile, useOriginalQuality);
	const media: ProjectMedia = {
		_type: 'project_media',
		_key: project._id as string,
		name: project.name as string,
		image,
		kind: project.kind as ProjectMedia['kind'],
		videoPlayerSrc: project.vimeo_player_src as string,
		videoBgSrc: project.thumb_vimeo_src as string,
		videoBgSrcHd: project.thumb_vimeo_src_hd as string,
		useOriginalQuality
	};
	console.log('project media: ', { media });
	return media;
}

export async function parseProjectFromData(data: any) {
	if (data?._type !== 'project') return undefined;
	const project: Project = {
		_type: 'project',
		pageTitle: data.name,
		name: data.name,
		shortName: data.short_name ?? '',
		slug: data.slug.current ?? '',
		description: data.description,
		descriptionIntro: data.description_intro,
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