<script lang="ts">
	import type { CustomBlockComponentProps } from '@portabletext/svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		portableText: CustomBlockComponentProps;
		children?: Snippet<[]>;
	};

	let { portableText, children }: Props = $props();
</script>

<p class="large-p">
	{@render children?.()}
</p>

<style>
	.large-p {
		font-size: var(--18pt);
		line-height: var(--24pt);
		color: var(--text-color-60);
	}
	@media (min-width: 720px) {
		.large-p {
			font-size: var(--20pt);
			line-height: var(--32pt);
		}
	}
</style>
