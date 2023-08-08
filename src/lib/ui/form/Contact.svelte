<script lang="ts">
	import Validator, { type ValidationError } from 'fastest-validator';
	import TextField from '../input/TextField.svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import TextArea from '../input/TextArea.svelte';

	const v = new Validator();
	const check = v.compile({
		email: { type: 'email', normalize: true, label: 'Email address' },
		name: { type: 'string', label: 'Your name', min: 1, trim: true },
		message: { type: 'string', label: 'Message', empty: true, trim: true, min: 10, max: 5000 }
	});

	let email: string = '';
	let name: string = '';
	let message: string = '';
	let disabled = true;
	let wasEmailTested = false;
	let wasNameTested = false;
	let wasMessageTested = false;
	let formResultMessage = '';

	$: validation = check({ email, name, message });
	$: emailError =
		wasEmailTested &&
		validation !== true &&
		(validation as ValidationError[]).find((val) => val.field === 'email')
			? 'Invalid email address'
			: '';
	$: nameError =
		wasNameTested &&
		validation !== true &&
		(validation as ValidationError[]).find((val) => val.field === 'name')
			? 'Name is required'
			: '';
	$: messageError =
		wasMessageTested && validation !== true
			? (validation as ValidationError[]).find((val) => val.field === 'message')?.message ?? ''
			: '';
	$: isValid = validation === true;

	function onEmailBlur(e: { detail: string }) {
		wasEmailTested = Boolean(e.detail.length);
	}
	function onNameBlur(e: { detail: string }) {
		wasNameTested = Boolean(e.detail.length);
	}
	function onMessageBlur(e: { detail: string }) {
		wasMessageTested = Boolean(e.detail.length);
	}

	function onUseForm(): ReturnType<SubmitFunction> {
		return async ({ result, update }) => {
			if (result.status === 200) {
				formResultMessage = result.data.message;
			} else {
				console.log('update', update);
			}
		};
	}
</script>

<div class="contact-form">
	<h3 class="title" class:isComplete={formResultMessage !== ''}>
		{#if formResultMessage}{formResultMessage}{:else}
			Get In Touch{/if}
	</h3>
	<form method="POST" action="/forms/contact" use:enhance={onUseForm}>
		<div class="message">
			<TextArea
				name="message"
				label="Tell us about your project"
				id="message"
				bind:value={message}
				error={messageError}
				readonly={formResultMessage !== ''}
				on:blur={onMessageBlur}
			/>
		</div>
		<div class="name-email">
			<TextField
				name="name"
				type="text"
				label="Your name"
				id="name"
				error={nameError}
				readonly={formResultMessage !== ''}
				bind:value={name}
				on:blur={onNameBlur}
			/>
			<TextField
				name="email"
				type="email"
				label="Your email"
				id="email"
				error={emailError}
				readonly={formResultMessage !== ''}
				bind:value={email}
				on:blur={onEmailBlur}
			/>
		</div>
		<button type="submit" disabled={formResultMessage != '' || !isValid}>Send</button>
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
	@media (min-width: 768px) {
		form {
			display: grid;
			grid-template-areas: 'message message' 'name-email submit';
		}
		.message {
			grid-area: message;
		}
		.message :global(.textarea-container),
		.message :global(.textarea) {
			min-height: 80px;
		}
		.name-email {
			display: flex;
			grid-area: name-email;
			gap: 16px;
		}
		.name-email :global(.textfield-container) {
			width: 100%;
			max-width: 248px;
		}
		button {
			grid-area: submit;
			width: max-content;
			padding-left: 40px;
			padding-right: 40px;
			justify-self: end;
		}
	}
</style>
