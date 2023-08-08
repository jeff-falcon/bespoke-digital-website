import type { InputValue } from '@portabletext/svelte/ptTypes';

export interface CloudinaryImage {
	url: string;
	sizes?: {
		sm: string;
		md: string;
		lg: string;
	};
	width: number;
	height: number;
}

export interface Credit {
	name: string;
	credit: string;
}

export interface Project {
	_type: 'project';
	name: string;
	shortName: string;
	slug: string;
	pageTitle?: string;
	kind?: 'image' | 'video-bg';
	description?: InputValue;
	client?: string;
	credits?: Credit[],
	image?: CloudinaryImage;
	thumb_vimeo_id?: string;
	thumb_vimeo_src?: string;
	thumb_vimeo_src_hd?: string;
	media?: Array<ProjectMedia | ProjectMediaPair>;
}
export interface ProjectGrid {
	_type: 'project_grid';
	name: string;
	projects: Project[];
}
export interface Hero {
	_type: 'hero';
	name: string;
	subtitle?: string;
	kind?: 'image' | 'video-bg';
	image_desktop?: CloudinaryImage;
	image_mobile?: CloudinaryImage;
	thumb_vimeo_src?: string;
	thumb_vimeo_src_hd?: string;
	project?: Project;
}

export interface Page {
	_type: 'page';
	name: string;
	slug: string;
	description?: string;
	hero?: Hero;
	components?: Array<ProjectGrid | LogoGrid>;
}

export interface ProjectMedia {
	_type: 'project_media';
	_key: string;
	name: string;
	image?: CloudinaryImage;
	kind?: 'image' | 'video-bg' | 'video-player';
	thumb_vimeo_id?: string;
	thumb_vimeo_src?: string;
	thumb_vimeo_src_hd?: string;
}

export interface ProjectMediaPair {
	_type: 'item_pair';
	left: ProjectMedia;
	right: ProjectMedia;
}

export interface Social {
	name: string
	_type: 'social'
	url: string
	icon: string
}

export interface Location {
	name: string
	_type: 'location'
	address: string
	email: string
	timezone: string
}

export interface Config {
	_type: 'config';
	socials: { name: string, links: Social[] }
	locations: Location[]
}

export interface LogoGrid {
	_type: 'logo_grid';
	title: string;
	desktop: string;
	mobile: string;
	color: string;
}