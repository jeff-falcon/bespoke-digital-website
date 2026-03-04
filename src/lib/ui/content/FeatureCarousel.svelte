<script lang="ts">
	import type { FeatureCarousel } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';
	import ArrowButton from '../button/ArrowButton.svelte';

	export let data: FeatureCarousel;
</script>

<section class="feature-carousel gutter bg-{data.bgColor ?? 'transparent'}">
	{#if data.slides.length}
		<div class="slides">
			{#each data.slides as slide, index (slide)}
				<div class="slide">
					<span class="num">{(index + 1).toString().padStart(2, '0')}</span>
					<div class="image">
						<img
							src={slide.image.url}
							alt={slide.title}
							width={slide.image.width}
							height={slide.image.height}
						/>
					</div>
					<div class="info">
						{#if slide.title}
							<h1 class="slide-title">{slide.title}</h1>
						{/if}
						<div class="body">
							<PortableText value={slide.body} components={{}} />
						</div>
						{#if slide.hasButton && slide.buttonTitle && slide.buttonUrl}
							<ArrowButton
								style="capsule"
								href={slide.buttonUrl}
								isTitleBefore={true}
								title={slide.buttonTitle}
							/>
						{/if}
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
	.slide {
		background: var(--bg-turquoise);
		padding: 24px 16px 40px;
	}
	.num {
		font-size: var(--38pt);
		line-height: var(--48pt);
	}
	img {
		width: 100%;
		height: auto;
		object-fit: cover;
		aspect-ratio: 1.716667 / 1;
	}
	.slide-title {
		font-size: var(--24pt);
		line-height: var(--28pt);
		margin-bottom: var(--12pt);
		margin-top: 0;
	}
	.body :global(p:first-of-type) {
		margin-top: 0;
	}
	.body :global(p:last-of-type) {
		margin-bottom: 0;
	}
	.info :global(.btn) {
		margin-top: 24px;
		justify-content: center;
	}
	@media (min-width: 720px) {
		section {
			padding-top: 4rem;
			padding-bottom: 4rem;
		}
		.slide {
			display: grid;
			gap: var(--gutter-lg);
			grid-template-columns: 1fr 1fr;
			padding: 64px 60px 96px;
		}
		.slide-title {
			font-size: var(--40pt);
			line-height: var(--48pt);
			margin-bottom: var(--24pt);
		}
		.info :global(.btn) {
			margin-top: 56px;
			width: fit-content;
		}
		.num {
			grid-row: 1;
			grid-column: 1 / span 2;
		}
		img {
			aspect-ratio: 1.4563 / 1;
		}
	}
</style>
