<script lang="ts">
	import type { Text2Column } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';
	import LargeParagraph from './LargeParagraph.svelte';
	import StylizedList from './StylizedList.svelte';

	interface Props {
		data: Text2Column;
		withGutter?: boolean;
	}

	let { data, withGutter = true }: Props = $props();
</script>

<section
	class="text-2col bg-{data.bgColor ?? 'transparent'}"
	class:indented={data.indented !== false}
	class:gutter={withGutter}
>
	<div class="wrap">
		<div class="col1">
			<PortableText
				value={data.col1}
				components={{
					list: StylizedList,
					block: { p: LargeParagraph },
					unknownBlockStyle: LargeParagraph
				}}
			/>
		</div>
		<div class="col2">
			<PortableText
				value={data.col2}
				components={{
					list: StylizedList,
					block: { p: LargeParagraph },
					unknownBlockStyle: LargeParagraph
				}}
			/>
		</div>
	</div>
</section>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		gap: var(--32pt);
	}
	.text-2col {
		padding-top: 80px;
		padding-bottom: 88px;
	}
	.text-2col.bg-transparent :global(+ .bg-transparent) {
		padding-top: 0;
	}
	.text-2col :global(h1) {
		font-size: var(--24pt);
		line-height: var(--32pt);
		margin-bottom: var(--32pt);
	}
	.text-2col :global(h4) {
		font-size: var(--18pt);
		line-height: var(--24pt);
		margin-bottom: var(--24pt);
	}
	.wrap :global(> div :first-child) {
		margin-top: 0;
	}
	.wrap :global(> div :last-child) {
		margin-bottom: 0;
	}
	@media (min-width: 720px) {
		.text-2col {
			padding-top: 96px;
			padding-bottom: 96px;
		}
		:global(section.hero + .text-2col) {
			padding-top: 132px;
		}
		.text-2col :global(h1) {
			line-height: var(--48pt);
			font-size: var(--40pt);
		}
		.text-2col :global(h4) {
			font-size: var(--20pt);
			line-height: var(--32pt);
			margin-bottom: var(--24pt);
		}
		.wrap {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			gap: var(--40pt);
		}
		.col1 {
			grid-column: 1 / span 6;
		}
		.col2 {
			grid-column: 7 / span 6;
		}
		.title {
			margin-bottom: var(--32pt);
		}
	}
	@media (min-width: 1200px) {
		.indented .col1 {
			grid-column: 2 / span 5;
		}
		.indented .col2 {
			grid-column: 7 / span 5;
		}
	}
</style>
