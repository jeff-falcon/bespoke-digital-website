<script lang="ts">
	import { page } from '$app/state';
	import type { ColumnedText } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';

	interface Props {
		data: ColumnedText;
	}

	let { data }: Props = $props();

	let hasTitle = $derived(data.title && data.title.length > 0);
	let hasPreTitle = $derived(data.pre_title && data.pre_title.length > 0);
	let hasBorderedTitle = $derived(hasTitle && data.borderedTitle);

	function getTarget(url: string) {
		if (url.startsWith('http') && !url.startsWith(page.url.origin)) {
			return '_blank';
		}
		return '_self';
	}
</script>

<section
	class="columned-text gutter bg-{data.bgColor ?? 'transparent'}"
	class:hasBorderedTitle
	class:indented={data.indented}
>
	<div class="wrap" class:hasTitle class:hasPreTitle>
		{#if hasPreTitle}
			<h5 class="pre-title">{data.pre_title}</h5>
		{/if}
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
					{#if column.button?.button_title && column.button?.button_url}
						<a
							class="button"
							href={column.button.button_url}
							target={getTarget(column.button.button_url)}>{column.button.button_title}</a
						>
					{/if}
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
	.columns :global(p) {
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
	.hasPreTitle:not(.hasTitle) h5 {
		margin-bottom: var(--32pt);
	}
	.button {
		margin-top: var(--24pt);
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
			margin: var(--16pt) 0;
		}
		.wrap .title {
			margin: 0 0 var(--32pt);
		}
		section:not(.hasBorderedTitle) .wrap .title {
			margin-bottom: 56px;
		}
		.columns :global(p) {
			font-size: var(--20pt);
			line-height: var(--32pt);
		}
		.hasBorderedTitle .wrap .title {
			margin-bottom: 56px;
			padding-bottom: 48px;
		}
		.button {
			margin-top: var(--32pt);
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
