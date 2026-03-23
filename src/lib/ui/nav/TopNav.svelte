<script lang="ts">
	import { navigating, page } from '$app/state';
	import { store } from '$lib/store.svelte';
	import type { Config } from '$lib/types';
	import BespokeAnimatedLogo from '$lib/ui/logos/BespokeAnimatedLogo.svelte';
	import InstagramLogo from '$lib/ui/logos/InstagramLogo.svelte';

	import gsap, { Power3, Sine } from 'gsap/dist/gsap';
	import { onMount, tick, untrack } from 'svelte';
	import { cubicIn, cubicOut, expoOut, linear, sineInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	interface Props {
		usePillFollower?: boolean;
		config: Config;
	}

	let { usePillFollower = true, config }: Props = $props();

	let scrollY = $state(0);
	let changeBgTimeout = $state<number>();
	let hasBg = $state(false);

	let bespokeLogo = $state<BespokeAnimatedLogo>();
	let hMenuEl = $state<HTMLElement>();
	let borderEl = $state<HTMLDivElement>();
	let linkElements = $state<{ [key: string]: HTMLAnchorElement }>({});
	let hoveredUrl = $state<string | null>(null);
	let menuStateTimeout = $state<number>();
	let borderTween = $state<gsap.core.Tween | null>(null);
	let previousActiveUrl: string | null = null;
	let clickedTargetNoAnimate: string | null = null;
	let pendingNavUrl: string | null = null;

	let useUnderline = $derived(config.borderRadius === 0);

	function setMenuState(newState: 'open' | 'closed') {
		store.menuState = newState;
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
	}

	function toggleMenu() {
		const newState = store.menuState === 'open' ? 'closed' : 'open';
		setMenuState(newState);
		return newState;
	}

	function getActiveUrl() {
		return menuLinks.find((link) => link.isActive)?.url || null;
	}

	function killBorderTween() {
		if (borderTween) {
			borderTween.kill();
			borderTween = null;
		}
	}

	function fadeBorderOut(immediate = false) {
		if (!borderEl) return;
		killBorderTween();
		borderTween = gsap.to(borderEl, {
			autoAlpha: 0,
			duration: immediate ? 0 : 0.22,
			ease: Sine.easeInOut,
			overwrite: true,
			onComplete: () => {
				borderTween = null;
			}
		});
	}

	function moveBorderTo(url: string, immediate = false) {
		if (!usePillFollower || !borderEl || !hMenuEl) return false;
		const targetEl = linkElements[url];
		if (!targetEl) return false;

		const navBox = hMenuEl.getBoundingClientRect();
		const targetBox = targetEl.getBoundingClientRect();
		const left = targetBox.left - navBox.left;
		const width = targetBox.width;
		const currentOpacity = Number(gsap.getProperty(borderEl, 'opacity')) || 0;
		const isHidden = currentOpacity <= 0.01;
		const currentLeft = Number(gsap.getProperty(borderEl, 'left')) || 0;
		const currentWidth = Number(gsap.getProperty(borderEl, 'width')) || 0;
		const isSamePosition =
			Math.abs(currentLeft - left) < 0.5 && Math.abs(currentWidth - width) < 0.5;

		killBorderTween();

		if (immediate) {
			gsap.set(borderEl, {
				left,
				width,
				autoAlpha: 1
			});
			return true;
		}

		if (isHidden) {
			gsap.set(borderEl, {
				left,
				width
			});
			borderTween = gsap.to(borderEl, {
				autoAlpha: 1,
				duration: 0.22,
				ease: Sine.easeInOut,
				overwrite: true,
				onComplete: () => {
					borderTween = null;
				}
			});
			return true;
		}

		if (isSamePosition) {
			gsap.set(borderEl, {
				autoAlpha: 1
			});
			return true;
		}

		borderTween = gsap.to(borderEl, {
			left,
			width,
			autoAlpha: 1,
			duration: 0.42,
			ease: Power3.easeOut,
			overwrite: true,
			onComplete: () => {
				borderTween = null;
			}
		});

		return true;
	}

	function syncBorderToState(immediate = false) {
		if (!usePillFollower) {
			fadeBorderOut(true);
			return;
		}

		const activeUrl = getActiveUrl();
		if (pendingNavUrl && activeUrl === pendingNavUrl) {
			pendingNavUrl = null;
		}
		const targetUrl = pendingNavUrl || hoveredUrl || activeUrl;
		const skipPositionAnimation =
			!!previousActiveUrl &&
			!!activeUrl &&
			previousActiveUrl !== activeUrl &&
			hoveredUrl === activeUrl;
		const clickToHoveredTargetNoAnimate =
			!!activeUrl && !!clickedTargetNoAnimate && activeUrl === clickedTargetNoAnimate;
		const shouldImmediate = immediate || skipPositionAnimation || clickToHoveredTargetNoAnimate;
		if (!targetUrl) {
			fadeBorderOut(shouldImmediate);
			previousActiveUrl = activeUrl;
			if (clickToHoveredTargetNoAnimate) clickedTargetNoAnimate = null;
			return;
		}

		const moved = moveBorderTo(targetUrl, shouldImmediate);
		if (!moved) fadeBorderOut(shouldImmediate);
		previousActiveUrl = activeUrl;
		if (clickToHoveredTargetNoAnimate) clickedTargetNoAnimate = null;
	}

	function onLinkEnter(url: string) {
		hoveredUrl = url;
		syncBorderToState();
	}

	function onMenuLeave() {
		hoveredUrl = null;
		syncBorderToState();
	}

	function onLinkClick(url: string) {
		const currentOpacity = borderEl ? Number(gsap.getProperty(borderEl, 'opacity')) || 0 : 0;
		if (hoveredUrl === url && currentOpacity > 0.01) {
			clickedTargetNoAnimate = url;
		}
		pendingNavUrl = url;
		hoveredUrl = url;
	}

	function onLogoClick() {
		hoveredUrl = null;
		pendingNavUrl = null;
		clickedTargetNoAnimate = null;
		previousActiveUrl = null;
		fadeBorderOut(true);
	}
	$effect(() => {
		if (
			(navigating?.type === 'popstate' || navigating?.type === 'link') &&
			store.menuState === 'open'
		) {
			untrack(() => {
				setMenuState('closed');
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
		if (scrollY > -10000) {
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
		}
	});
	let currentRoute = $derived(page.url.pathname ?? '');
	let menuLinks = $derived(
		config.menu.map((item) => {
			return {
				name: item.title,
				url: `/${item.slug}/`,
				isActive: (currentRoute.indexOf(`/${item.slug}`) ?? -1) > -1
			};
		})
	);
	let menuIsWide = $derived(menuLinks.length >= 4 ? 960 : 760);
	let isMenuOpen = $derived(store.menuState === 'open');
	let mobileNavStyle = $derived(store.bgColor ? `--bg-color: ${store.bgColor};` : '');

	$effect(() => {
		if (!usePillFollower) {
			fadeBorderOut(true);
			return;
		}

		menuLinks;
		currentRoute;
		hoveredUrl;

		const frame = requestAnimationFrame(() => {
			syncBorderToState();
		});

		return () => {
			cancelAnimationFrame(frame);
		};
	});

	onMount(() => {
		const init = async () => {
			await tick();
			previousActiveUrl = getActiveUrl();
			syncBorderToState(true);
		};
		init();

		const handleResize = () => syncBorderToState(true);
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			killBorderTween();
		};
	});
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
			onclick={onLogoClick}
			onmouseenter={(e) => bespokeLogo?.play(true)}
			onfocus={(e) => bespokeLogo?.play(true)}
		>
			<BespokeAnimatedLogo bind:this={bespokeLogo} />
		</a>
	</div>
	<div class="right">
		<nav class="h-menu" bind:this={hMenuEl} onmouseleave={onMenuLeave}>
			{#each menuLinks as link (link.url)}
				<a
					href={link.url}
					class:active={link.isActive}
					bind:this={linkElements[link.url]}
					onclick={() => onLinkClick(link.url)}
					onmouseenter={() => onLinkEnter(link.url)}
					onfocus={() => onLinkEnter(link.url)}>{link.name}</a
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
		position: relative;
	}
	.h-menu a {
		display: flex;
		border-radius: var(--input-border-radius);
		border: 0;
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
		top: 0;
		left: 0;
		pointer-events: none;
		transition: border-color 180ms linear;
		opacity: 0;
	}
	.useUnderline .border {
		border-width: 0;
		border-bottom-width: 2px;
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
		padding-inline: var(--gutter-sm);
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
		grid-column: 1 / span 2;
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
