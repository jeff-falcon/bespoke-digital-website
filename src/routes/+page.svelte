<script lang="ts">
	import type { PageData } from './$types';
	import { PortableText } from '@portabletext/svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Bespoke Digital" />
</svelte:head>

<h1>Projects</h1>
{#each data.projects as project}
	<section>
		<a href="/work/{project.slug.current}">
			<h2>{project.client}</h2>
			<h3>{project.name}</h3>
			<div class="description">
				<PortableText value={project.description} />
			</div>
			<div class="thumbnail">
				<img
					src={project.image.secure_url}
					width={project.image.width}
					height={project.image.height}
					alt={project.name}
				/>
			</div>
		</a>
	</section>
{/each}

<style>
</style>
