<script lang="ts">
	import type { ProjectMedia } from '$lib/types';
	import VimeoBG from '$lib/ui/video/VimeoBG_VJS.svelte';
	import IntersectionObserver from 'svelte-intersection-observer';

	export let media: ProjectMedia;
	export let cover = false;

	let figureEl: HTMLElement;
	let isIntersecting = false;
	let isVideoPlaying = false;
	$: videoBgSrc = media.thumb_vimeo_src || media.thumb_vimeo_src_hd;
	$: isVideo = media.kind === 'video-bg' && Boolean(videoBgSrc);

	function onVideoPlaying(e: { detail: boolean }) {
		isVideoPlaying = e.detail;
	}
</script>

<IntersectionObserver element={figureEl} bind:intersecting={isIntersecting} once={true}>
	<figure
		class="media"
		class:cover
		class:isVideo
		class:isVideoPlaying
		bind:this={figureEl}
		class:isIntersecting
	>
		{#if isVideo}
			<VimeoBG
				id="media-{media._key}"
				src={videoBgSrc || ''}
				placeholder={media.image?.url ?? ''}
				on:isPlaying={onVideoPlaying}
			/>
		{/if}
		{#if media.image}
			{#if media.image.sizes}
				<picture>
					<source srcset={media.image.sizes.sm} media="(max-width: 559px)" />
					<source
						srcset={media.image.sizes.md}
						media="(min-width: 560px) and (max-width: 1199px)"
					/>
					<source srcset={media.image.sizes.lg} media="(min-width: 1200px)" />
					<img
						src={media.image.sizes.sm}
						width={media.image.width}
						height={media.image.height}
						alt={media.name}
					/>
				</picture>
			{:else}
				<img
					src={media.image.url}
					width={media.image.width}
					height={media.image.height}
					alt={media.name}
				/>
			{/if}
		{/if}
	</figure>
</IntersectionObserver>

<style>
	.media {
		padding: 0;
		margin: 0;
	}
	.media img {
		display: block;
		object-fit: contain;
		width: 100%;
		position: relative;
		z-index: 0;
		height: auto;
	}
	picture {
		position: relative;
		overflow: hidden;
		display: block;
	}
	.media :global(.video-container) {
		z-index: 1;
	}
	.cover.media,
	.cover img,
	.cover picture {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: block;
	}
	.cover img {
		object-fit: cover;
	}
	.cover.isVideo.isVideoPlaying picture {
		visibility: hidden;
	}
	.cover.isVideo :global(.video-container) {
		opacity: 0;
		transition: 1200ms linear opacity;
	}
	.cover.isVideo.isVideoPlaying :global(.video-container) {
		opacity: 1;
	}
	.media:not(.isVideo) picture {
		overflow: hidden;
	}
	.media:not(.isVideo) img {
		opacity: 0;
		transform-origin: center top;
		transform: scale(1.15);
		transition: 1.5s linear opacity, 5s transform var(--cubic-ease-out);
	}
	.media:not(.isVideo).isIntersecting img {
		opacity: 1;
		transform: scale(1);
	}
</style>
