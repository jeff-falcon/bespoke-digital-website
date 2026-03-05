<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { getContrastYIQFromColor } from '$lib/color';
	import { store } from '$lib/store.svelte';
	import ProjectComponent from '$lib/ui/project/Project.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	onMount(() => {
		updatePageSettings();
	});

	afterNavigate(() => {
		updatePageSettings();
	});

	function updatePageSettings() {
		store.pageHasHero = false;
		const defaultBg = getComputedStyle(document.documentElement).getPropertyValue('--bg-dark');
		const color = data.project?.bgColor || defaultBg;
		store.bgColor = color;
		document.body.style.setProperty('--page-bg-color', color);
		document.body.className = `bg-is-${
			getContrastYIQFromColor(store.bgColor) === 'white' ? 'dark' : 'light'
		}`;
		document.body.style.backgroundColor = store.bgColor;
	}
</script>

<svelte:head>
	<title>{data.project?.pageTitle ?? 'Work | Bespoke Digital'}</title>
	<meta name="description" content={data.project?.metaDescription || 'Bespoke Digital'} />
</svelte:head>

{#if data.project}
	{#key data.project._id}
		<ProjectComponent project={data.project} />
	{/key}
{/if}
