<script lang="ts">
	import { store } from '$lib/store.svelte';
	import type { Config } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';
	import Contact from '../form/Contact.svelte';
	import NewsletterSignup from '../form/NewsletterSignup.svelte';
	import Location from './Location.svelte';

	interface Props {
		config: Config;
		hasContactForm?: boolean;
		hasDivider?: boolean;
	}

	let { config, hasContactForm = false, hasDivider = false }: Props = $props();

	const style = $derived(
		config.borderRadius != null ? `--input-border-radius: ${config.borderRadius}px` : ''
	);

	let hasSolutions = $derived(
		Boolean(config.solutions && config.solutions.title && config.solutions.body)
	);
</script>

<footer
	class="gutter"
	id="footer"
	class:hasDivider
	class:hasContactForm
	class:isDisabled={store.isMenuOpenComplete}
	class:hasSolutions
	{style}
>
	{#if hasSolutions}
		<div class="solutions">
			<h2 class="title">{config.solutions.title}</h2>
			<div class="body"><PortableText value={config.solutions.body} components={{}} /></div>
		</div>
	{/if}
	{#if hasContactForm}
		<div class="contact">
			<Contact />
		</div>
	{/if}
	<div class="signup-socials-row">
		<div class="newsletter">
			<NewsletterSignup title={config.newsletterFormTitle || 'Sign Up For Our Newsletter'} />
		</div>
		<div class="socials">
			<h3 class="title">{config.socials.name}</h3>
			<div class="links">
				{#each config.socials.links as link}
					<a href={link.url} target="_blank">
						<img src={link.icon} width="20" height="20" alt={link.name} />
					</a>
				{/each}
			</div>
		</div>
	</div>
	<div class="locations">
		{#each config.locations as location (location.name)}
			<Location {location} />
		{/each}
	</div>
	<div class="credits">
		<div class="left">
			<p class="copyright">© {new Date().getFullYear()} Bespoke Digital</p>
			<p class="link"><a href="/privacy">Privacy Policy</a></p>
		</div>
		<p class="tanka link"><a href="https://tankadesign.com" target="_blank">Site by TANKA</a></p>
	</div>
</footer>

<style>
	footer {
		margin-top: 88px;
	}
	footer.hasSolutions {
		margin-top: 64px;
	}
	footer.isDisabled {
		visibility: hidden;
	}
	footer.hasDivider {
		padding-top: 40px;
		border-top: 1px solid var(--text-color-15);
	}
	.signup-socials-row {
		border-top: 1px solid var(--text-color-15);
		padding-top: 40px;
	}
	.contact + .signup-socials-row {
		margin-top: 48px;
	}
	.solutions + .contact {
		margin-top: 40px;
		border-top: 1px solid var(--text-color-15);
		padding-top: 40px;
	}
	footer :global(h3.title) {
		font-size: var(--18pt);
		line-height: var(--24pt);
		font-weight: normal;
		margin: 0 0 var(--24pt);
	}
	.locations {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 48px var(--gutter-sm);
		margin-top: 48px;
		padding-top: 48px;
		border-top: 1px solid var(--text-color-15);
	}

	.credits .link a {
		display: inline-block;
		transition: opacity 0.2s linear;
		transform: translateZ(0);
	}
	.credits .link a:hover {
		opacity: 0.98;
	}

	.credits {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-top: 68px;
		margin-bottom: 32px;
	}
	.credits .left {
		display: flex;
		align-items: baseline;
		gap: 24px;
	}
	.credits p {
		margin: 0;
		font-size: var(--12pt);
		line-height: var(--16pt);
	}
	.credits .copyright,
	.credits .link a {
		opacity: 0.6;
	}
	.socials .links {
		display: flex;
		gap: 16px;
	}
	.socials .links a {
		display: inline-flex;
		border-radius: 40px;
		border: 1px solid var(--text-color-30);
		width: 48px;
		height: 48px;
		align-items: center;
		justify-content: center;
		transition: border-color 180ms linear;
	}
	.socials .links a img {
		opacity: 0.8;
		transition: opacity 180ms linear;
	}
	:global(.bg-is-light) .socials .links a img {
		opacity: 0.65;
		filter: invert(1);
	}
	.socials .links a:hover {
		border-color: var(--text-color);
	}
	.socials .links a:hover img {
		opacity: 1;
	}
	.newsletter {
		margin-bottom: 40px;
	}
	.solutions {
		margin-bottom: 48px;
	}
	.solutions .title {
		margin: 0 0 var(--24pt);
	}
	.solutions .body {
		color: var(--text-color-60);
	}
	.solutions .body :global(ul) {
		list-style-type: none;
		padding: 0;
	}
	.solutions .body :global(li) {
		margin: 10px 0;
	}
	@media (min-width: 720px) {
		footer {
			margin-top: 128px;
		}
		footer.hasSolutions {
			margin-top: 64px;
		}
		.signup-socials-row {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			gap: 0 var(--gutter-lg);
		}
		.newsletter {
			grid-column: 1 / span 7;
			margin-bottom: 0;
		}
		.newsletter :global(.sign-up-form form) {
			display: flex;
			flex-direction: row;
			gap: 16px;
		}
		.newsletter :global(.sign-up-form .textfield-container) {
			width: 100%;
			max-width: 376px;
		}
		.newsletter :global(button) {
			width: auto;
			padding-left: 40px;
			padding-right: 40px;
			white-space: nowrap;
		}
		.socials {
			grid-column: 9 / span 4;
			width: min-content;
			justify-self: end;
		}
		.locations {
			grid-template-columns: repeat(4, 1fr);
			gap: 48px var(--gutter-lg);
		}
		.contact {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			gap: var(--gutter-lg);
		}
		.contact :global(.contact-form) {
			grid-column: 1 / span 12;
		}
		.solutions {
			margin-bottom: 40px;
		}
		.solutions .body :global(ul) {
			display: flex;
			flex-wrap: wrap;
			gap: 24px 32px;
		}
	}
	/* @media (min-width: 860px) {
		.contact :global(.contact-form) {
			grid-column: 1 / span 9;
		}
	}
	@media (min-width: 1100px) {
		.contact :global(.contact-form) {
			grid-column: 1 / span 8;
		}
	}
	@media (min-width: 1280px) {
		.contact :global(.contact-form) {
			grid-column: 1 / span 6;
			}
			} */

	@media (min-width: 1100px) {
		.solutions .body :global(ul) {
			gap: 24px 48px;
		}
	}
</style>
