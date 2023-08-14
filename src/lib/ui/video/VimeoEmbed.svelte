<script lang="ts">
	export let vimeoId: number;
	export let title: string | null = null;
</script>

<div class="vimeo-container">
	<iframe
		src="https://player.vimeo.com/video/{vimeoId}?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
		frameborder="0"
		allow="autoplay; fullscreen; picture-in-picture"
		{title}
	/>
</div>

<style>
	.vimeo-container {
		padding: 56.25% 0 0 0;
		position: relative;
	}
	iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
