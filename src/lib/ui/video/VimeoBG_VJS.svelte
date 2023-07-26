<script lang="ts">
	export let src: string;
	export let placeholder: string = '';
	export let id: string;

	let videoEl: HTMLVideoElement | null = null;
</script>

<div class="video-container">
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
	>
		<source {src} />
	</video>
</div>

<style>
	.video-container,
	video {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		object-fit: cover;
	}
</style>
