<script lang="ts">
	import type { ColumnedText } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';

	export let data: ColumnedText;

	$: hasTitle = data.title && data.title.length > 0;
	$: hasBorderedTitle = hasTitle && data.borderedTitle;
</script>

<section
	class="columned-text gutter bg-{data.bgColor ?? 'transparent'}"
	class:hasBorderedTitle
	class:indented={data.indented}
>
	<div class="wrap">
		{#if hasTitle}
			<h2 class="title">{data.title}</h2>
		{/if}
	</div>

	{#if data.body?.length ?? 0}
		<div class="columns" style="--max-columns: {data.body.length}">
			{#each data.body as column (column)}
				<div class="column">
					{#if hasTitle}
						<h3 class="title">{column.title}</h3>
					{:else}
						<h2 class="title">{column.title}</h2>
					{/if}
					<hr />
					<div class="body">
						<PortableText value={column.body} components={{}} />
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>

<style>
	section {
		padding-top: 3rem;
		padding-bottom: 3rem;
	}
	.column hr {
		width: 48px;
		height: 1px;
		background: var(--text-color);
		opacity: 0.15;
		border: 0;
		margin: var(--16pt) 0;
	}
	.body {
		opacity: 0.6;
	}
	.wrap .title {
		margin: 0 0 var(--16pt);
	}
	.hasBorderedTitle .wrap .title {
		border-bottom: 1px solid var(--text-color-15);
		padding-bottom: var(--32pt);
		margin: 0 0 var(--32pt);
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
	section:not(.hasBorderedTitle) .wrap .title {
		margin-bottom: var(--48pt);
	}
	section:not(.hasBorderedTitle) .column .title {
		margin-bottom: 0;
	}
	.column .body :global(p:first-of-type) {
		margin-top: 0;
	}
	.column .body :global(p:last-of-type) {
		margin-bottom: 0;
	}
	.column .body :global(ul) {
		margin: 0;
		list-style-type: none;
		padding: 0;
	}
	.column .body :global(li) {
		margin: 0.5em 0;
	}
	@media (min-width: 560px) {
		.columns {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 40px var(--gutter-sm);
		}
	}
	@media (min-width: 720px) {
		section {
			padding-top: 4rem;
			padding-bottom: 4rem;
		}
		.columns {
			gap: 56px var(--gutter-lg);
		}
		.column hr {
			margin: var(--16pt) 0 var(--24pt);
		}
		.wrap .title {
			margin: 0 0 var(--32pt);
		}
		section:not(.hasBorderedTitle) .wrap .title {
			margin-bottom: 56px;
		}
		.hasBorderedTitle .columns :global(p) {
			font-size: var(--20pt);
			line-height: var(--32pt);
		}
		.hasBorderedTitle .wrap .title {
			margin-bottom: 56px;
			padding-bottom: 48px;
		}
	}
	@media (min-width: 768px) {
		.columns {
			grid-template-columns: repeat(var(--max-columns), 1fr);
		}
	}
	@media (min-width: 1200px) {
		section.indented {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			gap: 0 var(--gutter-lg);
			padding-top: 8rem;
			padding-bottom: 8rem;
		}
		section.indented .wrap {
			grid-row: 1;
			grid-column: 2 / span 10;
		}
		section.indented .columns {
			grid-row: 2;
			grid-column: 2 / span 10;
		}
	}
</style>
