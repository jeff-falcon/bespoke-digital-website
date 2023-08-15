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
	videoBgSrc?: string;
	videoBgSrcHd?: string;
	media?: Array<ProjectMedia | ProjectMediaPair>;
}
export interface ProjectGrid {
	_type: 'project_grid';
	name: string;
	title?: string;
	useFeature: boolean;
	projects: Project[];
}
export interface Hero {
	_type: 'hero';
	name: string;
	subtitle?: string;
	kind?: 'image' | 'video-bg';
	image_desktop?: CloudinaryImage;
	image_mobile?: CloudinaryImage;
	videoBgSrc?: string;
	videoBgSrcHd?: string;
	project?: Project;
}

export type PageComponents = Array<ProjectGrid | LogoGrid | ProjectMedia | TextOnly | ColumnedText | ClientList>

export interface Page {
	_type: 'page';
	name: string;
	slug: string;
	description?: string;
	hero?: Hero;
	components?: PageComponents;
}

export interface ProjectMedia {
	_type: 'project_media';
	_key: string;
	name: string;
	image?: CloudinaryImage;
	kind?: 'image' | 'video-bg' | 'video-player';
	videoPlayerSrc?: string;
	videoBgSrc?: string;
	videoBgSrcHd?: string;
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

export interface TextOnly {
	_type: 'text_only';
	title: string;
	body: InputValue;
}

export interface ColumnedText {
	_type: 'columned_text';
	title: string;
	body: {
		title: string;
		body: InputValue;
	}[];
}

export interface ClientList {
	_type: 'client_list';
	title: string;
	clients: string[];
}