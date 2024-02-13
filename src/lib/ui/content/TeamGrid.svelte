<script lang="ts">
	import type { TeamGrid } from '$lib/types';
	import { PortableText } from '@portabletext/svelte';

	export let data: TeamGrid;

	$: hasDescription = Boolean(data.description?.[0]?.children?.[0]?.text);

	$: {
		console.log(data);
	}
</script>

<section class="team-grid gutter bg-{data.bgColor ?? 'transparent'}" class:hasDescription>
	{#if data.title}
		<h2 class="title">{data.title}</h2>
	{/if}
	{#if hasDescription}
		<div class="description">
			<div class="inner">
				<PortableText value={data.description} components={{}} />
			</div>
		</div>
	{/if}

	<div class="members">
		{#each data.members as member (member)}
			<div class="member">
				{#if member.image?.url}
					<picture class="headshot">
						<img src={member.image.url} alt={member.name} />
					</picture>
				{:else}
					<div class="headshot placeholder"></div>
				{/if}
				<h4 class="name">{member.name}</h4>
				{#if member.title}
					<p class="title">{member.title}</p>
				{/if}
			</div>
		{/each}
	</div>

	{#if data.extraMembers && data.extraMembers.length > 0}
		<div class="extra">
			<div class="inner">
				{#if data.extraMembersTitle}
					<h3 class="title">{data.extraMembersTitle}</h3>
				{/if}
				<p class="people">
					{#each data.extraMembers as member, index (member)}
						<span class="member">{member.name}, {member.title}</span>
						{#if index < data.extraMembers.length - 1}
							<span class="divider"> | </span>
						{/if}
					{/each}
				</p>
			</div>
		</div>
	{/if}
</section>

<style>
	section {
		padding-top: 3rem;
		padding-bottom: 3rem;
	}
	section > .title {
		border-bottom: 1px solid var(--text-color-15);
		padding-bottom: var(--32pt);
		margin: 0 0 var(--32pt);
	}
	.description {
		margin-bottom: var(--40pt);
	}
	.description .inner > :global(:first-child) {
		margin-top: 0;
	}
	.description .inner > :global(:last-child) {
		margin-bottom: 0;
	}
	.members {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--32pt) var(--16pt);
	}
	.members p,
	.members h4 {
		font-size: inherit;
		margin: 0;
	}
	.members p {
		line-height: var(--16pt);
	}
	.headshot,
	.headshot img {
		aspect-ratio: 1 / 1;
		display: block;
		width: 100%;
	}
	.headshot.placeholder {
		background: var(--text-color-15);
	}
	.member .name {
		text-transform: uppercase;
		font-size: var(--14pt);
		font-weight: bold;
		margin-top: var(--12pt);
	}
	.member .title {
		line-height: inherit;
		font-size: var(--14pt);
		color: var(--text-color-60);
	}
	.extra {
		margin-top: var(--32pt);
	}
	.extra .title {
		font-size: var(--16pt);
		margin: 0;
	}
	.extra p {
		margin: 0;
		font-size: var(--14pt);
		color: var(--text-color-60);
	}
	.extra .divider {
		display: inline-block;
		padding: 0 8px;
		transform: scaleY(1.4) translateY(-1px);
	}
	@media (min-width: 720px) {
		section {
			padding-top: 4rem;
			padding-bottom: 4rem;
		}
		section > .title {
			padding-bottom: 40px;
			margin-bottom: 56px;
		}
		section.hasDescription > .title {
			margin-bottom: 32px;
		}
		.extra,
		.description {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
		}
		.description {
			margin-bottom: 56px;
		}
		.description .inner,
		.extra .inner {
			grid-column: 1 / span 7;
		}
	}
	@media (min-width: 720px) {
		.members {
			grid-template-columns: repeat(3, 1fr);
			gap: var(--32pt);
		}
	}
	@media (min-width: 1120px) {
		.members {
			grid-template-columns: repeat(4, 1fr);
		}
	}
</style>
