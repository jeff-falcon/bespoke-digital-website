// since there's no dynamic data here, we can prerender
import { createClient } from '@sanity/client';
import { SANITY_TOKEN, SANITY_DATASET, SANITY_PROJECT_ID } from '$env/static/private';
import type { PageServerLoad } from './$types';

// it so that it gets served as a static asset in production
export const prerender = true;

// date in YYYY-MM-DD format
const date = new Date().toISOString().split('T')[0];

const client = createClient({
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET,
	apiVersion: date,
	token: SANITY_TOKEN,
	useCdn: true
});

export const load: PageServerLoad = async () => {
	const projects = await client.fetch('*[_type == "project"]');
	console.log({ image: projects[0].image });
	return {
		title: 'Bespoke Digital',
		projects
	};
};
