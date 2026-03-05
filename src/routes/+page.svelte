<script lang="ts">
	import PageComponent from '$lib/ui/page/Page.svelte';
	import type { PageData } from './$types';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

{#key data._id}
	{#if data._type === 'page'}
		<PageComponent {data} />
	{/if}
{/key}
