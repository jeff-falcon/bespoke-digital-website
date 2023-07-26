<script lang="ts">
	import ProjectThumb from '$lib/ui/project/ProjectThumb.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Bespoke Digital" />
</svelte:head>

<div class="gutter">
	<section class="projects">
		{#if data.components}
			{#each data.components as component}
				{#if component._type === 'project_grid'}
					{#each component.projects as project}
						<ProjectThumb {project} />
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
