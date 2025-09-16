import { sendMail, sendMailFromMailchimp } from '$lib/mail.js';
import sanitizeHtml from 'sanitize-html';
import { type Actions, fail } from '@sveltejs/kit';
import { SEND_CONTACT_EMAIL_WITH_MAILCHIMP } from '$env/static/private';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		let email = data.get('email')?.toString();
		let name = data.get('name')?.toString();
		let message = data.get('message')?.toString();
		const company = data.get('company');
		const portfolio = data.get('portfolio');
		const phone = data.get('phone');
		const type = data.get('type')?.toString();
		console.log('contact', { name, email, message });
		if (!email || !name || !message) {
			return { error: `You are missing some required fields.` };
		} else {
			const options: sanitizeHtml.IOptions = { allowedTags: [], allowedAttributes: {} };
			email = sanitizeHtml(email, options);
			name = sanitizeHtml(name, options);
			message = sanitizeHtml(message, options);
			const fields: { [key: string]: string } = {};
			if (company) {
				fields.company = sanitizeHtml(company.toString(), options);
			}
			if (phone) {
				fields.phone = sanitizeHtml(phone.toString(), options);
			}
			if (portfolio) {
				fields.portfolio = sanitizeHtml(portfolio.toString(), options);
			}

			if (SEND_CONTACT_EMAIL_WITH_MAILCHIMP === 'true') {
				try {
					await sendMailFromMailchimp(
						email,
						name,
						message,
						fields,
						type === 'job' ? `${name} would like to join our team` : 'New Project Inquiry'
					);

					return { message: `Thanks for reaching out! We'll get back to you.` };
				} catch (err) {
					console.log('error sending mailchimp', err);
					return fail(500, { error: 'Something went wrong. Reason:' + err?.toString() });
				}
			} else {
				try {
					const result = await sendMail(
						email,
						name,
						message,
						fields,
						type === 'job' ? `${name} would like to join our team` : 'New Project Inquiry'
					);
					if (result[0].status === 'fulfilled' && result[1].status === 'fulfilled') {
						return { message: `Thanks for reaching out! We'll get back to you.` };
					} else if (result[0].status === 'fulfilled') {
						return fail(400, { error: 'A receipt could not be sent to you.' });
					} else {
						return fail(400, {
							error: 'The contact form submission failed. Reason: ' + result[0].reason.toString()
						});
					}
				} catch (error) {
					console.log('error sending mail', error);
					return fail(500, { error: 'Something went wrong' });
				}
			}
		}
	}
};
