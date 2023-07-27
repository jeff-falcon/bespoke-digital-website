<script lang="ts">
	import type { Project } from '$lib/types';
	import ProjectMedia from '$lib/ui/project/ProjectMedia.svelte';
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
		<section class="gutter">
			<h2>{project.client}</h2>
			<h3>{project.name}</h3>
			{#if project.description}
				<div class="description">
					<PortableText value={project.description} />
				</div>
			{/if}
		</section>
		{#if project.media}
			<section class="medias gutter">
				{#each project.media as item}
					{#if item._type === 'project_media'}
						<ProjectMedia media={item} />
					{/if}
					{#if item._type === 'item_pair'}
						<div class="pair">
							<ProjectMedia media={item.left} />
							<ProjectMedia media={item.right} />
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
	@media (min-width: 560px) {
		.medias {
			gap: var(--gutter-lg);
		}
		.pair {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: var(--gutter-lg);
		}
	}
</style>
