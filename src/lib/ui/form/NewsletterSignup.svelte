<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Validator, { type ValidationError } from 'fastest-validator';
	import TextField from '../input/TextField.svelte';

	export let title: string;
	const v = new Validator();
	const check = v.compile({
		email: { type: 'email', label: 'Email address' }
	});

	let email: string = '';
	let wasEmailTested = false;
	let formResultMessage = '';
	let isSending = false;

	$: validation = check({ email });
	$: emailError =
		wasEmailTested &&
		validation !== true &&
		(validation as ValidationError[]).find((val) => val.field === 'email')
			? 'Invalid email address'
			: '';
	$: isValid = validation === true;

	function onEmailBlur(e: { detail: string }) {
		wasEmailTested = Boolean(e.detail.length);
	}

	function onUseForm(): ReturnType<SubmitFunction> {
		isSending = true;
		return async ({ result, update }) => {
			if (result.type === 'success' && result.data) {
				formResultMessage = result.data.message;
			} else {
				console.log('update', update);
			}
			isSending = false;
		};
	}
</script>

<div class="sign-up-form">
	<h3 class="title" class:isComplete={formResultMessage !== ''}>
		{#if formResultMessage}{formResultMessage}{:else}{title}{/if}
	</h3>
	<form method="POST" action="/forms/newsletter" use:enhance={onUseForm}>
		<TextField
			name="email"
			type="email"
			label="Your email"
			id="email"
			error={emailError}
			bind:value={email}
			on:blur={onEmailBlur}
			readonly={formResultMessage != ''}
		/>
		<button
			class="ignore-disabled"
			type="submit"
			disabled={isSending || formResultMessage != '' || !isValid}
			>{isSending ? 'Subscribing...' : 'Sign Up'}</button
		>
	</form>
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
	.title {
		font-weight: bold;
	}
	.title.isComplete {
		color: var(--text-highlight);
	}
	:global(.bg-is-light) .title.isComplete {
		color: var(--text-color);
	}
</style>
