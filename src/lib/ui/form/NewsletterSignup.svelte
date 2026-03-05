<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Validator, { type ValidationError } from 'fastest-validator';
	import TextField from '../input/TextField.svelte';

	interface Props {
		title: string;
	}

	let { title }: Props = $props();
	const v = new Validator();
	const check = v.compile({
		email: { type: 'email', label: 'Email address' }
	});

	let email: string = $state('');
	let wasEmailTested = $state(false);
	let formResultMessage = $state('');
	let isSending = $state(false);

	let validation = $derived(check({ email }));
	let emailError = $derived(
		wasEmailTested &&
			validation !== true &&
			(validation as ValidationError[]).find((val) => val.field === 'email')
			? 'Invalid email address'
			: ''
	);
	let isValid = $derived(validation === true);

	function onEmailBlur(detail: string) {
		wasEmailTested = Boolean(detail.length);
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
			onBlur={onEmailBlur}
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
