<script lang="ts">
	import type { ListComponentProps } from '@portabletext/svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		portableText: ListComponentProps;
		children?: Snippet<[]>;
	};

	let { portableText, children }: Props = $props();
	let isNumbered = $derived(portableText.value.listItem === 'number');
	let firstBullet = $derived(portableText.value.children.at(0));
	let firstBulletChild = $derived(firstBullet?.children.at(0));
	let isBold = $derived(
		firstBulletChild
			? 'marks' in firstBulletChild
				? firstBulletChild.marks?.at(0) === 'strong'
				: false
			: false
	);

	$inspect('list isBold', isBold);
</script>

{#if isNumbered}
	<ol class:boldTitles={isBold}>
		{@render children?.()}
	</ol>
{:else}
	<ul>
		{@render children?.()}
	</ul>
{/if}

<style>
	ol {
		list-style: none;
		counter-reset: intro-counter;
		padding-left: 0;
	}
	ol :global(li) {
		counter-increment: intro-counter;
		position: relative;
		min-height: 64px;
		padding: 40px 0 40px 72px;
		margin: 0;
		border-bottom: 1px solid var(--text-color-5);
	}
	ol :global(li:first-of-type) {
		border-top: 1px solid var(--text-color-5);
	}

	ol :global(li:before) {
		font-size: var(--48pt);
		line-height: var(--64pt);
		color: var(--text-highlight);
		content: counter(intro-counter, decimal-leading-zero);
		position: absolute;
		display: block;
		left: 0;
		translate: 0 -3px;
	}
	ol.boldTitles :global(li) {
		font-size: var(--22pt);
		line-height: var(--32pt);
		color: var(--text-color-60);
	}
	ol.boldTitles :global(li strong:first-of-type) {
		font-size: var(--24pt);
		color: var(--text-color);
		font-weight: normal;
	}
	@media (min-width: 960px) {
		ol.boldTitles :global(li strong:first-of-type) {
			font-size: var(--26pt);
		}
		ol :global(li:before) {
			font-size: var(--56pt);
		}
		ol :global(li) {
			padding: 40px 0 40px 112px;
		}
	}
</style>
