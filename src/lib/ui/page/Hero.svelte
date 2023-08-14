<script lang="ts">
	import type { Hero, Project, ProjectMedia } from '$lib/types';
	import ArrowButton from '$lib/ui/button/ArrowButton.svelte';
	import ProjectMediaComponent from '../project/ProjectMediaComponent.svelte';

	export let data: Hero;

	let media: ProjectMedia;
	$: media = {
		_key: 'hero',
		_type: 'project_media',
		name: '',
		kind: data.kind,
		image: data.image_desktop,
		vimeoSrc: data.vimeoSrc,
		vimeoSrcHd: data.vimeoSrcHd
	};
</script>

<section class="hero">
	<div class="info gutter">
		{#if data.name}
			<h1 class="title">{data.name}</h1>
		{/if}
		{#if data.subtitle}
			<p class="subtitle">{data.subtitle}</p>
		{/if}
		{#if data.project}
			<a href="/work/{data.project.slug}" class="project">
				<div class="name-client">
					<h4 class="name">{data.project.name}</h4>
					<p class="client">{data.project.client}</p>
				</div>
				<div class="arrow">
					<ArrowButton title="View Project" isTitleHiddenOnMobile={true} />
				</div>
			</a>
		{/if}
	</div>
	<div class="bg">
		<ProjectMediaComponent {media} cover={true} scaleOnReveal={false} />
	</div>
</section>

<style>
	section {
		position: relative;
		height: 100svh;
	}
	.bg {
		z-index: 0;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.7;
	}
	.info {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		height: 100%;
		padding-bottom: var(--16pt);
	}
	.title {
		font-size: var(--38pt);
		line-height: var(--40pt);
		margin: 0;
	}
	.subtitle {
		font-size: var(--24pt);
		line-height: var(--32pt);
		margin: var(--16pt) 0 0;
	}
	.project {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid var(--text-light-30);
		padding-top: var(--12pt);
		margin-top: var(--18pt);
		gap: 16px;
	}
	.project:hover {
		text-decoration: none;
	}
	.name-client .name,
	.name-client .client {
		margin: 0;
		line-height: var(--24pt);
	}
	.name-client .name {
		text-transform: uppercase;
		font-weight: bold;
		font-size: var(--16pt);
	}
	.name-client .client {
		font-size: var(--14pt);
	}
	@media (min-width: 560px) {
		.info {
			padding-left: calc(50% + var(--gutter-lg) * 0.5);
			padding-bottom: 72px;
		}
	}
</style>
