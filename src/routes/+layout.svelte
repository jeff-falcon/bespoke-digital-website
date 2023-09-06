<script lang="ts">
	import TopNav from '$lib/ui/nav/TopNav.svelte';
	import { PUBLIC_GA4_TAG_ID } from '$env/static/public';
	import 'video.js';
	import 'video.js/dist/video-js.css';
	import './styles.css';
	// import 'swiper/css';
	// import 'swiper/css/modules/navigation';
	import Footer from '$lib/ui/nav/Footer.svelte';
	import type { LayoutData } from './$types';
	import { footerHasContactForm, isMenuOpenComplete, inputBorderIsRounded } from '$lib/store';

	export let data: LayoutData;

	const style =
		data.config.borderRadius != null ? `--input-border-radius: ${data.config.borderRadius}px` : '';

	inputBorderIsRounded.set(data.config.borderRadius != null && data.config.borderRadius > 0);
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

<main class:isDisabled={$isMenuOpenComplete} {style}>
	<slot />
</main>

<Footer config={data.config} hasContactForm={$footerHasContactForm} />

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

<style>
	main {
		width: 100%;
		overflow-x: hidden;
		overflow-y: auto;
	}
	main.isDisabled {
		visibility: hidden;
	}
</style>
