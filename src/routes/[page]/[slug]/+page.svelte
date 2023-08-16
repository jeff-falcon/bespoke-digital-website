<script lang="ts">
	import type { PageData } from './$types';
	import ProjectComponent from '$lib/ui/project/Project.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.project?.pageTitle ?? 'Work | Bespoke Digital'}</title>
	<meta name="description" content="Bespoke Digital" />
</svelte:head>

{#if data.project}
	<ProjectComponent project={data.project} />
{/if}
