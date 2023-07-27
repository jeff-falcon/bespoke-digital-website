<script lang="ts">
	import type { Project } from '$lib/types';
	import VimeoBG from '$lib/ui/video/VimeoBG_VJS.svelte';

	const randomId = crypto.randomUUID().toString();

	export let project: Project;
	export let size: 'half' | 'full' = 'half';

	$: isFull = size === 'full';
</script>

<article class="project" class:isFull>
	<a href="/work/{project.slug}">
		<div class="thumbnail">
			{#if project.thumb_vimeo_src}
				<VimeoBG
					id={project.slug || randomId}
					src={isFull && project.thumb_vimeo_src_hd
						? project.thumb_vimeo_src_hd
						: project.thumb_vimeo_src}
					placeholder={project.image?.secure_url ?? ''}
				/>
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
			{#if project.client}
				<h3 class="client">{project.client}</h3>
			{/if}
		</div>
	</a>
</article>

<style>
	.project {
		--aspect-pct: 81.78%;
	}
	.project.isFull {
		--aspect-pct: 63.2%;
		grid-column: 1 / span 2;
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
		.thumbnail {
			padding-top: var(--aspect-pct);
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
