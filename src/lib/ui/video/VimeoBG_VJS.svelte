<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import videojs from 'video.js';

	const dispatch = createEventDispatcher<{ isPlaying: boolean }>();

	export let src: string;
	export let placeholder: string = '';
	export let id: string;

	let isPlaying = false;

	let videoEl: HTMLVideoElement | null = null;

	$: srcType = src.includes('file.mp4') ? 'video/mp4' : 'application/x-mpegURL';

	function onPlaying() {
		console.log('video is now playing');
		dispatch('isPlaying', true);
		isPlaying = true;
	}
	function onPaused() {
		dispatch('isPlaying', false);
		isPlaying = false;
	}

	onMount(() => {
		if (videoEl) {
			const player = videojs(videoEl, {
				html5: {
					hls: {
						withCredentials: true,
						overrideNative: true
					}
				}
			});
			player.on('playing', onPlaying);
			player.on('pause', onPaused);
			player.volume(0);
			setTimeout(() => {
				console.log('play video dammit');
				player.play();
			}, 1000);
			return () => {
				player.off('playing', onPlaying);
				player.off('pause', onPaused);
				player.dispose();
			};
		}
	});
</script>

<div class="video-container" class:isPlaying>
	<video
		{id}
		class="video-js vjs-fill"
		bind:this={videoEl}
		playsinline
		loop
		autoplay
		muted
		preload="auto"
		poster={placeholder}
		crossorigin="anonymous"
	>
		<source {src} type={srcType} />
	</video>
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
