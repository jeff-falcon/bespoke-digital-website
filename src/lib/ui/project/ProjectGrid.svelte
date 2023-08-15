<script lang="ts">
	import type { Project, ProjectGrid } from '$lib/types';

	import ProjectThumb from './ProjectThumb.svelte';
	export let data: ProjectGrid;
</script>

<section class="project-grid gutter">
	{#if data.title}
		<h2>{data.title}</h2>
	{/if}
	<div class="projects">
		{#each data.projects as project, index}
			<ProjectThumb {project} size={index === 0 && data.useFeature ? 'full' : 'half'} />
		{/each}
	</div>
</section>

<style>
	.projects {
		display: flex;
		gap: 36px var(--gutter-sm);
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
