<script lang="ts">
	export let vimeoId: number;
	export let placeholder: string | null = null;
</script>

<div class="vimeo-container">
	<div class="vimeo-background">
		<svg class="vimeo-sizer" width="640" height="360" />
		<iframe
			title="Vimeo video"
			class="vimeo-video"
			style={placeholder ? `background-image: url('${placeholder}')` : null}
			src="https://player.vimeo.com/video/{vimeoId}?background=1"
			width="640"
			height="360"
			frameborder="0"
			allow="autoplay; fullscreen; picture-in-picture"
			allowfullscreen
		/>
	</div>
</div>

<style>
	.vimeo-container {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: -2;
	}

	.vimeo-background {
		position: absolute;
		height: 100%;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.vimeo-sizer {
		border: none;
		max-width: none;
		height: 100%;
		width: auto;
		display: inline-block;
		vertical-align: top;
	}

	.vimeo-video {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: no-repeat center;
		background-size: cover;
	}
</style>
