<script lang="ts">
	import type { FeatureCarousel } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';
	import gsap from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import ArrowButton from '../button/ArrowButton.svelte';
	import ProjectMediaComponent from '../project/ProjectMediaComponent.svelte';

	if (typeof window !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger);
	}

	interface Props {
		data: FeatureCarousel;
	}

	let { data }: Props = $props();

	let sectionEl = $state<HTMLElement>();
	let triggerStartEl = $state<HTMLDivElement>();
	let slidesEl = $state<HTMLDivElement>();
	let slideElements = $state<HTMLDivElement[]>([]);
	let slideHeight = $state(0);
	let slidesWrapHeight = $state(0);

	let timeline = $state<gsap.core.Timeline | null>(null);
	let slideTimelines = $state<gsap.core.Timeline[]>([]);
	let slideAnimCompletion = new SvelteSet<number>();

	const incomingSlideOffscreenBuffer = 24;
	const defaultSlideStackOffset = 32;
	const slideColorStart = '#334041';
	const slideColorEnd = '#242D2E';

	const slideColors = $derived.by(() =>
		getInterpolatedColors(data.slides.length, slideColorStart, slideColorEnd)
	);

	function destroyCarousel() {
		if (timeline) {
			timeline.kill();
			timeline = null;
		}
		slideTimelines = [];
		gsap.killTweensOf(slideElements.filter(Boolean));
	}

	function getHeaderOffset() {
		if (typeof window === 'undefined') return 0;
		const header = document.querySelector('header');
		return header instanceof HTMLElement ? header.getBoundingClientRect().height : 0;
	}

	function getSlideStackOffset() {
		if (!sectionEl) return defaultSlideStackOffset;
		const stackOffset = Number.parseFloat(
			getComputedStyle(sectionEl).getPropertyValue('--slide-stack-offset')
		);
		return Number.isFinite(stackOffset) ? stackOffset : defaultSlideStackOffset;
	}

	function updateLayout() {
		if (!slidesEl || !slideElements.length) {
			return {
				incomingY: 0,
				slideStackOffset: defaultSlideStackOffset
			};
		}

		slideHeight = 0;
		slidesWrapHeight = 0;
		slidesEl.style.setProperty('--slide-height', 'auto');
		slidesEl.style.setProperty('--slides-wrap-height', 'auto');
		slidesEl.style.height = 'auto';
		for (const slide of slideElements) {
			slide.style.minHeight = '';
		}

		for (const slide of slideElements) {
			slideHeight = Math.max(slideHeight, slide.offsetHeight);
		}

		if (!slideHeight) {
			return {
				incomingY: incomingSlideOffscreenBuffer,
				slideStackOffset: defaultSlideStackOffset
			};
		}

		const slideStackOffset = getSlideStackOffset();
		slidesWrapHeight = slideHeight + slideStackOffset * Math.max(0, slideElements.length - 1);
		slidesEl.style.height = `${slidesWrapHeight}px`;
		for (const slide of slideElements) {
			slide.style.minHeight = `${slideHeight}px`;
		}

		return {
			incomingY:
				(typeof window === 'undefined' ? slideHeight : window.innerHeight) +
				incomingSlideOffscreenBuffer,
			slideStackOffset
		};
	}

	function hexToRgb(hex: string) {
		const normalized = hex.replace('#', '').trim();
		if (normalized.length !== 6) {
			return { r: 0, g: 0, b: 0 };
		}
		return {
			r: Number.parseInt(normalized.slice(0, 2), 16),
			g: Number.parseInt(normalized.slice(2, 4), 16),
			b: Number.parseInt(normalized.slice(4, 6), 16)
		};
	}

	function rgbToHex(value: number) {
		return value.toString(16).padStart(2, '0');
	}

	function interpolateChannel(start: number, end: number, progress: number) {
		return Math.round(start + (end - start) * progress);
	}

	function getInterpolatedColors(count: number, startColor: string, endColor: string) {
		if (count <= 0) return [];
		if (count === 1) return [startColor];

		const start = hexToRgb(startColor);
		const end = hexToRgb(endColor);

		return Array.from({ length: count }, (_, index) => {
			const progress = index / (count - 1);
			return `#${rgbToHex(interpolateChannel(start.r, end.r, progress))}${rgbToHex(interpolateChannel(start.g, end.g, progress))}${rgbToHex(interpolateChannel(start.b, end.b, progress))}`;
		});
	}

	async function setupCarousel() {
		const slides = slideElements.filter(Boolean);
		if (!sectionEl || !triggerStartEl || !slidesEl || !slides.length) return;

		if (slides.length === 1) return;

		const { incomingY, slideStackOffset } = updateLayout();
		slideTimelines = [];

		slides.forEach((slide, index) => {
			gsap.set(slide, {
				y: index === 0 ? 0 : incomingY,
				zIndex: index + 1
			});
		});

		timeline = gsap.timeline({
			defaults: {
				ease: 'none'
			},
			scrollTrigger: {
				trigger: triggerStartEl,
				start: () => `top top+=${getHeaderOffset()}`,
				endTrigger: sectionEl,
				end: 'bottom top',
				pin: sectionEl,
				scrub: 1,
				invalidateOnRefresh: true
			}
		});

		slides.forEach((slide, index) => {
			if (index === 0) return;
			const subTimeline = gsap.timeline({
				defaults: {
					ease: 'none'
				}
			});
			subTimeline.to(
				slide,
				{
					y: index * slideStackOffset,
					duration: 1,
					onUpdate: () => {
						if (subTimeline.progress() >= 0.9) {
							if (!slideAnimCompletion.has(index - 1)) {
								slideAnimCompletion.add(index - 1);
							}
						} else {
							if (slideAnimCompletion.has(index - 1)) {
								slideAnimCompletion.delete(index - 1);
							}
						}
					},
					onComplete: () => {
						slideAnimCompletion.add(index - 1);
					}
				},
				0
			);

			slideTimelines[index] = subTimeline;
			timeline?.add(subTimeline, index - 1);
		});

		timeline?.to({}, { duration: 0.2 });
	}

	onMount(() => {
		setupCarousel();

		return () => {
			destroyCarousel();
		};
	});
</script>

<section bind:this={sectionEl} class="feature-carousel gutter bg-{data.bgColor ?? 'transparent'}">
	<div class="wrap">
		<div class="trigger-start" bind:this={triggerStartEl}></div>
		{#if data.title || data.description}
			<div class="intro">
				{#if data.title}
					<h2 class="title">{data.title}</h2>
				{/if}
				{#if data.description}
					<div class="description">
						<PortableText value={data.description} components={{}} />
					</div>
				{/if}
			</div>
		{/if}
		{#if data.slides.length}
			<div
				bind:this={slidesEl}
				class="slides"
				style={`--slide-height:${slideHeight}px;--slides-wrap-height:${slidesWrapHeight}px`}
			>
				{#each data.slides as slide, index (slide)}
					<div
						class="slide"
						style={`background-color:${slideColors[index] ?? slideColorEnd};`}
						class:isComplete={slideAnimCompletion.has(index)}
						bind:this={slideElements[index]}
					>
						<span class="num">{(index + 1).toString().padStart(2, '0')}</span>
						<div class="image" class:empty={!slide.media}>
							{#if slide.media}
								<ProjectMediaComponent media={slide.media} scaleOnReveal={false} cover={true} />
							{/if}
						</div>
						<div class="info">
							{#if slide.title}
								<h1 class="slide-title">{slide.title}</h1>
							{/if}
							<div class="body desktop">
								<PortableText value={slide.body} components={{}} />
							</div>
							<div class="body mobile">
								<PortableText value={slide.bodyTruncated} components={{}} />
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
	</div>
</section>

<style>
	section {
		padding-top: 3rem;
		padding-bottom: 7.5rem;
		--slide-stack-offset: 32px;
	}
	.slides {
		position: relative;
		height: var(--slides-wrap-height, auto);
	}
	.trigger-start {
		height: 1px;
		width: 100%;
	}
	.slide {
		display: grid;
		padding: 24px 16px 40px;
		grid-template-rows: auto auto 1fr;
		gap: 16px;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		min-height: var(--slide-height, auto);
		will-change: transform;
	}
	.wrap {
		display: flex;
		flex-direction: column;
	}
	.num {
		font-size: var(--38pt);
		line-height: var(--48pt);
		height: min-content;
		transition: opacity 450ms linear;
		will-change: opacity;
	}
	.slide.isComplete .num {
		opacity: 0;
	}
	.slide-title {
		font-size: var(--22pt);
		line-height: var(--26pt);
		margin-bottom: var(--12pt);
		margin-top: 0;
		text-wrap: balance;
		/* text-wrap: pretty; */
	}
	.intro .title,
	.intro .description {
		text-align: center;
	}
	.intro .description :global(:first-child) {
		margin-top: 0;
	}
	.intro .description :global(:last-child) {
		margin-bottom: 0;
	}
	.intro .title {
		margin: 0;
	}
	.intro .description {
		text-wrap: balance;
		text-wrap: pretty; /* firefox ignores this */
	}
	.intro {
		display: flex;
		flex-direction: column;
		gap: var(--16pt);
		margin-bottom: 32px;
	}
	.body :global(p) {
		font-size: var(--14pt);
		line-height: var(--20pt);
		text-wrap: pretty;
	}
	.body :global(p:first-of-type) {
		margin-top: 0;
	}
	.body :global(p:last-of-type) {
		margin-bottom: 0;
	}
	.info :global(.btn) {
		margin-top: 32px;
		justify-content: center;
	}
	.body.desktop {
		display: none;
	}
	.image {
		position: relative;
		aspect-ratio: 1.73 / 1;
		max-height: 300px;
	}
	.image.empty {
		background: red;
	}
	@media (min-width: 480px) {
		.slide {
			padding-inline: 32px;
		}
		.info :global(.btn) {
			width: fit-content;
		}
	}
	@media (min-width: 960px) {
		section {
			padding-top: 4rem;
			padding-bottom: 8rem;
		}
		.slide {
			gap: 24px var(--gutter-lg);
			grid-template-columns: repeat(2, minmax(0, 1fr));
			padding: 32px 40px 48px;
			grid-template-rows: auto 1fr;
		}
		.body.desktop {
			display: block;
		}
		.body.mobile {
			display: none;
		}
		.body :global(p) {
			font-size: var(--16pt);
			line-height: var(--24pt);
		}
		.slide-title {
			font-size: var(--26pt);
			line-height: var(--32pt);
			margin-bottom: var(--16pt);
		}
		.intro {
			gap: var(--24pt);
			max-width: 680px;
			margin-inline: auto;
			margin-bottom: 68px;
		}
		.intro .title {
			font-size: var(--40pt);
			line-height: var(--48pt);
		}
		.info :global(.btn) {
			width: fit-content;
		}
		.num {
			grid-row: 1;
			grid-column: 1 / span 2;
		}
		.image {
			max-height: none;
			aspect-ratio: 1.37 / 1;
		}
		.wrap {
			max-width: 974px;
			margin-inline: auto;
		}
	}
	@media (min-width: 768px) and (max-height: 700px) {
		.slide {
			padding: 16px 16px 40px;
			gap: 16px var(--gutter-lg);
		}
	}
	@media (min-width: 1200px) and (min-height: 800px) {
		.slide {
			padding: 40px 48px 64px;
		}
	}
	@media (max-height: 860px) {
		.intro {
			order: 1;
		}
		.trigger-start {
			order: 2;
		}
		.slides {
			order: 3;
		}
	}
</style>
