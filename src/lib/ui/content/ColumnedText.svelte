<script lang="ts">
	import type { ColumnedText } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';

	export let data: ColumnedText;

	$: hasBorderedTitle = data.title && data.title.length > 0 && data.borderedTitle;
</script>

<section class="columned-text gutter" class:hasBorderedTitle>
	<div class="wrap">
		{#if data.title}
			<h1 class="title">{data.title}</h1>
		{/if}
	</div>

	{#if data.body?.length ?? 0}
		<div class="columns" style="--max-columns: {data.body.length}">
			{#each data.body as column (column)}
				<div class="column">
					<h2 class="title">{column.title}</h2>
					<hr />
					<div class="body">
						<PortableText value={column.body} />
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>

<style>
	section {
		margin: 6rem 0;
	}
	.column hr {
		width: 48px;
		height: 1px;
		background: var(--text-light);
		opacity: 0.15;
		border: 0;
		margin: var(--16pt) 0;
	}
	.body {
		opacity: 0.6;
	}
	.hasBorderedTitle .wrap .title {
		border-bottom: 1px solid var(--text-light-15);
		padding-bottom: 32px;
		margin-bottom: 32px;
	}
	.hasBorderedTitle hr {
		display: none;
	}
	.hasBorderedTitle .columns :global(p) {
		font-size: var(--18pt);
		line-height: var(--24pt);
	}
	.columns {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: 40px;
	}
	.column .title {
		margin-top: 0;
	}
	.column .body :global(p:first-of-type) {
		margin-top: 0;
	}
	.column .body :global(p:last-of-type) {
		margin-bottom: 0;
	}
	@media (min-width: 720px) {
		section {
			margin: 8rem 0;
		}
		.columns {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: var(--gutter-lg);
		}
		.column hr {
			margin: var(--16pt) 0 var(--24pt);
		}
	}
	.hasBorderedTitle .columns :global(p) {
		font-size: var(--20pt);
		line-height: var(--32pt);
	}
	@media (min-width: 960px) {
		.columns {
			display: grid;
			grid-template-columns: repeat(var(--max-columns), 1fr);
			gap: var(--gutter-lg);
		}
	}
</style>
