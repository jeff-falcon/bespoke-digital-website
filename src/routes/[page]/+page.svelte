<script lang="ts">
	import Page from '$lib/ui/page/Page.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

{#if data.page}
	<Page data={data.page} />
{/if}
