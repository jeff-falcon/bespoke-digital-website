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
	@media (min-width: 560px) {
		section {
			margin: 8rem 0;
		}
		.wrap {
			width: 75%;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 50%;
		}
	}
</style>
