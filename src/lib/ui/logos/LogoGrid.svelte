<script lang="ts">
	import type { LogoGrid } from '$lib/types';

	export let data: LogoGrid;

	$: colors = data.color.split('/');
	$: bgColor = colors[0] ? `var(--${colors[0]})` : 'transparent';
	$: iconColor = `url(#colorizer-${colors[1] || 'white'})`;
	$: textColor = colors[0] ? `var(--${colors[1]})` : 'white';
</script>

<section class="logo-grid gutter" style="--bg-color: {bgColor}; --text-color: {textColor}">
	<h3 class="title">{data.title}</h3>
	<picture>
		<source srcset={data.mobile} media="(max-width: 719px)" />
		<source srcset={data.desktop} media="(min-width: 720px)" />
		<img style="filter: {iconColor}" src={data.mobile} alt={data.title} />
	</picture>
</section>

<style>
	section {
		background-color: var(--bg-color);
		color: var(--text-color);
		padding-top: 96px;
		padding-bottom: 96px;
	}
	h3 {
		margin: 0 0 48px;
		width: 75%;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--text-light-15);
	}
	picture {
		margin-top: 48px;
		display: block;
	}
	img {
		margin-left: auto;
		margin-right: auto;
		display: block;
		width: 100%;
		height: auto;
	}
	@media (min-width: 720px) {
		section {
			padding-top: 128px;
			padding-bottom: 128px;
		}
		picture {
			max-width: 1320px;
			margin: 64px auto 0;
		}
		h3 {
			width: 100%;
			padding-bottom: 48px;
			margin-bottom: 64px;
		}
	}
</style>
