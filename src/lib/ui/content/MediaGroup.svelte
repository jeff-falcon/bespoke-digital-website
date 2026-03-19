<script lang="ts">
	import type { MediaGroup } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';
	import ProjectMediaComponent from '../project/ProjectMediaComponent.svelte';

	interface Props {
		data: MediaGroup;
		noGutter?: boolean;
	}

	let { data, noGutter = false }: Props = $props();

	const layout = $derived(data.layout ?? 'one_full');
	const mediaItems = $derived(data.media ?? []);
	const textAlign = $derived(data.text_align ?? 'centered');
	const hasIntro = $derived(
		Boolean(data.title || (data.description && (data.description as any[]).length))
	);
	const isTextLayout = $derived(layout === 'one_text' || layout === 'text_one');
</script>

{#snippet textContent()}
	{#if data.title}
		<h2 class="title">{data.title}</h2>
	{/if}
	{#if data.description}
		<div class="description">
			<PortableText value={data.description} components={{}} />
		</div>
	{/if}
{/snippet}

{#snippet introText()}
	{#if hasIntro && !isTextLayout}
		<div class="intro align-{textAlign}">
			{@render textContent()}
		</div>
	{/if}
{/snippet}
<section
	class="media-group layout_{layout}"
	class:gutter={!noGutter}
	class:hasIntro={hasIntro && !isTextLayout}
	class:hasText={hasIntro && isTextLayout}
>
	{#if layout !== 'one_text' && layout !== 'text_one'}
		{@render introText()}
	{/if}

	{#if mediaItems.length}
		<div class="media">
			{#if layout === 'two_one' || layout === 'one_two'}
				<ProjectMediaComponent media={mediaItems[0]} />
				{#each mediaItems.slice(1) as item, index}
					<ProjectMediaComponent media={item} fillContainer={index > 0 ? true : 'desktop'} />
				{/each}
			{/if}
			{#if layout === 'two' || layout === 'three' || layout === 'four'}
				{#each mediaItems as item, index}
					<ProjectMediaComponent media={item} fillContainer={index > 0 ? 'desktop' : false} />
				{/each}
			{/if}
			{#if layout === 'one_three'}
				<ProjectMediaComponent media={mediaItems[0]} />
				{#each mediaItems.slice(1) as item, index}
					<ProjectMediaComponent media={item} fillContainer={index > 0 ? 'desktop' : false} />
				{/each}
			{/if}
			{#if layout === 'three_one'}
				{#each mediaItems.slice(0, 2) as item, index}
					<ProjectMediaComponent media={item} fillContainer={index > 0 ? 'desktop' : false} />
				{/each}
				<ProjectMediaComponent media={mediaItems[3]} />
			{/if}
			{#if layout === 'one_half_half'}
				<ProjectMediaComponent media={mediaItems[0]} />
				{#each mediaItems.slice(1) as item, index}
					<ProjectMediaComponent media={item} fillContainer={index > 0 ? true : 'desktop'} />
				{/each}
			{/if}
			{#if layout === 'half_half_one'}
				{#each mediaItems.slice(0, 2) as item, index}
					<ProjectMediaComponent media={item} fillContainer={index > 0 ? 'desktop' : true} />
				{/each}
				<ProjectMediaComponent media={mediaItems[2]} />
			{/if}
			{#if layout === 'one_text' || layout === 'text_one'}
				{#if hasIntro}
					<div class="text align-{textAlign}">
						{@render textContent()}
					</div>
				{/if}
				<ProjectMediaComponent media={mediaItems[0]} />
			{/if}
			{#if layout === 'one_full'}
				<ProjectMediaComponent media={mediaItems[0]} />
			{/if}
		</div>
	{/if}
</section>

<style>
	.media-group {
		--vpad: 3rem;
		--gap: var(--gutter-sm);
		padding-top: var(--vpad);
		padding-bottom: var(--vpad);
	}
	.media-group :global(+ .media-group:not(.hasIntro)) {
		padding-top: 0;
	}
	.media-group:has(:global(+ .media-group)) {
		padding-bottom: var(--gap);
	}
	.media-group:has(:global(+ .media-group.hasIntro)) {
		padding-bottom: 0;
	}

	.intro {
		margin-bottom: 32px;
		max-width: 960px;
		margin-inline: auto;
		text-wrap: balance;
	}

	.title {
		font-size: var(--24pt);
		line-height: var(--32pt);
		margin: 0 0 var(--16pt);
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

	.intro.align-centered {
		text-align: center;
	}

	.intro.align-left {
		text-align: left;
	}

	.intro.align-right {
		text-align: right;
	}

	.text {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.text.align-centered {
		align-items: center;
		text-align: center;
	}

	.text.align-left {
		align-items: flex-start;
		text-align: left;
	}

	.text.align-right {
		align-items: flex-end;
		text-align: right;
	}
	.media {
		display: grid;
		gap: var(--gap);
		grid-template-rows: auto;
	}

	.layout_four .media {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
	.layout_one_two .media,
	.layout_two_one .media {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	@media (max-width: 719px) {
		.layout_one_two .media :global(:nth-child(1)),
		.layout_two_one .media :global(:nth-child(3)) {
			grid-column: 1 / span 2;
		}
		.layout_one_half_half .media,
		.layout_half_half_one .media {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.layout_one_half_half .media :global(:nth-child(1)),
		.layout_half_half_one .media :global(:nth-child(3)) {
			grid-column: 1 / span 2;
		}
		.layout_one_text.hasText .media > .text,
		.layout_text_one.hasText .media > .text {
			padding-top: 1.5rem;
			padding-bottom: 1.5rem;
		}
	}
	@media (min-width: 720px) {
		.media-group {
			--gap: var(--gutter-lg);
			--vpad: 4rem;
		}

		.intro {
			margin-bottom: 76px;
		}

		.title {
			font-size: var(--40pt);
			line-height: var(--48pt);
			margin-bottom: var(--24pt);
		}

		.description {
			font-size: var(--24pt);
			line-height: var(--32pt);
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
		.layout_two .media {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.layout_four .media {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
		.layout_one_three .media,
		.layout_three_one .media {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.layout_one_three .media :global(:nth-child(1)),
		.layout_three_one .media :global(:nth-child(4)) {
			grid-column: 1 / span 3;
		}
		.layout_one_half_half .media,
		.layout_half_half_one .media {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
		.layout_one_half_half .media :global(:nth-child(1)) {
			grid-column: 1 / span 2;
		}
		.layout_half_half_one .media :global(:nth-child(3)) {
			grid-column: 3 / span 2;
		}
		.layout_one_text.hasText .media,
		.layout_text_one.hasText .media {
			align-items: center;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.layout_one_text.hasText .media > .text {
			grid-column: 2;
		}
		.layout_one_text.hasText .media :global(figure) {
			grid-column: 1;
			grid-row: 1;
		}
		.layout_text_one.hasText .media > .text {
			grid-column: 1;
		}
		.hasText .media > .text {
			padding-inline: 24px;
			text-wrap: pretty;
		}
		.layout_text_one.hasText .media :global(figure) {
			grid-column: 2;
			grid-row: 1;
		}
	}
	@media (min-width: 960px) {
		.hasText .media > .text {
			padding-inline: 80px;
		}
	}
</style>
