<script lang="ts">
	import ProjectMediaComponent from '$lib/ui/project/ProjectMediaComponent.svelte';
	import { PortableText } from '@portabletext/svelte';
	import type { Project } from '$lib/types';

	export let project: Project;

	$: hasDescription = project.description || project.descriptionIntro;
</script>

<div class="project-view">
	{#if project.name}
		<section class="gutter project-info">
			{#if hasDescription}
				{#if project.descriptionIntro}
					<div class="description intro">
						<PortableText value={project.descriptionIntro} />
					</div>
				{/if}
				{#if project.description}
					<div class="description extra">
						<PortableText value={project.description} />
					</div>
				{/if}
			{/if}
			<div class="name-credits">
				<h3 class="project-name">{project.name}</h3>
				{#if project.credits}
					<div class="credits">
						{#each project.credits as credit}
							<div class="credit">
								<h3 class="name">{credit.name}</h3>
								<p class="value">{credit.credit}</p>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</section>
	{/if}
	{#if project.media}
		<section class="medias gutter">
			{#each project.media as item, index}
				{#if item._type === 'project_media'}
					<ProjectMediaComponent media={item} scaleOnReveal={index === 0} />
				{/if}
				{#if item._type === 'item_pair'}
					<div class="pair">
						<ProjectMediaComponent media={item.left} scaleOnReveal={index === 0} />
						<ProjectMediaComponent media={item.right} scaleOnReveal={index === 0} />
					</div>
				{/if}
			{/each}
		</section>
	{/if}
</div>

<style>
	.medias,
	.pair {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: var(--gutter-sm);
	}
	.project-info {
		display: grid;
		grid-template-areas:
			'description-intro'
			'name-credits'
			'description-extra';
		padding-top: 120px;
		padding-bottom: 40px;
	}
	.description.intro {
		grid-area: description-intro;
		font-size: var(--18pt);
		line-height: var(--24pt);
	}
	.description.extra {
		grid-area: description-extra;
		font-size: var(--16pt);
		line-height: var(--24pt);
		opacity: 0.6;
		margin-top: var(--32pt);
	}
	.description :global(p),
	.description :global(li) {
		font-size: inherit;
		line-height: inherit;
	}
	.description :global(> p:first-of-type),
	.description :global(> p:first-of-type) {
		margin-top: 0;
	}
	.description :global(> p:last-of-type),
	.description :global(> p:last-of-type) {
		margin-bottom: 0;
	}
	.name-credits {
		grid-area: name-credits;
		display: flex;
		flex-direction: column;
		gap: var(--24pt);
		margin-top: var(--32pt);
		padding-top: var(--24pt);
		border-top: 1px solid rgba(255, 255, 255, 0.15);
	}
	.project-name {
		font-size: var(--18pt);
		line-height: var(--24pt);
		margin: 0;
		font-weight: bold;
	}
	.credits .name,
	.credits .value {
		font-size: var(--14pt);
		line-height: var(--24pt);
		margin: 0;
	}
	.credits .name {
		font-weight: bold;
	}
	.credits .value {
		font-weight: normal;
	}
	.credit + .credit {
		margin-top: var(--24pt);
	}

	@media (min-width: 720px) {
		.medias {
			gap: var(--gutter-lg);
		}
		.pair {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: var(--gutter-lg);
		}
	}
	@media (min-width: 960px) {
		.project-info {
			grid-template-areas:
				'description-intro name-credits'
				'description-extra name-credits';
			grid-template-columns: 8fr 4fr;
			gap: var(--32pt) calc(var(--gutter-lg) + var(--column-width));
			padding-top: 128px;
			padding-bottom: 68px;
		}
		.name-credits {
			padding-top: 0;
			margin-top: 0;
			border-top: 0;
			gap: 40px;
		}
		.project-name {
			font-size: var(--20pt);
			margin: 0;
			padding-top: 0;
			border-top: 0;
		}
		.credits .name,
		.credits .value {
			font-size: var(--16pt);
		}

		.description.intro {
			font-size: var(--20pt);
			line-height: var(--32pt);
		}
		.description.extra {
			margin-top: 0;
			font-size: var(--18pt);
			line-height: var(--24pt);
		}
	}
</style>
