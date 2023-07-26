<script lang="ts">
	import VimeoBg from '$lib/ui/video/VimeoBG_VJS.svelte';
	import type { PageData } from './$types';
	import { PortableText } from '@portabletext/svelte';
	export let data: PageData;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Bespoke Digital" />
</svelte:head>

<h1>Projects</h1>

<div class="gutter">
	<section class="projects">
		{#each data.projects as project}
			<article class="project">
				<a href="/work/{project.slug}">
					<div class="thumbnail">
						{#if project.thumb_vimeo_src}
							<VimeoBg id={project.slug} src={project.thumb_vimeo_src} />
						{:else}
							<img
								src={project.image.secure_url}
								width={project.image.width}
								height={project.image.height}
								alt={project.name}
							/>
						{/if}
					</div>
					<div class="info">
						<h2>{project.client}</h2>
						<h3>{project.name}</h3>
					</div>
				</a>
			</article>
		{/each}
	</section>
</div>

<style>
	.projects {
		display: flex;
		gap: 32px var(--gutter-sm);
		flex-direction: column;
	}
	.project img {
		display: block;
		object-fit: cover;
		object-position: center;
	}
	.project a {
		display: block;
		text-decoration: none;
	}
	@media (min-width: 560px) {
		.projects {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 72px var(--gutter-lg);
		}
		.thumbnail {
			padding-top: 122%;
			position: relative;
		}
		.thumbnail img,
		.thumbnail iframe {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
</style>
