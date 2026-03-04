import { getPage } from '$lib/sanity';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
	return await getPage(params.page, cookies);
};
