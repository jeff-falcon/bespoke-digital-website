<script lang="ts">
	export let title: string = '';
	export let isTitleHiddenOnMobile = false;
	export let isTitleBefore = true;
</script>

<button
	on:click
	type="button"
	class:hasTitle={Boolean(title)}
	class:isTitleHiddenOnMobile
	class:isTitleBefore
>
	{#if title}
		<span class="title">{title}</span>
	{/if}
	<span class="icon">
		<svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M6 2.99993L1.5 5.59801L1.5 0.401855L6 2.99993Z" />
		</svg>
	</span>
</button>

<style>
	button {
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		padding: 0;
		border: 0;
		gap: var(--14pt);
		color: var(--text-light);
	}
	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		box-shadow: 0 0 0 1px inset var(--text-light-40);
		border-radius: 100px;
		transition: linear 180ms box-shadow;
	}
	svg {
		display: block;
		fill: var(--text-light);
	}
	button:hover .icon {
		box-shadow: 0 0 0 1px inset var(--text-light);
	}
	.title {
		font-size: var(--14pt);
		line-height: var(--24pt);
		order: 2;
	}
	.isTitleBefore .title {
		order: 1;
	}
	.isTitleBefore .icon {
		order: 2;
	}
	@media (max-width: 559px) {
		.isTitleHiddenOnMobile .title {
			display: none;
		}
	}
	@media (min-width: 560px) {
		button {
			gap: var(--18pt);
		}
		.icon {
			width: 36px;
			height: 36px;
		}
		.title {
			font-size: var(--16pt);
			line-height: var(--24pt);
		}
	}
</style>
