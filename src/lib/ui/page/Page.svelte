<script lang="ts">
	import type { Page } from '$lib/types';
	import ProjectGrid from '$lib/ui/project/ProjectGrid.svelte';

	export let data: Page;
</script>

<svelte:head>
	<title>{data.name ?? 'Home'} | Bespoke Digital</title>
	<meta name="description" content={data.description ?? 'Bespoke Digital'} />
</svelte:head>

<div class="page">
	{#if data.components}
		{#each data.components as component}
			{#if component._type === 'project_grid'}
				<ProjectGrid projects={component.projects} />
			{/if}
		{/each}
	{/if}
</div>
