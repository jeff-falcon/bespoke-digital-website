<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	export let label: string = '';
	export let placeholder: string = '';
	export let hint: string = '';
	export let name: string;
	export let id: string;
	export let value: string;
	export let type: string = 'text';
	export let error: string = '';
	export let allowSpaces: boolean | null = null;
	export let readonly = false;

	let dispatch = createEventDispatcher<{ blur: string }>();

	let isFocused = false;
	let inputValue = value;

	$: hasError = error.trim().length > 0;
	$: shouldAllowSpaces = allowSpaces === false ? false : type !== 'password' && type !== 'email';

	function onChange(val: string) {
		if (!shouldAllowSpaces) {
			value = val.replace(/\s/g, '');
			inputValue = value;
		} else {
			value = val;
		}
	}
</script>

<div
	class="textfield-container"
	class:hasValue={value.trim().length > 0}
	class:isFocused={readonly ? false : isFocused}
	class:hasError
>
	<div class="textfield">
		{#if label}
			<label for={id}>{label}</label>
		{/if}
		<input
			{type}
			{placeholder}
			{name}
			{id}
			value={inputValue}
			{readonly}
			on:focus={(e) => (isFocused = true)}
			on:blur={(e) => {
				isFocused = false;
				console.log('blur:', `|${e.currentTarget.value}|`);
				onChange(e.currentTarget.value);
				dispatch('blur', inputValue);
			}}
			on:change={(e) => {
				console.log('change:', `|${e.currentTarget.value}|`, e);
				onChange(e.currentTarget.value);
			}}
			on:input={(e) => {
				console.log('input:', `|${e.currentTarget.value}|`);
				onChange(e.currentTarget.value);
			}}
		/>
	</div>
	{#if error}
		<p class="hint error" in:fade={{ duration: 250 }}>{error}</p>
	{:else if hint}
		<p class="hint">{hint}</p>
	{/if}
</div>

<style>
	.textfield-container {
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
	.textfield {
		height: var(--button-height-large);
		display: flex;
		flex-direction: column;
		gap: 4px;
		position: relative;
	}
	.textfield:after {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: calc(100% - 2px);
		border: 1px solid var(--text-light-15);
		border-radius: var(--input-border-radius);
		pointer-events: none;
		transition: 180ms linear border-color;
	}
	.hasError .textfield:after {
		border-color: var(--error-text);
	}
	.hasError .textfield input {
		color: var(--error-text);
	}
	label {
		position: absolute;
		top: 50%;
		left: 24px;
		pointer-events: none;
		font-size: var(--16pt);
		transition: 180ms all var(--ease-in-out-cubic);
		transform: translate3d(0, -50%, 0);
		transform-origin: 0 50%;
		opacity: 0.3;
		color: var(--text-light);
		line-height: 1.5;
		z-index: 1;
	}
	.hasValue label {
		transform: translate3d(0, calc(-50% - 13px), 0) scale(0.875);
	}
	input {
		border: 0;
		height: 100%;
		position: relative;
		padding: 0 24px;
		background: transparent;
		color: var(--text-light);
		font-size: var(--16pt);
		line-height: var(--24pt);
		--bg: var(--bg-dark);
		--text: var(--text-highlight);
	}
	:global(body.bg-olive) input {
		--bg: var(--bg-olive);
	}
	:global(body.bg-rust) input {
		--bg: var(--bg-rust);
	}
	input:-webkit-autofill,
	input:-webkit-autofill:focus {
		box-shadow: 0 0 0 1000px var(--bg) inset;
		-webkit-text-fill-color: var(--text);
	}
	input:focus {
		outline: none;
	}
	input::selection {
		background-color: var(--text-light-15);
		color: var(--text-light);
	}

	.hasValue input {
		transform: translate(0, 7px);
	}
	.isFocused:not(.hasError) .textfield:after {
		border-color: var(--text-light);
	}
	.isFocused:not(.hasValue) label {
		opacity: 1;
		transform: translate(8px, -50%);
	}
</style>
