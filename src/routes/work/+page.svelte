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

<div class="gutter">
	<section class="projects">
		{#each data.projects as project}
			<article class="project">
				<a href="/work/{project.slug.current}">
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
						<h2 class="name">{project.name}</h2>
						<h3 class="client">{project.client}</h3>
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
	.info {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}
	.info .name {
		font-size: 1.25rem;
		text-transform: uppercase;
		line-height: 1.5rem;
		font-weight: normal;
	}
	.info .client {
		font-size: 1rem;
		opacity: 0.6;
		line-height: 1.5rem;
		font-weight: normal;
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
