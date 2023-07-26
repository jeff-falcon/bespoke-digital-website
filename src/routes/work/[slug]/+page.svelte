<script lang="ts">
	import type { PageData } from './$types';
	import { PortableText } from '@portabletext/svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.pageTitle}</title>
	<meta name="description" content="Bespoke Digital" />
</svelte:head>

<h1>Project</h1>
{#if data && data.name}
	<section>
		<h2>{data.client}</h2>
		<h3>{data.name}</h3>
		{#if data.description}
			<div class="description">
				<PortableText value={data.description} />
			</div>
		{/if}
		<div class="thumbnail">
			{#if data.image?.secure_url}
				<img
					src={data.image.secure_url}
					width={data.image.width}
					height={data.image.height}
					alt={data.name}
				/>
			{/if}
		</div>
	</section>
{/if}

<style>
</style>
