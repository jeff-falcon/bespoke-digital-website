<script lang="ts">
	import type { Page } from '$lib/types';
	import ProjectGrid from '$lib/ui/project/ProjectGrid.svelte';
	import { onMount } from 'svelte';
	import LogoGrid from '../logos/LogoGrid.svelte';
	import Hero from './Hero.svelte';
	import { pageHasHero } from '$lib/store';

	export let data: Page;

	onMount(() => {
		pageHasHero.set(data.hero != null);
	});
</script>

<svelte:head>
	<title>{data.name ?? 'Home'} | Bespoke Digital</title>
	<meta name="description" content={data.description ?? 'Bespoke Digital'} />
</svelte:head>

<div class="page" class:hasHero={data.hero != null}>
	{#if data.hero}
		<Hero data={data.hero} />
	{/if}
	{#if data.components}
		{#each data.components as component}
			{#if component._type === 'project_grid'}
				<ProjectGrid projects={component.projects} />
			{/if}
			{#if component._type === 'logo_grid'}
				<LogoGrid data={component} />
			{/if}
		{/each}
	{/if}
</div>

<style>
	.page:not(.hasHero) {
		padding-top: var(--top-nav-height);
	}
</style>
