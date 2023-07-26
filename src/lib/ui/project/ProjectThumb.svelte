<script lang="ts">
	import type { Project } from '$lib/types';
	import VimeoBG from '$lib/ui/video/VimeoBG_VJS.svelte';

	const randomId = crypto.randomUUID().toString();

	export let project: Project;
</script>

<article class="project">
	<a href="/work/{project.slug}">
		<div class="thumbnail">
			{#if project.thumb_vimeo_src}
				<VimeoBG id={project.slug || randomId} src={project.thumb_vimeo_src} />
			{:else if project.image}
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

<style>
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
		.thumbnail {
			padding-top: 81.78%;
			position: relative;
		}
		.thumbnail img {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
</style>
