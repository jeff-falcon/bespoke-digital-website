<script lang="ts">
	import type { Quote } from '$lib/types';
	import IntersectionObserver from 'svelte-intersection-observer';

	interface Props {
		data: Quote;
		withGutter?: boolean;
	}

	let { data, withGutter = true }: Props = $props();

	let isIntersecting = $state(false);
	let quoteEl = $state<HTMLElement>();
</script>

{#if data.quote}
	<section class="quote-section bg-transparent" class:gutter={withGutter} class:isIntersecting>
		<div class="wrap">
			<IntersectionObserver element={quoteEl} bind:intersecting={isIntersecting} once={false}>
				<h2 class="quote" class:green={data.textColor === 'green'} bind:this={quoteEl}>
					"{data.quote}"
				</h2>

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
			</IntersectionObserver>
		</div>
	</section>
{/if}

<style>
	section {
		padding-top: 3rem;
		padding-bottom: 3rem;
	}
	:global(section:not(.bg-transparent) + .quote-section.bg-transparent) {
		padding-top: 5rem;
	}
	.wrap :global(> :first-child) {
		margin-top: 0;
	}
	.wrap :global(> :last-child) {
		margin-bottom: 0;
	}
	.quote {
		font-size: var(--36pt);
		line-height: var(--48pt);
		margin-bottom: var(--40pt);
		opacity: 0;
		translate: 0 80px;
		filter: blur(20px);
		transition: 1s var(--ease-out-cubic);
		transition-property: filter, translate, opacity;
	}
	.isIntersecting .quote {
		opacity: 1;
		translate: 0;
		filter: blur(0);
	}
	.quote.green {
		color: var(--text-highlight);
	}
	.byline-row {
		display: flex;
		flex-direction: column;
		gap: 24px;
		align-items: flex-end;
		translate: 0 50px;
		filter: blur(20px);
		opacity: 0;
		transition: 1s var(--ease-out-cubic);
		transition-delay: 200ms;
		transition-property: filter, translate, opacity;
	}
	.isIntersecting .byline-row {
		translate: 0;
		filter: blur(0);
		opacity: 1;
	}
	.byline {
		font-size: var(--18pt);
		line-height: var(--24pt);
		color: var(--text-light-60);
		margin: 0;
		text-align: right;
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
		:global(section:not(.bg-transparent) + .quote-section.bg-transparent) {
			padding-top: 8.5rem;
		}
		.wrap {
			grid-column: 1 / span 12;
		}
		.quote {
			font-size: var(--48pt);
			line-height: 4rem;
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
			font-size: var(--24pt);
			line-height: var(--32pt);
		}
	}
	@media (min-width: 1200px) {
		.wrap {
			grid-column: 2 / span 10;
		}
	}
</style>
