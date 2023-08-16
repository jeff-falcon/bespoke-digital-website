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
		padding-top: 90px;
		padding-bottom: 90px;
	}
	h3 {
		margin: 0 0 48px;
		font-size: var(--22pt);
		line-height: var(--32pt);
		font-weight: normal;
		width: 75%;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--text-light-15);
	}
	picture {
		margin-top: 48px;
	}
	img {
		margin-left: auto;
		margin-right: auto;
		display: block;
		width: 100%;
		height: auto;
	}
	@media (min-width: 960px) {
		section {
			padding-top: 136px;
			padding-bottom: 160px;
		}
		picture {
			margin-top: 64px;
		}
		h3 {
			font-size: var(--24pt);
			width: 100%;
			padding-bottom: 48px;
			margin-bottom: 64px;
		}
	}
</style>
