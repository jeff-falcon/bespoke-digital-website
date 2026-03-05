<script lang="ts">
	import { navigating, page } from '$app/state';
	import { store } from '$lib/store.svelte';
	import type { Config } from '$lib/types';
	import BespokeAnimatedLogo from '$lib/ui/logos/BespokeAnimatedLogo.svelte';
	import InstagramLogo from '$lib/ui/logos/InstagramLogo.svelte';

	import { gsap } from 'gsap';
	import { untrack } from 'svelte';
	import { cubicIn, cubicOut, expoOut, linear, sineInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	interface Props {
		usePillFollower?: boolean;
		config: Config;
	}

	let { usePillFollower = true, config }: Props = $props();

	let isBorderAnimating = $state(false);
	let scrollY = $state(0);
	let changeBgTimeout = $state<number>();
	let hasBg = $state(false);

	let bespokeLogo = $state<BespokeAnimatedLogo>();
	let borderEl = $state<HTMLDivElement>();
	let linkElements = $state<{ [key: string]: HTMLAnchorElement }>({});
	let currentLinkHover = $state<HTMLAnchorElement | null>(null);
	let hoverTimeout = $state<number>();
	let menuStateTimeout = $state<number>();

	let useUnderline = $derived(config.borderRadius === 0);

	function toggleMenu() {
		const newState = store.menuState === 'open' ? 'closed' : 'open';
		clearTimeout(menuStateTimeout);
		if (newState === 'closed') {
			menuStateTimeout = window.setTimeout(() => {
				store.isMenuOpenComplete = false;
			}, 10);
		} else {
			menuStateTimeout = window.setTimeout(() => {
				store.isMenuOpenComplete = true;
			}, 500);
		}
		return newState;
	}
	function removeBorder() {
		clearTimeout(hoverTimeout);
		currentLinkHover = null;
		isBorderAnimating = false;
	}
	function mouseOut(e: MouseEvent) {
		clearTimeout(hoverTimeout);
		hoverTimeout = window.setTimeout(() => {
			if (!isOverCurrent) {
				const prevLink = menuLinks.find((link) => link.isActive);
				if (prevLink) {
					drawBorder(prevLink.url, true);
				} else if (borderEl) {
					gsap.to(borderEl, {
						autoAlpha: 0,
						duration: 0.3,
						ease: 'sine.inOut',
						overwrite: true
					});
				}
			}
		}, 350);
	}
	function drawBorder(url: string, removeOnComplete = false) {
		clearTimeout(hoverTimeout);
		hoverTimeout = window.setTimeout(() => {
			if (!borderEl) return;
			let prevLink = menuLinks.find((link) => link.isActive)?.url;
			if (currentLinkHover) {
				prevLink = currentLinkHover.getAttribute('href') || undefined;
			}
			if (!prevLink) prevLink = url;
			if (prevLink && usePillFollower) {
				isBorderAnimating = true;
				const fromEl = linkElements[prevLink];
				const toEl = linkElements[url];
				const fromBox = fromEl.getBoundingClientRect();
				const toBox = toEl.getBoundingClientRect();
				const left = Math.min(fromBox.left, toBox.left);
				const right = Math.max(fromBox.right, toBox.right);
				currentLinkHover = toEl;
				gsap.to(borderEl, {
					autoAlpha: 1,
					duration: 0.3,
					ease: 'sine.inOut',
					overwrite: true
				});
				const borderTl = gsap.timeline({
					onComplete: () => {
						if (removeOnComplete) {
							currentLinkHover = null;
							isBorderAnimating = false;
						}
					}
				});
				borderTl.set(borderEl, {
					left: `${fromBox.left}px`,
					width: `${fromBox.width}px`
				});
				borderTl.to(borderEl, {
					duration: 0.22,
					left: `${left}px`,
					width: `${right - left}px`,
					ease: 'power3.out'
				});
				borderTl.to(borderEl, {
					duration: 0.3,
					left: `${toBox.left}px`,
					width: `${toBox.width}px`,
					ease: 'power3.out'
				});
			}
		}, 150);
	}
	$effect(() => {
		if (
			navigating?.type === 'popstate' ||
			(navigating?.type === 'link' && store.menuState === 'open')
		) {
			untrack(() => {
				toggleMenu();
			});
		}
	});

	let backgroundColor = $derived(
		store.bgColor.startsWith('#')
			? `${store.bgColor}CC`
			: `rgba(${store.bgColor.replace('rgb(', '').replace(')', '')},0.8)`
	);
	let style = $derived(
		`--bg-color: ${backgroundColor}; ${
			config.borderRadius != null ? `--input-border-radius: ${config.borderRadius}px` : ''
		}`
	);
	$effect(() => {
		if (store.pageHasHero) {
			untrack(() => {
				clearTimeout(changeBgTimeout);
				hasBg = scrollY > 120;
			});
		} else {
			untrack(() => {
				clearTimeout(changeBgTimeout);
				if (typeof window !== 'undefined') {
					changeBgTimeout = window.setTimeout(() => {
						hasBg = true;
					}, 150);
				}
			});
		}
	});
	let currentRoute = $derived(page.url.pathname ?? '');
	let menuLinks = $derived(
		config.menu.map((item) => {
			return {
				name: item.name,
				url: `/${item.slug}/`,
				isActive: (currentRoute.indexOf(`/${item.slug}`) ?? -1) > -1
			};
		})
	);
	let menuIsWide = $derived(menuLinks.length >= 4 ? 960 : 760);
	let isMenuOpen = $derived(store.menuState === 'open');
	let isOverCurrent = $derived(currentLinkHover?.getAttribute('href') === currentRoute);
	let mobileNavStyle = $derived(store.bgColor ? `--bg-color: ${store.bgColor};` : '');
</script>

<svelte:window bind:scrollY />

<header
	class:isMenuOpen
	id="global-header"
	class="gutter"
	class:hasBg
	{style}
	class:useUnderline
	class:menuIsWide
>
	<div class="logo">
		<a
			href="/"
			onmouseenter={(e) => bespokeLogo?.play(true)}
			onfocus={(e) => bespokeLogo?.play(true)}
		>
			<BespokeAnimatedLogo bind:this={bespokeLogo} />
		</a>
	</div>
	<div class="right">
		<nav class="h-menu" class:isBorderAnimating class:isOverCurrent>
			{#each menuLinks as link (link.url)}
				<a
					href={link.url}
					class:active={link.isActive && !currentLinkHover}
					bind:this={linkElements[link.url]}
					onclick={removeBorder}
					onmouseleave={mouseOut}
					onmouseenter={(e) => drawBorder(link.url)}>{link.name}</a
				>
			{/each}
			<div class="border" bind:this={borderEl}></div>
		</nav>
		{#if !isMenuOpen}
			<a
				transition:fade={{ duration: 300, easing: linear }}
				class="insta-btn"
				href="https://www.instagram.com/bespoke__digital/"
				target="_blank"><InstagramLogo /></a
			>
		{/if}
		<button class="menu-btn" onclick={toggleMenu} aria-label="Toggle menu">
			<div class="line line1"></div>
			<div class="line line2"></div>
		</button>
	</div>
</header>
<div id="mobile-nav" class:menuIsWide class:isMenuOpen style={mobileNavStyle}>
	{#if isMenuOpen}
		<div
			class="bg"
			in:fly={{
				opacity: 0,
				y: 0,
				x: 0,
				duration: 400,
				easing: sineInOut,
				delay: 0
			}}
			out:fly={{
				opacity: 0,
				y: 0,
				x: 0,
				duration: 600,
				easing: sineInOut,
				delay: 600
			}}
		></div>
		<div class="wrap">
			<nav class="v-menu">
				{#each menuLinks as link, index (link.url)}
					<a
						href={link.url}
						in:fly|global={{
							duration: 1200,
							opacity: 0,
							y: 30,
							easing: expoOut,
							delay: index * 80
						}}
						out:fly|global={{
							duration: 400,
							opacity: 0,
							y: 0,
							easing: cubicIn,
							delay: index * 50
						}}
						class:active={link.isActive}>{link.name}</a
					>
				{/each}
			</nav>
			<footer>
				<div class="socials">
					{#each config.socials.links as link, index (link)}
						<a
							href={link.url}
							target="_blank"
							in:fly|global={{
								duration: 800,
								opacity: 0,
								x: 10,
								easing: cubicOut,
								delay: index * 50
							}}
							out:fly|global={{
								duration: 400,
								opacity: 0,
								x: 0,
								easing: cubicIn,
								delay: index * 50
							}}
						>
							<img src={link.icon} width="16" height="16" alt={link.name} />
						</a>
					{/each}
				</div>
				<div
					class="credits"
					in:fly|global={{
						duration: 800,
						opacity: 0,
						x: 0,
						y: 0,
						easing: sineInOut,
						delay: 300
					}}
					out:fly|global={{
						duration: 400,
						opacity: 0,
						x: 0,
						y: 0,
						easing: sineInOut
					}}
				>
					<p class="copyright">© {new Date().getFullYear()} Bespoke Digital</p>
				</div>
			</footer>
		</div>
	{/if}
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
		color: var(--text-color);
		z-index: var(--level10);
	}
	header:after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		opacity: 0;
		transition: var(--bg-color-timing) var(--ease-in-out-sine);
		transition-property: opacity, background-color;
		background: rgba(38, 38, 38, 0.8);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
	}
	header.hasBg:after {
		opacity: 1;
		background: var(--bg-color);
	}
	.right {
		display: flex;
		align-items: center;
	}
	.h-menu {
		display: none;
	}
	.h-menu a {
		display: flex;
		border-radius: var(--input-border-radius);
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
	}
	.h-menu a.active {
		border-color: var(--text-color-40);
		opacity: 1;
	}
	.useUnderline .h-menu,
	.useUnderline .border {
		--button-height-large: 32px;
	}
	.useUnderline .h-menu a {
		padding: 0;
		border-width: 0;
		border-bottom-width: 2px;
	}
	.h-menu.isBorderAnimating a,
	.h-menu.isBorderAnimating a.active {
		border-color: transparent;
	}
	/* .h-menu:not(.isBorderAnimating) a {
		transition-property: border-color, opacity;
	}
	.h-menu:not(.isBorderAnimating) a:hover {
		border-color: var(--text-color-40);
	} */
	.menu-btn {
		display: block;
		position: relative;
		background: transparent;
		border: 1px solid var(--text-color-40);
		border-radius: 80px;
		width: 40px;
		height: 40px;
		cursor: pointer;
		transition: linear 180ms border-color;
	}
	.menu-btn {
		border-color: var(--text-color);
	}
	.border {
		position: absolute;
		z-index: 0;
		background: transparent;
		border: 1px solid var(--text-color-40);
		border-radius: var(--input-border-radius);
		width: 0;
		height: var(--button-height-large);
		pointer-events: none;
		visibility: hidden;
		transition: border-color 180ms linear;
		opacity: 0;
	}
	.useUnderline .border {
		border-width: 0;
		border-bottom-width: 2px;
	}
	.isBorderAnimating .border {
		border-color: var(--text-color-40);
		visibility: visible;
	}
	.isBorderAnimating.isOverCurrent .border {
		border-color: var(--text-color-40);
	}
	.menu-btn .line {
		width: 16px;
		height: 2px;
		background: var(--text-color);
		transition: 220ms var(--ease-in-out-cubic) all;
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

	#mobile-nav {
		position: fixed;
		top: 0;
		left: 0;
		height: 100dvh;
		width: 100dvw;
		z-index: var(--level9);
		pointer-events: none;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 40px var(--gutter-sm);
	}
	#mobile-nav .bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		background: var(--bg-color);
	}

	#mobile-nav.isMenuOpen {
		pointer-events: all;
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
	}
	#mobile-nav .wrap {
		grid-column: 3 / span 2;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 1;
	}
	#mobile-nav .copyright {
		font-size: var(--12pt);
		opacity: 0.4;
		margin: 24px 0 0;
	}
	#mobile-nav footer {
		padding-bottom: 40px;
	}
	.v-menu {
		display: flex;
		flex-direction: column;
		gap: 40px;
		flex: 1;
		justify-content: center;
	}
	.v-menu a {
		font-size: var(--24pt);
		line-height: 1;
		color: var(--text-color);
		width: min-content;
		white-space: nowrap;
	}
	.v-menu a:hover,
	.v-menu a:focus,
	.v-menu a:active {
		text-decoration: none;
	}
	.insta-btn {
		display: flex;
		margin: 0 6px 0 0;
		width: 40px;
		height: 40px;
		justify-content: center;
		align-items: center;
		transition: linear 180ms;
		transition-property: border-color;
		color: var(--text-color);
	}
	.insta-btn:hover {
		border-color: var(--text-color);
	}
	.socials {
		display: flex;
		gap: 12px;
		transform: translateX(-8px);
	}
	.socials a {
		display: inline-flex;
		width: 32px;
		height: 32px;
		align-items: center;
		justify-content: center;
	}
	:global(.bg-is-light) .socials a {
		filter: invert(1);
	}

	@media (min-width: 760px) {
		header:not(.menuIsWide) .h-menu {
			display: flex;
		}
		header:not(.menuIsWide).useUnderline .h-menu {
			gap: 48px;
			margin-right: 16px;
			align-items: center;
		}
		header:not(.menuIsWide) .insta-btn {
			margin: 0 0 0 32px;
			border: 1px solid var(--text-color-40);
			border-radius: 80px;
			width: var(--button-height-large);
			height: var(--button-height-large);
		}

		header:not(.menuIsWide) .menu-btn {
			display: none;
		}
		#mobile-nav:not(.menuIsWide) {
			display: none;
		}
	}
	@media (min-width: 960px) {
		.menuIsWide .h-menu {
			display: flex;
		}
		.menuIsWide.useUnderline .h-menu {
			gap: 48px;
			margin-right: 16px;
			align-items: center;
		}
		.menuIsWide .insta-btn {
			margin: 0 0 0 32px;
			border: 1px solid var(--text-color-40);
			border-radius: 80px;
			width: var(--button-height-large);
			height: var(--button-height-large);
		}

		.menuIsWide .menu-btn {
			display: none;
		}
		#mobile-nav.menuIsWide {
			display: none;
		}
	}
</style>
