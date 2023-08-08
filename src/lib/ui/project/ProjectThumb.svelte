<script lang="ts">
	import type { Project, ProjectMedia } from '$lib/types';
	import ProjectMediaComponent from '$lib/ui/project/ProjectMediaComponent.svelte';

	const randomId = crypto.randomUUID().toString();

	export let project: Project;
	export let size: 'half' | 'full' = 'half';

	$: isFull = size === 'full';

	let media: ProjectMedia;
	$: media = {
		_type: 'project_media',
		_key: project.slug,
		name: project.name,
		kind: project.thumb_vimeo_src ? 'video-bg' : 'image',
		image: project.image,
		thumb_vimeo_src: project.thumb_vimeo_src,
		thumb_vimeo_src_hd: project.thumb_vimeo_src_hd
	};
	$: name = project.shortName || project.name;
</script>

<article class="project" class:isFull>
	<a href="/work/{project.slug}">
		<div class="thumbnail">
			<ProjectMediaComponent {media} cover={true} />
		</div>
		<div class="info">
			<h2 class="title">{name}</h2>
			{#if project.client}
				<h3 class="subtitle">{project.client}</h3>
			{/if}
		</div>
	</a>
</article>

<style>
	.project {
		--aspect-pct: 100%;
	}
	.project.isFull {
		--aspect-pct: 194%;
	}
	.project a {
		display: block;
		text-decoration: none;
	}
	.thumbnail {
		padding-top: var(--aspect-pct);
		position: relative;
	}
	.info {
		margin-top: var(--18pt);
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.info .title {
		font-size: var(--18pt);
		text-transform: uppercase;
		line-height: var(--24pt);
		font-weight: bold;
		display: inline-block;
		margin: 0;
	}
	.info .subtitle {
		font-size: var(--14pt);
		opacity: 0.6;
		line-height: var(--16pt);
		font-weight: normal;
		display: inline;
		white-space: nowrap;
		margin: 0;
	}
	@media (min-width: 560px) {
		.project {
			--aspect-pct: 81.78%;
		}
		.project.isFull {
			--aspect-pct: 63.2%;
			grid-column: 1 / span 2;
		}
		.info {
			display: block;
			margin-top: var(--32pt);
		}
		.info .title {
			margin-right: var(--16pt);
			font-size: var(--20pt);
		}
		.info .subtitle {
			font-size: var(--16pt);
			line-height: var(--24pt);
		}
	}
</style>