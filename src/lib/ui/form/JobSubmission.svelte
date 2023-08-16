<script lang="ts">
	import Validator, { type ValidationError } from 'fastest-validator';
	import TextField from '../input/TextField.svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import TextArea from '../input/TextArea.svelte';

	export let mode: 'long' | 'short' = 'short';

	const v = new Validator();
	const check = v.compile({
		email: { type: 'email', normalize: true, label: 'Email address' },
		name: { type: 'string', label: 'Your name', min: 1, trim: true },
		message: { type: 'string', label: 'Message', empty: true, trim: true, min: 10, max: 5000 }
	});

	let email: string = '';
	let name: string = '';
	let message: string = '';
	let portfolio: string = '';
	let phone: string = '';
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
			if (result.type === 'success' && result.data) {
				formResultMessage = result.data.message;
			} else {
				console.log('update', update);
			}
		};
	}
</script>

<div class="contact-form {mode}">
	{#if formResultMessage}
		<h3 class="title" class:isComplete={true}>
			{formResultMessage}
		</h3>
	{:else}
		{#if mode === 'short'}
			<h3 class="title">Get In Touch</h3>
		{/if}
		<form method="POST" action="/forms/contact" use:enhance={onUseForm}>
			<div class="message">
				<TextArea
					name="message"
					label="Tell us about yourself"
					id="message"
					bind:value={message}
					error={messageError}
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
					bind:value={name}
					on:blur={onNameBlur}
				/>
				<TextField
					name="email"
					type="email"
					label="Your email"
					id="email"
					error={emailError}
					bind:value={email}
					on:blur={onEmailBlur}
				/>
			</div>
			{#if mode === 'long'}
				<div class="phone-portfolio">
					<TextField name="phone" type="text" label="Phone number" id="phone" bind:value={phone} />
					<TextField
						name="portfolio"
						type="text"
						label="LinkedIn or portfolio site"
						id="portfolio"
						bind:value={portfolio}
					/>
				</div>
			{/if}
			<button type="submit" disabled={formResultMessage != '' || !isValid}>Send</button>
		</form>
	{/if}
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
	}
	.short form {
		gap: 24px;
	}
	.long form {
		gap: 16px;
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
		}
		.short form {
			grid-template-areas: 'message message' 'name-email submit';
		}
		.long form {
			grid-template-areas:
				'message'
				'name-email'
				'phone-portfolio'
				'submit';
		}
		.message {
			grid-area: message;
		}
		.email {
			grid-area: email;
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
		.phone-portfolio {
			display: flex;
			grid-area: phone-portfolio;
			gap: 16px;
		}
		.long :global(.textfield-container) {
			width: 100%;
			max-width: 100%;
		}
		.short .name-email :global(.textfield-container),
		.short .phone-portfolio :global(.textfield-container) {
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
