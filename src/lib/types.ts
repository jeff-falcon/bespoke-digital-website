import type { InputValue } from '@portabletext/svelte/ptTypes';

export interface CloudinaryImage {
	secure_url: string;
	width: number;
	height: number;
}

export interface Project {
	_type: 'project';
	name: string;
	slug: string;
	pageTitle?: string;
	kind?: 'image' | 'video-bg';
	description?: InputValue;
	client?: string;
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
	client?: string;
	category?: string;
	description?: string;
	image_desktop?: CloudinaryImage;
	image_mobile?: CloudinaryImage;
	project?: Project;
}

export interface Page {
	_type: 'page';
	name: string;
	slug: string;
	description?: string;
	hero?: Hero;
	components?: Array<ProjectGrid | Hero>;
}

export interface ProjectMedia {
	_type: 'project_media';
	_key: string;
	name: string;
	image: CloudinaryImage;
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
