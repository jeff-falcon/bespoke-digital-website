<script lang="ts">
	import { page } from '$app/stores';
	import BespokeLogo from '$lib/ui/logos/BespokeLogo.svelte';
	import InstagramLogo from '$lib/ui/logos/InstagramLogo.svelte';

	import anime from 'animejs';

	let isMenuOpen = false;
	let isBorderAnimating = false;

	interface BorderPosition {
		x: number;
		width: number;
	}

	let borderEl: HTMLDivElement;
	let linkElements: { [key: string]: HTMLAnchorElement } = {};
	let fromToAnim = { from: { x: 0, width: 0 }, to: { x: 0, width: 0 } };

	$: menuLinks = [
		{
			name: 'Work',
			url: '/work',
			isActive: ($page.route.id?.indexOf('/work') ?? -1) > -1
		},
		{
			name: 'About',
			url: '/about',
			isActive: ($page.route.id?.indexOf('/about') ?? -1) > -1
		},
		{
			name: 'Connect',
			url: '/connect',
			isActive: ($page.route.id?.indexOf('/connect') ?? -1) > -1
		}
	];

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
	function drawBorder(url: string) {
		const prevLink = menuLinks.find((link) => link.isActive);
		if (prevLink) {
			isBorderAnimating = true;
			const fromEl = linkElements[prevLink.url];
			const toEl = linkElements[url];
			const fromBox = fromEl.getBoundingClientRect();
			const toBox = toEl.getBoundingClientRect();
			const left = Math.min(fromBox.left, toBox.left);
			const right = Math.max(fromBox.right, toBox.right);
			anime({
				targets: borderEl,
				keyframes: [
					{ duration: 0, left: `${fromBox.left}px`, width: `${fromBox.width}px` },
					{ duration: 150, left: `${left}px`, width: `${right - left}px` },
					{ duration: 300, left: `${toBox.left}px`, width: `${toBox.width}px` }
				],
				duration: 450,
				easing: 'easeOutElastic(1, .9)',
				complete: () => {
					isBorderAnimating = false;
				}
			});
		}
	}

	function highlight(
		node: HTMLElement,
		{ from, to, duration }: { from: BorderPosition; to: BorderPosition; duration: number }
	) {}
</script>

<header class:isMenuOpen class="gutter">
	<div class="logo">
		<a href="/">
			<BespokeLogo />
		</a>
	</div>
	<div class="right">
		<nav class="h-menu" class:isBorderAnimating>
			{#each menuLinks as link (link.url)}
				<a
					href={link.url}
					class:active={link.isActive}
					bind:this={linkElements[link.url]}
					on:click={(e) => drawBorder(link.url)}>{link.name}</a
				>
			{/each}
			<div class="border" bind:this={borderEl} />
		</nav>
		<button class="menu-btn" on:click={toggleMenu}>
			<div class="line line1" />
			<div class="line line2" />
		</button>
		<a class="insta-btn" href="https://www.instagram.com/bespoke__digital/"><InstagramLogo /></a>
	</div>
</header>

<style>
	header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: var(--top-nav-height);
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: white;
	}
	.right {
		display: flex;
		align-items: center;
	}
	.h-menu,
	.insta-btn {
		display: none;
	}
	.h-menu a {
		display: flex;
		border-radius: 50px;
		border: 1px solid transparent;
		padding: 0 36px;
		height: 48px;
		justify-content: center;
		align-items: center;
		transition: linear 180ms;
		transition-property: opacity;
	}
	.h-menu a:hover {
		text-decoration: none;
		opacity: 0.6;
	}
	.h-menu a.active {
		border-color: var(--text-light);
		opacity: 1;
	}
	.h-menu.isBorderAnimating a,
	.h-menu.isBorderAnimating a.active {
		border-color: transparent;
	}
	.menu-btn {
		display: block;
		position: relative;
		background: transparent;
		border: 1px solid var(--text-light);
		border-radius: 80px;
		width: 40px;
		height: 40px;
		cursor: pointer;
	}
	.border {
		position: absolute;
		z-index: 0;
		background: transparent;
		border: 1px solid var(--text-light);
		border-radius: 80px;
		width: 0;
		height: 48px;
		pointer-events: none;
		visibility: hidden;
	}
	.isBorderAnimating .border {
		visibility: visible;
	}
	.menu-btn .line {
		width: 16px;
		height: 2px;
		background: white;
		transition: 220ms var(--cubic-ease-in-out) all;
		position: absolute;
		left: calc(50% - 8px);
		top: calc(50% - 1px);
	}
	.menu-btn .line1 {
		transform: translateY(-3px);
	}
	.menu-btn .line2 {
		transform: translateY(3px);
	}
	.isMenuOpen .menu-btn .line1 {
		transform: translateY(0) rotate(45deg);
	}
	.isMenuOpen .menu-btn .line2 {
		transform: translateY(0) rotate(-45deg);
	}
	.insta-btn {
		margin-left: 32px;
		border: 1px solid var(--text-light);
		border-radius: 80px;
		width: 48px;
		height: 48px;
		justify-content: center;
		align-items: center;
	}
	@media (min-width: 560px) {
		.h-menu {
			display: flex;
		}
		.insta-btn {
			display: flex;
		}
		.menu-btn {
			display: none;
		}
	}
</style>