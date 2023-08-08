<script lang="ts">
	import { page, navigating } from '$app/stores';
	import { menuState, pageHasHero } from '$lib/store';
	import BespokeLogo from '$lib/ui/logos/BespokeLogo.svelte';
	import InstagramLogo from '$lib/ui/logos/InstagramLogo.svelte';

	import anime from 'animejs';

	let isBorderAnimating = false;
	let scrollY = 0;

	interface BorderPosition {
		x: number;
		width: number;
	}

	let borderEl: HTMLDivElement;
	let linkElements: { [key: string]: HTMLAnchorElement } = {};
	let fromToAnim = { from: { x: 0, width: 0 }, to: { x: 0, width: 0 } };

	$: if ($navigating?.type === 'popstate' || $navigating?.type === 'link') {
		if ($menuState === 'open') {
			menuState.set('closed');
		}
	}

	$: menuLinks = [
		{
			name: 'Work',
			url: '/work',
			isActive: (currentRoute.indexOf('/work') ?? -1) > -1
		},
		{
			name: 'About',
			url: '/about',
			isActive: (currentRoute.indexOf('/about') ?? -1) > -1
		},
		{
			name: 'Connect',
			url: '/connect',
			isActive: (currentRoute.indexOf('/connect') ?? -1) > -1
		}
	];

	$: currentRoute = $page.url.pathname ?? '';
	$: isMenuOpen = $menuState === 'open';

	function toggleMenu() {
		console.log('toggleMenu', $menuState);
		menuState.update((state) => (state === 'open' ? 'closed' : 'open'));
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
</script>

<svelte:window bind:scrollY />

<header class:isMenuOpen class="gutter" class:hasBg={!($pageHasHero && scrollY < 120)}>
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
<div class="nav-overlay" class:isMenuOpen>
	<nav class="v-menu">
		{#each menuLinks as link (link.url)}
			<a href={link.url} class:active={link.isActive}>{link.name}</a>
		{/each}
	</nav>
</div>

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
		z-index: var(--level10);
		transition: linear 300ms background-color;
	}
	header.hasBg {
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		background-color: rgba(38, 38, 38, 0.8);
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
		height: var(--button-height-large);
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
		border: 1px solid var(--text-light-40);
		border-radius: 80px;
		width: 40px;
		height: 40px;
		cursor: pointer;
		transition: linear 180ms border-color;
	}
	.menu-btn {
		border-color: var(--text-light);
	}
	.border {
		position: absolute;
		z-index: 0;
		background: transparent;
		border: 1px solid var(--text-light);
		border-radius: 80px;
		width: 0;
		height: var(--button-height-large);
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
	header.isMenuOpen .menu-btn .line1 {
		transform: translateY(0) rotate(45deg);
	}
	header.isMenuOpen .menu-btn .line2 {
		transform: translateY(0) rotate(-45deg);
	}
	.nav-overlay {
		position: fixed;
		top: 0;
		left: 0;
		height: 100dvh;
		width: 100dvw;
		z-index: var(--level9);
		background: var(--bg-dark);
		opacity: 0;
		pointer-events: none;
		display: flex;
		align-items: center;
	}
	.nav-overlay.isMenuOpen {
		opacity: 1;
		pointer-events: all;
	}
	.v-menu {
		display: flex;
		flex-direction: column;
		gap: 40px;
		padding-left: calc(50% + var(--gutter-sm) * 0.05);
	}
	.v-menu a {
		font-size: var(--24pt);
		line-height: 1;
		color: white;
	}
	.insta-btn {
		margin-left: 32px;
		border: 1px solid var(--text-light-40);
		border-radius: 80px;
		width: var(--button-height-large);
		height: var(--button-height-large);
		justify-content: center;
		align-items: center;
		transition: linear 180ms border-color;
	}
	.insta-btn:hover {
		border-color: var(--text-light);
	}
	@media (min-width: 760px) {
		.h-menu {
			display: flex;
		}
		.insta-btn {
			display: flex;
		}
		.menu-btn {
			display: none;
		}
		.nav-overlay {
			display: none;
		}
	}
</style>
