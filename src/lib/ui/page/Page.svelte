<script lang="ts">
	import type { Page } from '$lib/types';
	import ProjectThumb from '$lib/ui/project/ProjectThumb.svelte';

	export let data: Page;
</script>

<svelte:head>
	<title>{data.name ?? 'Home'} | Bespoke Digital</title>
	<meta name="description" content={data.description ?? 'Bespoke Digital'} />
</svelte:head>

<div class="gutter">
	<section class="projects">
		{#if data.components}
			{#each data.components as component}
				{#if component._type === 'project_grid'}
					{#each component.projects as project, index}
						<ProjectThumb {project} size={index === 0 ? 'full' : 'half'} />
					{/each}
				{/if}
			{/each}
		{/if}
	</section>
</div>

<style>
	.projects {
		display: flex;
		gap: 32px var(--gutter-sm);
		flex-direction: column;
	}
	@media (min-width: 560px) {
		.projects {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 72px var(--gutter-lg);
		}
	}
</style>
