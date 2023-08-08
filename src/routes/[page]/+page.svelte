<script lang="ts">
	import PageComponent from '$lib/ui/page/Page.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

{#if data._type === 'page'}
	<PageComponent {data} />
{/if}
