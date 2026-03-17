<script lang="ts">
	import type { MediaGroup } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';
	import ProjectMediaComponent from '../project/ProjectMediaComponent.svelte';

	interface Props {
		data: MediaGroup;
	}

	let { data }: Props = $props();

	const layout = $derived(data.layout ?? 'one_full');
	const mediaItems = $derived(data.media ?? []);
	const textAlign = $derived(data.text_align ?? 'centered');
	const hasIntro = $derived(
		Boolean(data.title || (data.description && (data.description as any[]).length))
	);
	const isTextLayout = $derived(layout === 'one_text' || layout === 'text_one');
</script>

{#snippet introText()}
	{#if hasIntro && !isTextLayout}
		<div class="intro text-align-{textAlign}">
			{#if data.title}
				<h2 class="title">{data.title}</h2>
			{/if}
			{#if data.description}
				<div class="description">
					<PortableText value={data.description} components={{}} />
				</div>
			{/if}
		</div>
	{/if}
{/snippet}
<section class="media-group gutter layout_{layout}" class:hasIntro={hasIntro && !isTextLayout}>
	{#if layout !== 'one_text' && layout !== 'text_one'}
		{@render introText()}
	{/if}

	{#if mediaItems.length}
		<div class="media">
			{#if layout === 'two_one' || layout === 'one_two'}
				<ProjectMediaComponent media={mediaItems[0]} />
				{#each mediaItems.slice(1) as item}
					<ProjectMediaComponent media={item} fillContainer={true} />
				{/each}
			{/if}
			{#if layout === 'three' || layout === 'four'}
				{#each mediaItems as item, index}
					<ProjectMediaComponent media={item} fillContainer={index > 0} />
				{/each}
			{/if}
			{#if layout === 'one_three'}
				<ProjectMediaComponent media={mediaItems[0]} />
				{#each mediaItems.slice(1) as item, index}
					<ProjectMediaComponent media={item} fillContainer={index > 0} />
				{/each}
			{/if}
		</div>
	{/if}
</section>

<style>
	.media-group {
		--pad-top: 3rem;
		--pad-bot: 3rem;
		--gap: var(--gutter-sm);
		padding-top: var(--pad-top);
		padding-bottom: var(--pad-bot);
	}
	.media-group :global(+ .media-group:not(.hasIntro)) {
		padding-top: 0;
	}
	.media-group:has(:global(+ .media-group:not(.hasIntro))) {
		padding-bottom: var(--gap);
	}

	.intro {
		margin-bottom: var(--gutter-sm);
	}

	.title {
		font-size: var(--24pt);
		line-height: var(--32pt);
		margin: 0 0 var(--24pt);
	}

	.description {
		font-size: var(--18pt);
		line-height: var(--24pt);
	}

	.description :global(> :first-child) {
		margin-top: 0;
	}

	.description :global(> :last-child) {
		margin-bottom: 0;
	}

	.intro.text-align-centered {
		text-align: center;
	}

	.intro.text-align-left {
		text-align: left;
	}

	.intro.text-align-right {
		text-align: right;
	}
	.media {
		display: grid;
		gap: var(--gap);
	}

	.layout_one_four .media {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	@media (min-width: 720px) {
		.media-group {
			--gap: var(--gutter-lg);
		}
		.layout_one_two .media,
		.layout_two_one .media {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.layout_one_two .media :global(:nth-child(1)),
		.layout_two_one .media :global(:nth-child(3)) {
			grid-row: 1 / span 2;
		}
		.layout_one_two .media :global(:nth-child(2)),
		.layout_two_one .media :global(:nth-child(1)) {
			grid-row: 1;
		}
		.layout_one_two .media :global(:nth-child(3)),
		.layout_two_one .media :global(:nth-child(2)) {
			grid-row: 2;
		}
		.layout_three .media {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.layout_four .media {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
		.layout_one_three .media {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.layout_one_three .media :global(:nth-child(1)),
		.layout_three_one .media :global(:nth-child(4)) {
			grid-column: 1 / span 3;
		}
	}
	@media (min-width: 960px) {
		.media-group {
			padding-top: 4rem;
			padding-bottom: 4rem;
		}

		.intro {
			margin-bottom: 76px;
		}

		.title {
			font-size: var(--40pt);
			line-height: var(--48pt);
			margin-bottom: var(--32pt);
		}

		.description {
			font-size: var(--20pt);
			line-height: var(--32pt);
		}
	}
</style>
