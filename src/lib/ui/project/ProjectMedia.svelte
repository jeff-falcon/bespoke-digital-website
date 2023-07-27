<script lang="ts">
	import type { ProjectMedia } from '$lib/types';
	import VimeoBG from '$lib/ui/video/VimeoBG_VJS.svelte';

	export let media: ProjectMedia;

	$: videoBgSrc = media.thumb_vimeo_src || media.thumb_vimeo_src_hd;
</script>

<figure class="media">
	{#if media.kind === 'video-bg' && videoBgSrc}
		<VimeoBG id="media-{media._key}" src={videoBgSrc || ''} placeholder={media.image?.url ?? ''} />
	{/if}
	{#if media.image}
		{#if media.image.sizes}
			<picture>
				<source srcset={media.image.sizes.sm} media="(max-width: 559px)" />
				<source srcset={media.image.sizes.md} media="(min-width: 560px) and (max-width: 1199px)" />
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
	.media :global(.video-container) {
		z-index: 1;
	}
</style>
