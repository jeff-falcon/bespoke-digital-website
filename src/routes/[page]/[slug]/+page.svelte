<script lang="ts">
	import type { Project } from '$lib/types';
	import ProjectMediaComponent from '$lib/ui/project/ProjectMediaComponent.svelte';
	import type { PageData } from './$types';
	import { PortableText } from '@portabletext/svelte';

	export let data: PageData;

	let project: Project | undefined;
	$: project = data.project;
</script>

<svelte:head>
	<title>{project?.pageTitle ?? 'Work | Bespoke Digital'}</title>
	<meta name="description" content="Bespoke Digital" />
</svelte:head>

{#if project}
	{#if project && project.name}
		<section class="gutter project-info">
			<h3 class="project-name">{project.name}</h3>
			{#if project.description}
				<div class="description">
					<PortableText value={project.description} />
				</div>
			{/if}
			{#if project.credits}
				<div class="credits">
					{#each project.credits as credit}
						<div class="credit">
							<h3 class="name">{credit.name}</h3>
							<p class="value">{credit.credit}</p>
						</div>
					{/each}
				</div>
			{/if}
		</section>
		{#if project.media}
			<section class="medias gutter">
				{#each project.media as item, index}
					{#if item._type === 'project_media'}
						<ProjectMediaComponent media={item} scaleOnReveal={index === 0} />
					{/if}
					{#if item._type === 'item_pair'}
						<div class="pair">
							<ProjectMediaComponent media={item.left} scaleOnReveal={index === 0} />
							<ProjectMediaComponent media={item.right} scaleOnReveal={index === 0} />
						</div>
					{/if}
				{/each}
			</section>
		{/if}
	{/if}
{/if}

<style>
	.medias,
	.pair {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: var(--gutter-sm);
	}
	.project-info {
		display: grid;
		grid-template-areas:
			'description'
			'project-name'
			'credits';
		padding-top: 64px;
		padding-bottom: 40px;
	}
	.description {
		grid-area: description;
	}
	.description :global(p) {
		font-size: var(--18pt);
		line-height: var(--24pt);
	}
	.description :global(> p:first-of-type) {
		margin-top: 0;
	}
	.description :global(> p:last-of-type) {
		margin-bottom: 0;
	}
	.project-name {
		grid-area: project-name;
		font-size: var(--18pt);
		line-height: var(--24pt);
		margin: var(--32pt) 0 var(--16pt);
		padding-top: var(--32pt);
		font-weight: bold;
		border-top: 1px solid rgba(255, 255, 255, 0.15);
	}
	.credits {
		grid-area: credits;
	}
	.credits .name,
	.credits .value {
		font-size: var(--14pt);
		line-height: var(--24px);
		margin: 0;
	}
	.credits .name {
		font-weight: bold;
	}
	.credits .value {
		font-weight: normal;
	}
	.credit + .credit {
		margin-top: var(--24pt);
	}

	@media (min-width: 720px) {
		.medias {
			gap: var(--gutter-lg);
		}
		.pair {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: var(--gutter-lg);
		}
	}
	@media (min-width: 960px) {
		.project-info {
			grid-template-areas:
				'description project-name'
				'description credits';
			grid-template-columns: 8fr 4fr;
			grid-template-rows: auto 1fr;
			gap: 40px calc(var(--gutter-lg) + var(--column-width));
			padding-top: 128px;
			padding-bottom: 68px;
		}
		.project-name {
			font-size: var(--20pt);
			margin: 0;
			padding-top: 0;
			border-top: 0;
		}
		.credits .name,
		.credits .value {
			font-size: var(--16pt);
		}
		.description :global(p) {
			font-size: var(--20pt);
			line-height: var(--32pt);
		}
	}
</style>
