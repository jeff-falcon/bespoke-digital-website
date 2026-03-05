<script lang="ts">
	import { onMount, untrack } from 'svelte';

	interface Props {
		src: string;
		placeholder?: string;
		id: string;
		isIntersecting?: boolean;
		onPlaying?: (isPlaying: boolean) => void;
	}

	let {
		src,
		placeholder = '',
		id,
		isIntersecting = $bindable(false),
		onPlaying: _onPlaying
	}: Props = $props();

	let isPlaying = $state(false);
	let isReady = $state(false);
	let playerTimeout = $state<number>();

	let videoEl = $state<HTMLVideoElement>();

	let hasRedirect = $derived(src.includes('progressive_redirect'));

	$effect(() => {
		if (isIntersecting || !isIntersecting) {
			untrack(() => {
				clearTimeout(playerTimeout);
				if (isIntersecting && isReady && !isPlaying) {
					videoEl?.play();
				} else if (!isIntersecting && isPlaying && typeof window !== 'undefined') {
					playerTimeout = window.setTimeout(() => {
						videoEl?.pause();
					}, 50);
				}
			});
		}
	});

	function onPlaying() {
		_onPlaying?.(true);
		isPlaying = true;
	}
	function onPaused() {
		_onPlaying?.(false);
		isPlaying = false;
	}

	function onReady() {
		isReady = true;
	}

	async function getRedirect() {
		const res = await fetch(src, { method: 'HEAD' });
		if (videoEl && res.url) {
			videoEl.src = res.url;
		}
	}

	onMount(() => {
		if (videoEl) {
			videoEl.addEventListener('playing', onPlaying);
			videoEl.addEventListener('pause', onPaused);
			videoEl.addEventListener('canplay', onReady);
			if (hasRedirect) {
				getRedirect();
			} else {
				videoEl.src = src;
			}
		}
		return () => {
			videoEl?.removeEventListener('playing', onPlaying);
			videoEl?.removeEventListener('pause', onPaused);
			videoEl?.removeEventListener('canplay', onReady);
		};
	});
</script>

<div class="video-container" class:isPlaying class:isIntersecting>
	<video
		{id}
		bind:this={videoEl}
		playsinline
		loop
		muted
		autoplay
		poster={placeholder}
		crossorigin="anonymous"
		disablepictureinpicture
		disableremoteplayback
	></video>
</div>

<style>
	.video-container,
	.video-container :global(video) {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}
	.video-container :global(video) {
		object-fit: cover;
	}
	.isPlaying :global(.vjs-poster) {
		opacity: 0;
	}
</style>
