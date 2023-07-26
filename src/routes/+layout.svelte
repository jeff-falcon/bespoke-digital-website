<script>
	import TopNav from '$lib/ui/nav/TopNav.svelte';
	import 'video.js';
	import 'video.js/dist/video-js.css';
	import './styles.css';
</script>

<TopNav />

<main>
	<slot />
</main>

<footer class="gutter">
	<p>© {new Date().getFullYear()} Bespoke Digital</p>
</footer>

<style>
	main {
		width: 100%;
		overflow-x: hidden;
		overflow-y: auto;
		padding-top: var(--top-nav-height);
	}
</style>
