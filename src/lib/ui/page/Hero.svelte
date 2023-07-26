<script lang="ts">
	import type { Project } from '$lib/types';
	import ArrowButton from '$lib/ui/button/ArrowButton.svelte';

	export let src: string = '';
	export let title: string = '';
	export let project: Project | null = null;
</script>

<section class="hero">
	<div class="info">
		{#if title}
			<h1>{title}</h1>
		{/if}
		{#if project}
			<a href="/work/{project.slug}" class="project">
				<div class="name-client">
					<h4 class="name">{project.name}</h4>
					<p class="client">{project.client}</p>
				</div>
				<div class="arrow">
					<ArrowButton />
				</div>
			</a>
		{/if}
	</div>
	{#if src}
		<div class="image"><img {src} alt="Hero" /></div>
	{/if}
</section>
