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
	description?: InputValue;
	client?: string;
	image?: CloudinaryImage;
	thumb_vimeo_id?: string;
	thumb_vimeo_src?: string;
	thumb_vimeo_src_hd?: string;
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
}

export interface Page {
	_type: 'page';
	name: string;
	slug: string;
	description?: string;
	hero?: Hero;
	components?: Array<ProjectGrid | Hero>;
}
