<script lang="ts">
	import type { Project } from '$lib/types';

	import ProjectThumb from './ProjectThumb.svelte';
	export let projects: Project[];
</script>

<section class="projects gutter">
	{#each projects as project, index}
		<ProjectThumb {project} size={index === 0 ? 'full' : 'half'} />
	{/each}
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
