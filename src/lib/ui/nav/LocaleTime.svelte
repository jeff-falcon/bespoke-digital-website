<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		timezone: string;
	}

	let { timezone }: Props = $props();

	let tick = $state(0);

	onMount(() => {
		const myTimer = window.setInterval(() => {
			tick += 1;
		}, 100);
		return () => {
			window.clearInterval(myTimer);
		};
	});

	function getLocalTime(timezone: string, tick = 0) {
		const date = new Date();
		const localTime = date
			.toLocaleString(navigator.language, {
				timeZone: timezone,
				timeStyle: 'short'
			})
			.toLocaleLowerCase();
		if (localTime.includes('am') || localTime.includes('pm')) {
			const time = localTime.split(' ');
			let t = time[0];
			if (t.length === 4) t = `0${t}`;
			return `${t}<span class="ampm">${time[1]}</span>`;
		} else {
			return localTime;
		}
	}
	let isClientSide = $derived(typeof window !== 'undefined');
	let time = $derived(isClientSide ? getLocalTime(timezone, tick) : '');
</script>

{#if time}
	<time class="time">{@html time}</time>
{/if}
