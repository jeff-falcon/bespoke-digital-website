import { getPage } from '$lib/sanity';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	return await getPage('home', cookies);
};
