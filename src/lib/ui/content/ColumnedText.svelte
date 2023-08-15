<script lang="ts">
	import type { ColumnedText } from '$lib/types';

	export let data: ColumnedText;
</script>

<section class="columned-text gutter">
	<div class="wrap">
		{#if data.title}
			<h1>{data.title}</h1>
		{/if}
	</div>

	{#if data.body?.length ?? 0}
		<div class="columns" style="--max-columns: {data.body.length}">
			{#each data.body as column (column)}
				<div class="column">
					<h2 class="title">{column.title}</h2>
					<hr />
					<div class="body">
						<p>{column.description}</p>
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
	@media (min-width: 560px) {
		section {
			margin: 8rem 0;
		}
		.wrap {
			width: 75%;
		}
		.columns {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-gap: var(--gutter-lg);
		}
	}
	@media (min-width: 768px) {
		.columns {
			display: grid;
			grid-template-columns: repeat(var(--max-columns), 1fr);
			grid-gap: var(--gutter-lg);
		}
		.wrap {
			width: 50%;
		}
	}
	.column hr {
		width: 48px;
		height: 1px;
		background: var(--text-light);
		opacity: 0.15;
		border: 0;
		margin: var(--16pt) 0 var(--24pt);
	}
</style>
