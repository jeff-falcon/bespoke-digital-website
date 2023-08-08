<script lang="ts">
	import TopNav from '$lib/ui/nav/TopNav.svelte';
	import 'video.js';
	import 'video.js/dist/video-js.css';
	import './styles.css';
	import Footer from '$lib/ui/nav/Footer.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<TopNav />

<main>
	<slot />
</main>

<Footer config={data.config} />

<style>
	main {
		width: 100%;
		overflow-x: hidden;
		overflow-y: auto;
		padding-top: var(--top-nav-height);
	}
</style>
