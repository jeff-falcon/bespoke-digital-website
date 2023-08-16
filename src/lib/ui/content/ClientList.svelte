<script lang="ts">
	import type { ClientList } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';

	export let data: ClientList;
</script>

<section class="client-list gutter">
	{#if data.title}
		<h1 class="title">{data.title}</h1>
	{/if}

	<div class="clients">
		{#each data.clients as client}
			<p>{client}</p>
		{/each}
	</div>
</section>

<style>
	section {
		margin: 6rem 0;
	}
	.title {
		border-bottom: 1px solid var(--text-light-15);
		padding-bottom: 32px;
		margin-bottom: 32px;
	}
	.clients {
		font-size: var(--18pt);
		line-height: var(--24pt);
		opacity: 0.6;
		columns: 2;
	}
	.clients p {
		font-size: inherit;
		line-height: inherit;
	}
	@media (min-width: 720px) {
		section {
			margin: 8rem 0;
		}
		.clients {
			font-size: var(--20pt);
			line-height: var(--32pt);
		}
		.title {
			padding-bottom: 40px;
			margin-bottom: 50px;
		}
	}
	@media (min-width: 960px) {
		.clients {
			columns: 4;
		}
	}
	.clients p {
		margin: 0;
	}
</style>
