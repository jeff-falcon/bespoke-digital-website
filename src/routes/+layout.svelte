<script lang="ts">
	import { PUBLIC_GA4_TAG_ID } from '$env/static/public';
	import { store } from '$lib/store.svelte';
	import Footer from '$lib/ui/nav/Footer.svelte';
	import TopNav from '$lib/ui/nav/TopNav.svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { onMount } from 'svelte';
	import 'video.js';
	import 'video.js/dist/video-js.css';
	import type { LayoutData } from './$types';
	import './styles.css';

	gsap.registerPlugin(ScrollTrigger);

	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	const style = $derived(
		data.config.borderRadius != null ? `--input-border-radius: ${data.config.borderRadius}px` : ''
	);

	onMount(() => {
		store.inputBorderIsRounded = data.config.borderRadius != null && data.config.borderRadius > 0;
	});

	function disableDrafts() {
		window.location.href = `${window.location.pathname}?enable-previews=0`;
	}
</script>

<svelte:head>
	<script async src="https://www.googletagmanager.com/gtag/js?id={PUBLIC_GA4_TAG_ID}"></script>
	<script data-tag-id={PUBLIC_GA4_TAG_ID}>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());

		gtag('config', document.querySelector('script[data-tag-id]').dataset.tagId);
	</script>
</svelte:head>

<TopNav config={data.config} usePillFollower={true} />

<main class:isDisabled={store.isMenuOpenComplete} {style}>
	{@render children?.()}
</main>

<Footer config={data.config} hasContactForm={store.footerHasContactForm} />

<svg viewBox="0 0 100 100" height="0" width="0">
	<defs>
		<filter id="colorizer-bg-light" color-interpolation-filters="sRGB">
			<feColorMatrix
				type="matrix"
				values="0 0 0 0 0.901960784313725  0 0 0 0 0.894117647058824  0 0 0 0 0.874509803921569  0 0 0 1 0"
			/>
		</filter>
		<filter id="colorizer-bg-dark" color-interpolation-filters="sRGB">
			<feColorMatrix
				type="matrix"
				values="0 0 0 0 0.149019607843137  0 0 0 0 0.149019607843137  0 0 0 0 0.149019607843137  0 0 0 1 0"
			/>
		</filter>
		<filter id="colorizer-text-light" color-interpolation-filters="sRGB">
			<feColorMatrix
				type="matrix"
				values="0 0 0 0 0.078431372549  0 0 0 0 0.996078431372549  0 0 0 0 0.996078431372549  0 0 0 1 0"
			/>
		</filter>
	</defs>
</svg>

{#if data.draftsEnabled}
	<div class="drafts-enabled-banner">
		<span>Drafts enabled</span>
		<button onclick={disableDrafts}>Disable</button>
	</div>
{/if}

<style>
	main {
		width: 100%;
		overflow-x: hidden;
		overflow-y: auto;
	}
	main.isDisabled {
		visibility: hidden;
	}
	.drafts-enabled-banner {
		position: fixed;
		bottom: 10px;
		left: 10px;
		z-index: 1000;
		background: color-mix(in srgb, var(--bg-light), transparent 30%);
		color: var(--text-dark);
		padding: 8px 12px;
		border-radius: 4px;
		display: flex;
		gap: 12px;
		align-items: center;
		font-size: var(--12pt);
		backdrop-filter: blur(4px);
	}
	.drafts-enabled-banner button {
		background: black;
		color: white;
		padding: 4px 8px;
		border-radius: 4px;
		border: 0;
	}
</style>
