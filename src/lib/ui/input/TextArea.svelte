<script lang="ts">
	import { store } from '$lib/store.svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		label?: string;
		hint?: string;
		name: string;
		id: string;
		value: string;
		error?: string;
		readonly?: boolean;
		onBlur?: (value: string) => void;
	}

	let {
		label = '',
		hint = '',
		name,
		id,
		value = $bindable(),
		error = '',
		readonly = false,
		onBlur
	}: Props = $props();

	let isFocused = $state(false);
	let textareaEl = $state<HTMLTextAreaElement>();
	let scrollHeight = $state(0);
	let actualScrollHeight = $state(0);

	let hasError = $derived(error.trim().length > 0);
	let isTaller = $derived(scrollHeight > 50);
	let isScrollable = $derived(actualScrollHeight > 160);

	function onChange(el: HTMLTextAreaElement) {
		scrollHeight = 0;
		window.requestAnimationFrame(() => {
			if (!textareaEl) return;
			actualScrollHeight = textareaEl.scrollHeight;
			scrollHeight = Math.min(144, textareaEl.scrollHeight);
		});
	}
</script>

<div
	class="textarea-container"
	class:hasValue={value.trim().length > 0}
	class:isFocused={readonly ? false : isFocused}
	class:hasError
	class:isTaller
	class:isScrollable
	class:inputBorderIsRounded={store.inputBorderIsRounded}
	style="--height: {scrollHeight < actualScrollHeight && !isScrollable
		? actualScrollHeight
		: scrollHeight}px"
>
	<div class="textarea">
		{#if label}
			<label for={id}>{label}</label>
		{/if}
		<textarea
			{name}
			{id}
			bind:value
			{readonly}
			bind:this={textareaEl}
			onfocus={(e) => (isFocused = true)}
			onblur={(e) => {
				isFocused = false;
				onBlur?.(value);
			}}
			onchange={(e) => {
				onChange(e.currentTarget);
			}}
			oninput={(e) => {
				onChange(e.currentTarget);
			}}
		></textarea>
	</div>
	{#if error}
		<p class="hint error" in:fade={{ duration: 250 }}>{error}</p>
	{:else if hint}
		<p class="hint">{hint}</p>
	{/if}
</div>

<style>
	.textarea-container {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.hint {
		font-size: var(--12pt);
		line-height: var(--16pt);
		color: white;
		margin: 0;
	}
	.hint.error {
		color: var(--error-text);
		text-align: right;
	}
	.textarea {
		height: max(var(--height), var(--button-height-large));
		display: flex;
		flex-direction: column;
		gap: 4px;
		position: relative;
	}
	.textarea:after {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: calc(100% - 2px);
		border: 1px solid var(--text-color-5);
		border-bottom-color: var(--text-color-60);
		border-radius: var(--input-border-radius);
		pointer-events: none;
		transition: 180ms linear border-color;
	}
	.textarea-container.inputBorderIsRounded .textarea:after {
		border-color: var(--text-color-15);
	}

	.hasError .textarea:after {
		border-color: var(--error-text);
	}
	.hasError .textarea textarea {
		color: var(--error-text);
	}
	label {
		position: absolute;
		top: 12px;
		left: max(12px, var(--input-border-radius));
		pointer-events: none;
		font-size: var(--16pt);
		transition: 180ms all var(--ease-in-out-cubic);
		transform: translate3d(0, 0, 0);
		transform-origin: 0 50%;
		opacity: 0.3;
		color: var(--text-color);
		line-height: 1.5;
		z-index: 1;
	}
	.hasValue label {
		transform: translate3d(0, -12px, 0) scale(0.875);
	}
	textarea {
		border: 0;
		height: max(var(--height), var(--button-height-large));
		position: relative;
		padding: 13px max(12px, var(--input-border-radius)) 0;
		background: transparent;
		color: var(--text-color);
		font-size: var(--16pt);
		line-height: var(--24pt);
		resize: none;
	}
	textarea:focus {
		outline: none;
	}
	textarea::selection {
		background-color: var(--text-color-15);
		color: var(--text-color);
	}
	.hasValue textarea {
		transform: translate(0, 7px);
	}
	.isFocused:not(.hasError) .textarea:after {
		border-color: var(--text-color);
	}
	.isFocused:not(.hasValue) label {
		opacity: 1;
		transform: translate(8px, 0);
	}
	.isTaller .textarea {
		height: calc(var(--height) + 12px);
	}
	.isTaller textarea {
		padding-top: 0;
		height: calc(var(--height) + 12px);
		transform: translate(0, 21px);
	}
	.isTaller.isScrollable .textarea {
		height: calc(var(--height) + 40px);
	}
	.isTaller.isScrollable textarea {
	}
</style>
