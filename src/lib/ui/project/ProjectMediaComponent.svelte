<script lang="ts">
	import type { ProjectMedia } from '$lib/types';
	import VimeoBG from '$lib/ui/video/VimeoBG_VJS.svelte';
	import IntersectionObserver from 'svelte-intersection-observer';
	import VimeoPlayer from '../video/VimeoPlayer.svelte';
	import VimeoEmbed from '../video/VimeoEmbed.svelte';

	export let media: ProjectMedia;
	export let cover = false;
	export let scaleOnReveal = true;

	let figureEl: HTMLElement;
	let isIntersecting = false;
	let isVideoPlaying = false;
	$: videoBgSrc = media.vimeoSrc || media.vimeoSrcHd;
	$: isBgVideo = media.kind === 'video-bg' && Boolean(videoBgSrc);
	$: isStaticImage = media.kind === 'image' && Boolean(media.image?.url);
	$: hasVideoId = !isNaN(Number(media.vimeoPlayerSrc));
	$: isVideoPlayer = media.kind === 'video-player' && Boolean(media.vimeoPlayerSrc) && !hasVideoId;
	$: isVideoEmbed = media.kind === 'video-player' && Boolean(media.vimeoPlayerSrc) && hasVideoId;

	function onVideoPlaying(e: { detail: boolean }) {
		isVideoPlaying = e.detail;
	}
</script>

{#if isVideoEmbed}
	<div class="video-embed">
		<VimeoEmbed vimeoId={Number(media.vimeoPlayerSrc)} title={media.name} />
	</div>
{:else if isVideoPlayer}
	{@const src = media.vimeoPlayerSrc ?? ''}
	<div class="video-player">
		<VimeoPlayer
			id="media-{media._key}"
			{src}
			title={media.name}
			placeholder={media.image?.url ?? ''}
		/>
	</div>
{:else if isStaticImage || isBgVideo}
	<IntersectionObserver element={figureEl} bind:intersecting={isIntersecting} once={true}>
		<figure
			class="media"
			class:cover
			class:isBgVideo
			class:isVideoPlaying
			bind:this={figureEl}
			class:isIntersecting
			class:scaleOnReveal
		>
			{#if isBgVideo}
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
{/if}

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
	.cover.isBgVideo.isVideoPlaying picture {
		visibility: hidden;
	}
	.cover.isBgVideo :global(.video-container) {
		opacity: 0;
		transition: 1200ms linear opacity;
	}
	.cover.isBgVideo.isVideoPlaying :global(.video-container) {
		opacity: 1;
	}
	.media:not(.isBgVideo) picture {
		overflow: hidden;
	}
	.media.scaleOnReveal:not(.isBgVideo) img {
		transform: scale(1.15);
	}
	.media:not(.isBgVideo) img {
		opacity: 0;
		transform-origin: center top;
		transition: 1.5s linear opacity, 5s transform var(--cubic-ease-out);
	}
	.media:not(.isBgVideo).isIntersecting img {
		opacity: 1;
	}
	.media.scaleOnReveal:not(.isBgVideo).isIntersecting img {
		transform: scale(1);
	}
</style>
