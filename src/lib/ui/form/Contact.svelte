<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Validator, { type ValidationError } from 'fastest-validator';
	import TextArea from '../input/TextArea.svelte';
	import TextField from '../input/TextField.svelte';

	interface Props {
		mode?: 'long' | 'short';
	}

	let { mode = 'short' }: Props = $props();

	const v = new Validator();
	const check = v.compile({
		email: { type: 'email', normalize: true, label: 'Email address' },
		name: { type: 'string', label: 'Your name', min: 1, trim: true },
		message: { type: 'string', label: 'Message', trim: true, min: 10, max: 5000 }
	});

	let email: string = $state('');
	let name: string = $state('');
	let message: string = $state('');
	let company: string = $state('');
	let phone: string = $state('');
	let isSending = $state(false);
	let wasEmailTested = $state(false);
	let wasNameTested = $state(false);
	let wasMessageTested = $state(false);
	let formResultMessage = $state('');
	let formSubmissionError = $state('');

	let validation = $derived(check({ email, name, message }));
	let emailError = $derived(
		wasEmailTested &&
			validation !== true &&
			(validation as ValidationError[]).find((val) => val.field === 'email')
			? 'Invalid email address'
			: ''
	);
	let nameError = $derived(
		wasNameTested &&
			validation !== true &&
			(validation as ValidationError[]).find((val) => val.field === 'name')
			? 'Name is required'
			: ''
	);
	let messageError = $derived(
		wasMessageTested && validation !== true
			? ((validation as ValidationError[]).find((val) => val.field === 'message')?.message ?? '')
			: ''
	);
	let isValid = $derived(validation === true);

	function onEmailBlur(detail: string) {
		if (email.length) {
			wasEmailTested = true;
		}
	}
	function onNameBlur(detail: string) {
		if (name.length) {
			wasNameTested = true;
		}
	}
	function onMessageBlur(detail: string) {
		if (message.length) {
			wasMessageTested = true;
		}
	}

	function onUseForm(): ReturnType<SubmitFunction> {
		isSending = true;
		return async ({ result, update }) => {
			if (result.type === 'success' && result.data) {
				formResultMessage = result.data.message;
			} else if (result.type === 'failure' && result.data) {
				console.log('update', update);
				formSubmissionError =
					result.data?.error || 'There was an error submitting the form, please try again later.';
			}
			isSending = false;
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
			<input type="hidden" name="type" value="contact" />
			<div class="message">
				<TextArea
					name="message"
					label="Tell us about your project"
					id="message"
					bind:value={message}
					error={messageError}
					onBlur={onMessageBlur}
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
					onBlur={onNameBlur}
				/>
				<TextField
					name="email"
					type="email"
					label="Your email"
					id="email"
					error={emailError}
					bind:value={email}
					onBlur={onEmailBlur}
				/>
			</div>
			{#if mode === 'long'}
				<div class="company-phone">
					<TextField
						name="company"
						type="text"
						label="Your company"
						id="company"
						bind:value={company}
					/>
					<TextField name="phone" type="text" label="Your phone" id="phone" bind:value={phone} />
				</div>
			{/if}
			<button type="submit" disabled={isSending || formResultMessage != '' || !isValid}
				>{isSending ? 'Sending...' : 'Send'}</button
			>
			{#if formSubmissionError}
				<p class="submit-error">{formSubmissionError}</p>
			{/if}
		</form>
	{/if}
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.title {
		font-weight: normal;
	}
	.title.isComplete {
		color: var(--text-highlight);
	}
	:global(.bg-is-light) .title.isComplete {
		color: var(--text-color);
	}
	.name-email {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.company-phone {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.submit-error {
		color: var(--text-highlight);
	}
	button {
		margin-top: 8px;
	}
	@media (min-width: 720px) {
		form {
			display: grid;
		}
		.short form {
			grid-template-areas: 'message message' 'name-email submit';
		}
		.short button {
			margin-top: 0;
		}
		.long form {
			grid-template-areas:
				'message'
				'name-email'
				'company-phone'
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
			flex-direction: row;
			grid-area: name-email;
		}
		.company-phone {
			flex-direction: row;
			grid-area: company-phone;
		}
		.long :global(.textfield-container) {
			width: 100%;
			max-width: 100%;
		}
		.short .name-email :global(.textfield-container),
		.short .company-phone :global(.textfield-container) {
			width: 100%;
			max-width: 248px;
		}
		.short button {
			grid-area: submit;
			width: max-content;
			padding-left: 40px;
			padding-right: 40px;
			justify-self: end;
		}
	}
</style>
