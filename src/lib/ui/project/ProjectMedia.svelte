<script lang="ts">
	import type { Project, ProjectMedia } from '$lib/types';
	import VimeoBG from '$lib/ui/video/VimeoBG_VJS.svelte';

	export let media: ProjectMedia;

	$: videoBgSrc = media.thumb_vimeo_src || media.thumb_vimeo_src_hd;
</script>

<figure class="media">
	{#if media.kind === 'video-bg' && videoBgSrc}
		<VimeoBG
			id="media-{media._key}"
			src={videoBgSrc || ''}
			placeholder={media.image?.secure_url ?? ''}
		/>
	{/if}
	{#if media.image}
		<img
			src={media.image.secure_url}
			width={media.image.width}
			height={media.image.height}
			alt={media.name}
		/>
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
