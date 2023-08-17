<script lang="ts">
	import type { Page } from '$lib/types';
	import ProjectGrid from '$lib/ui/project/ProjectGrid.svelte';
	import { onMount } from 'svelte';
	import LogoGrid from '../logos/LogoGrid.svelte';
	import Hero from './Hero.svelte';
	import { bgColor, footerHasContactForm, pageHasHero } from '$lib/store';
	import ProjectMediaComponent from '../project/ProjectMediaComponent.svelte';
	import TextOnly from '../content/TextOnly.svelte';
	import ColumnedText from '../content/ColumnedText.svelte';
	import ClientList from '../content/ClientList.svelte';
	import Form from '../form/Form.svelte';

	export let data: Page;

	onMount(() => {
		pageHasHero.set(data.hero != null);
		bgColor.set(data.bgColor || 'default');
		document.body.className = `bg-${$bgColor}`;
		footerHasContactForm.set(data.footerHasContactForm);
		console.log({
			bgColor: data.bgColor || 'default',
			footerHasContactForm: data.footerHasContactForm
		});
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
				<ProjectGrid data={component} />
			{/if}
			{#if component._type === 'logo_grid'}
				<LogoGrid data={component} />
			{/if}
			{#if component._type === 'project_media'}
				<section class="project-media-single gutter">
					<ProjectMediaComponent media={component} />
				</section>
			{/if}
			{#if component._type === 'text_only'}
				<TextOnly data={component} />
			{/if}
			{#if component._type === 'columned_text'}
				<ColumnedText data={component} />
			{/if}
			{#if component._type === 'client_list'}
				<ClientList data={component} />
			{/if}
			{#if component._type === 'form'}
				<Form data={component} />
			{/if}
		{/each}
	{/if}
</div>

<style>
	.page {
		--section-spacing: 3rem;
	}
	.page:not(.hasHero) {
		padding-top: var(--top-nav-height);
	}
	.project-media-single {
		padding-top: var(--section-spacing);
		padding-bottom: var(--section-spacing);
	}
	@media (min-width: 720px) {
		.page {
			--section-spacing: 4rem;
		}
	}
	.page :global(section:first-of-type[class*='project-grid']) {
		padding-top: 0;
	}
</style>
