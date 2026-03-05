import { BYPASS_TOKEN, USE_ISR } from '$env/static/private';
import { getClient } from '$lib/sanity';
import type { Config } from '$lib/types';
import { redirect } from '@sveltejs/kit';

export const config =
	typeof USE_ISR === 'string' && USE_ISR === 'true'
		? {
				isr: {
					expiration: 60,
					bypassToken: BYPASS_TOKEN
				}
			}
		: {};

export const trailingSlash = 'never';

export async function load({ cookies, url }) {
	if (url.searchParams.get('enable-previews') === '1') {
		console.log('enabling previews');
		cookies.set('drafts-enabled', 'true', { path: '/' });
		redirect(302, url.pathname);
	} else if (
		url.searchParams.get('enable-previews') === '0' &&
		cookies.get('drafts-enabled') === 'true'
	) {
		console.log('disabling previews');
		cookies.delete('drafts-enabled', { path: '/' });
		redirect(302, url.pathname);
	}
	const draftsEnabled = cookies.get('drafts-enabled') === 'true';
	const client = getClient(draftsEnabled);
	const groq = `*[_type == "config"]{
    locations,
    "menu": main_menu[]->{
      name,
      "slug": slug.current
    },
    "socials": socials_group{
      name,
      "links": socials_links[]{
        name,
        url,
        "icon": icon.asset->url
      }
    },
    "newsletterFormTitle": newsletter_form_title,
    solutions,
    "borderRadius": border_radius
  }`;
	const data = await client.fetch(groq);
	const configData = data[0] as Config;
	return {
		config: configData,
		draftsEnabled
	};
}
