<script lang="ts">
	import type { Quote } from '$lib/types';

	export let data: Quote;
	export let withGutter = true;
</script>

<section class="quote-section bg-transparent" class:gutter={withGutter}>
	<div class="wrap">
		{#if data.quote}
			<h2 class="quote" class:green={data.textColor === 'green'}>"{data.quote}"</h2>
		{/if}

		{#if data.byline}
			<div class="byline-row">
				<p class="byline">— {data.byline}</p>
				{#if data.image}
					<img
						src={data.image.url}
						alt={data.byline}
						width={data.image.width}
						height={data.image.height}
					/>
				{/if}
			</div>
		{/if}
	</div>
</section>

<style>
	section {
		padding-top: 3rem;
		padding-bottom: 3rem;
	}
	.wrap :global(> :first-child) {
		margin-top: 0;
	}
	.wrap :global(> :last-child) {
		margin-bottom: 0;
	}
	.quote {
		font-size: var(--40pt);
		line-height: var(--48pt);
		margin-bottom: var(--40pt);
	}
	.quote.green {
		color: var(--text-highlight);
	}
	.byline-row {
		display: flex;
		flex-direction: column;
		gap: 32px;
		align-items: flex-end;
	}
	.byline {
		font-size: var(--18pt);
		line-height: var(--24pt);
		color: var(--text-light-60);
		margin: 0;
		order: 2;
	}
	img {
		width: 160px;
		height: auto;
		object-fit: contain;
		border-radius: 8px;
	}
	@media (min-width: 720px) {
		section {
			padding-top: 4rem;
			padding-bottom: 4rem;
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			gap: var(--gutter-lg);
		}
		.wrap {
			grid-column: 1 / span 12;
		}
		.quote {
			font-size: 3.5rem;
			line-height: 5rem;
		}
		img {
			width: 210px;
			order: 2;
		}
		.byline-row {
			flex-direction: row;
			gap: 32px;
			align-items: center;
			justify-content: flex-end;
		}
		.byline {
			order: 1;
		}
	}
	@media (min-width: 1200px) {
		.wrap {
			grid-column: 2 / span 10;
		}
	}
</style>
