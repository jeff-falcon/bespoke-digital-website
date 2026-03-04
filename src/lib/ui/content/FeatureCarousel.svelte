<script lang="ts">
	import type { FeatureCarousel } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { onMount, tick } from 'svelte';
	import ArrowButton from '../button/ArrowButton.svelte';

	export let data: FeatureCarousel;

	let sectionEl: HTMLElement;
	let slidesEl: HTMLDivElement;
	let slideElements: HTMLDivElement[] = [];
	let slideHeight = 0;
	let slidesWrapHeight = 0;
	let headerOffset = 0;
	let sectionTopPadding = 0;
	let currentSlideOffset = 0;

	let scrollTrigger: ScrollTrigger | null = null;
	let revealTrigger: ScrollTrigger | null = null;
	let resizeRaf = 0;
	let currentIndex = 0;
	let queuedIndex: number | null = null;
	let isAnimating = false;
	let hasRevealedFirstSlide = false;

	const easeCurve = 'power2.inOut';
	const transitionDuration = 0.75;

	gsap.registerPlugin(ScrollTrigger);

	function destroyCarousel() {
		if (scrollTrigger) {
			scrollTrigger.kill();
			scrollTrigger = null;
		}
		if (revealTrigger) {
			revealTrigger.kill();
			revealTrigger = null;
		}
		gsap.killTweensOf(slideElements);
		isAnimating = false;
		queuedIndex = null;
	}

	function getHeaderOffset() {
		if (typeof window === 'undefined') return 0;
		const topNavHeight = getComputedStyle(document.documentElement)
			.getPropertyValue('--top-nav-height')
			.trim();
		const parsed = Number.parseFloat(topNavHeight);
		return Number.isFinite(parsed) ? parsed : 0;
	}

	function updateHeights() {
		if (!slidesEl || !slideElements.length) return;

		slideHeight = 0;
		slidesWrapHeight = 0;
		headerOffset = getHeaderOffset();
		sectionTopPadding = 0;
		currentSlideOffset = 0;
		slidesEl.style.setProperty('--slide-height', 'auto');
		slidesEl.style.setProperty('--slides-wrap-height', 'auto');
		slidesEl.style.height = 'auto';
		for (const slide of slideElements) {
			slide.style.minHeight = '';
		}

		for (const slide of slideElements) {
			slideHeight = Math.max(slideHeight, slide.offsetHeight);
		}

		if (!slideHeight) return;

		const sectionStyle = sectionEl ? getComputedStyle(sectionEl) : null;
		sectionTopPadding = sectionStyle ? Number.parseFloat(sectionStyle.paddingTop || '0') || 0 : 0;
		const viewportHeight = typeof window === 'undefined' ? slideHeight : window.innerHeight;
		const visibleViewportHeight = Math.max(0, viewportHeight - headerOffset);
		currentSlideOffset = Math.max(0, (visibleViewportHeight - slideHeight) / 2 - sectionTopPadding);
		slidesWrapHeight = Math.max(slideHeight, currentSlideOffset + slideHeight);

		slidesEl.style.height = `${slidesWrapHeight}px`;
		for (const slide of slideElements) {
			slide.style.minHeight = `${slideHeight}px`;
		}
	}

	function getSlideTargetState(index: number, activeIndex: number, currentY: number) {
		const depth = activeIndex - index;
		const slideStackStep =
			Number.parseFloat(getComputedStyle(sectionEl).getPropertyValue('--slide-behind-offset-y')) ||
			70;
		const stackedY = currentY - depth * slideStackStep;

		if (index === activeIndex) {
			return { autoAlpha: 1, scale: 1, y: currentY };
		}
		if (index === activeIndex - 1) {
			return { autoAlpha: 0, scale: 0.8, y: stackedY };
		}
		if (index < activeIndex - 1) {
			return { autoAlpha: 0, scale: 0.6, y: stackedY };
		}
		return { autoAlpha: 0, scale: 0.96, y: currentY + 80 };
	}

	function applyState(index: number, currentY: number) {
		const slides = slideElements.filter(Boolean);
		slides.forEach((slide, slideIndex) => {
			gsap.set(slide, getSlideTargetState(slideIndex, index, currentY));
		});
	}

	function animateToIndex(targetIndex: number, currentY: number) {
		const slides = slideElements.filter(Boolean);
		if (!slides.length) return;

		if (isAnimating) {
			queuedIndex = targetIndex;
			return;
		}

		if (targetIndex === currentIndex) return;

		isAnimating = true;
		queuedIndex = null;

		let completeCount = 0;
		const done = () => {
			completeCount += 1;
			if (completeCount < slides.length) return;

			currentIndex = targetIndex;
			isAnimating = false;
			if (queuedIndex !== null && queuedIndex !== currentIndex) {
				const nextIndex = queuedIndex;
				queuedIndex = null;
				animateToIndex(nextIndex, currentY);
			}
		};

		slides.forEach((slide, slideIndex) => {
			gsap.to(slide, {
				...getSlideTargetState(slideIndex, targetIndex, currentY),
				duration: transitionDuration,
				ease: easeCurve,
				overwrite: true,
				onComplete: done
			});
		});
	}

	async function setupCarousel() {
		await tick();
		destroyCarousel();

		const slides = slideElements.filter(Boolean);
		if (!sectionEl || !slidesEl || !slides.length) return;

		updateHeights();
		const currentY = currentSlideOffset;
		const maxIndex = slides.length - 1;

		currentIndex = 0;
		queuedIndex = null;
		isAnimating = false;
		hasRevealedFirstSlide = false;

		applyState(0, currentY);
		gsap.set(slides[0], { y: currentY + 200, autoAlpha: 0 });

		const revealFirstSlide = () => {
			if (hasRevealedFirstSlide) return;
			hasRevealedFirstSlide = true;
			gsap.to(slides[0], {
				y: currentY,
				autoAlpha: 1,
				duration: transitionDuration,
				ease: easeCurve,
				overwrite: true
			});
		};

		const handleProgress = (progress: number) => {
			const targetIndex = Math.max(0, Math.min(maxIndex, Math.round(progress * maxIndex)));
			animateToIndex(targetIndex, currentY);
		};

		revealTrigger = ScrollTrigger.create({
			trigger: sectionEl,
			start: 'top bottom-=300',
			onEnter: () => {
				revealFirstSlide();
			},
			onEnterBack: () => {
				revealFirstSlide();
			}
		});

		scrollTrigger = ScrollTrigger.create({
			trigger: sectionEl,
			start: () => `top top+=${headerOffset}`,
			end: () => {
				const slideCount = slides.length;
				const distance = slideHeight * (slideCount + (slideCount - 1) * 0.8);
				return `+=${distance}`;
			},
			pin: true,
			invalidateOnRefresh: true,
			onEnter: () => {
				revealFirstSlide();
			},
			onEnterBack: () => {
				revealFirstSlide();
			},
			onUpdate: (self) => {
				revealFirstSlide();
				handleProgress(self.progress);
			}
		});
	}

	onMount(() => {
		setupCarousel();

		const handleResize = () => {
			cancelAnimationFrame(resizeRaf);
			resizeRaf = requestAnimationFrame(async () => {
				updateHeights();
				ScrollTrigger.refresh();
				await setupCarousel();
			});
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(resizeRaf);
			destroyCarousel();
		};
	});
</script>

<section bind:this={sectionEl} class="feature-carousel gutter bg-{data.bgColor ?? 'transparent'}">
	<div class="wrap">
		{#if data.slides.length}
			<div
				bind:this={slidesEl}
				class="slides"
				style={`--slide-height:${slideHeight}px;--slides-wrap-height:${slidesWrapHeight}px`}
			>
				{#each data.slides as slide, index (slide)}
					<div class="slide" bind:this={slideElements[index]}>
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
		--slide-behind-offset-y: 70px;
	}
	.slides {
		position: relative;
		height: var(--slides-wrap-height, auto);
	}
	.slide {
		display: grid;
		background: var(--bg-turquoise);
		padding: 24px 16px 40px;
		grid-template-rows: auto auto 1fr;
		gap: 16px;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		min-height: var(--slide-height, auto);
		will-change: transform, opacity;
		transform-origin: center top;
	}
	.num {
		font-size: var(--38pt);
		line-height: var(--48pt);
		height: min-content;
	}
	img {
		width: 100%;
		height: auto;
		object-fit: cover;
		object-position: center;
		aspect-ratio: 1.716667 / 1;
		display: block;
		max-height: 300px;
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
	.body.desktop {
		display: none;
	}
	@media (min-width: 480px) {
		section {
			--slide-behind-offset-y: 95px;
		}
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
			--slide-behind-offset-y: 85px;
		}
		.slide {
			gap: 24px var(--gutter-lg);
			grid-template-columns: 1fr 1fr;
			padding: 32px 40px 48px;
			grid-template-rows: auto 1fr;
		}
		.body.desktop {
			display: block;
		}
		.body.mobile {
			display: none;
		}
		.slide-title {
			font-size: var(--40pt);
			line-height: var(--48pt);
			margin-bottom: var(--16pt);
		}
		.info :global(.btn) {
			margin-top: 48px;
			width: fit-content;
		}
		.num {
			grid-row: 1;
			grid-column: 1 / span 2;
		}
		img {
			aspect-ratio: 1.4563 / 1;
			max-height: none;
		}
		.wrap {
			max-width: 1280px;
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
			padding: 64px 60px 96px;
		}
	}
</style>
