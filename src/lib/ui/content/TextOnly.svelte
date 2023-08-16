<script lang="ts">
	import type { TextOnly } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';

	export let data: TextOnly;
</script>

<section class="text-only gutter">
	<div class="wrap">
		{#if data.title}
			<h1>{data.title}</h1>
		{/if}

		<PortableText value={data.body} />
	</div>
</section>

<style>
	section {
		margin: 6rem 0;
	}
	@media (min-width: 720px) {
		section {
			margin: 8rem 0;
		}
		.text-only {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			gap: var(--gutter-lg);
		}
		.wrap {
			grid-column: 1 / span 10;
		}
	}
</style>
