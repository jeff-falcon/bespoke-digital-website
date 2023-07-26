export interface Project {
	pageTitle: string;
	name: string;
	description: string;
	client: string;
	image: {
		secure_url: string;
		width: number;
		height: number;
	};
	thumb_vimeo_id: string;
	thumb_vimeo_src: string;
}
