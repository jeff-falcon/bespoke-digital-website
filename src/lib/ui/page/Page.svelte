<script lang="ts">
	import type { Page } from '$lib/types';
	import ProjectGrid from '$lib/ui/project/ProjectGrid.svelte';
	import { onMount } from 'svelte';
	import LogoGrid from '../logos/LogoGrid.svelte';
	import Hero from './Hero.svelte';
	import { pageHasHero } from '$lib/store';
	import ProjectMediaComponent from '../project/ProjectMediaComponent.svelte';
	import TextOnly from '../content/TextOnly.svelte';
	import ColumnedText from '../content/ColumnedText.svelte';

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
		{#each data.components as component (component)}
			{#if component._type === 'project_grid'}
				<ProjectGrid projects={component.projects} />
			{/if}
			{#if component._type === 'logo_grid'}
				<LogoGrid data={component} />
			{/if}
			{#if component._type === 'project_media'}
				<div class="project-media gutter">
					<ProjectMediaComponent media={component} />
				</div>
			{/if}
			{#if component._type === 'text_only'}
				<div class="text-only">
					<TextOnly data={component} />
				</div>
			{/if}
			{#if component._type === 'columned_text'}
				<div class="columned_text">
					<ColumnedText data={component} />
				</div>
			{/if}
		{/each}
	{/if}
</div>

<style>
	.page:not(.hasHero) {
		padding-top: var(--top-nav-height);
	}
	.project-media {
		margin: var(--gutter-sm) 0;
	}
	@media (min-width: 560px) {
		.project-media {
			margin: var(--gutter-lg) 0;
		}
	}
</style>
