// since there's no dynamic data here, we can prerender
import type { PageServerLoad } from './$types';
import { getPage } from '$lib/sanity';

// it so that it gets served as a static asset in production
export const prerender = true;

export const load: PageServerLoad = async ({ params }) => {
	return await getPage(params.page);
};
