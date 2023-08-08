<script lang="ts">
	import type { Hero, Project } from '$lib/types';
	import ArrowButton from '$lib/ui/button/ArrowButton.svelte';

	export let data: Hero;
</script>

<section class="hero">
	<div class="info gutter">
		{#if data.name}
			<h1>{data.name}</h1>
		{/if}
		{#if data.client}
			<p>{data.client}</p>
		{/if}
		{#if data.description}
			<p>{data.description}</p>
		{/if}
		{#if data.project}
			<a href="/work/{data.project.slug}" class="project">
				<div class="name-client">
					<h4 class="name">{data.project.name}</h4>
					<p class="client">{data.project.client}</p>
				</div>
				<div class="arrow">
					<ArrowButton />
				</div>
			</a>
		{/if}
	</div>
	{#if data.image_desktop?.url}
		<picture class="image">
			{#if data.image_mobile?.url}
				<source media="(max-width: 767px)" srcset={data.image_mobile.url} />
				<source media="(min-width: 768px)" srcset={data.image_desktop.url} />
				<img src={data.image_mobile.url} alt="Hero" />
			{:else}
				<img src={data.image_desktop.url} alt="Hero" />
			{/if}
		</picture>
	{/if}
</section>

<style>
	section {
		position: relative;
		height: 100svh;
	}
	picture,
	img {
		object-fit: cover;
		object-position: top center;
		display: block;
		width: 100%;
		height: 100%;
	}
	picture {
		z-index: 0;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.8;
	}
	.info {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		height: 100%;
		padding-left: calc(50% + var(--gutter-lg) * 0.5);
		padding-bottom: 72px;
	}
</style>
