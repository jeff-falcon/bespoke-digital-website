import { sendMail } from '$lib/mail.js';
import sanitizeHtml from 'sanitize-html'

export const actions = {
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
      return { error: `You are missing some required fields.` }
    } else {
      const options: sanitizeHtml.IOptions = { allowedTags: [], allowedAttributes: {} }
      email = sanitizeHtml(email, options)
      name = sanitizeHtml(name, options)
      message = sanitizeHtml(message, options)
      const fields: { [key: string]: string } = {}
      if (company) {
        fields.company = sanitizeHtml(company.toString(), options);
      }
      if (phone) {
        fields.phone = sanitizeHtml(phone.toString(), options);
      }
      if (portfolio) {
        fields.portfolio = sanitizeHtml(portfolio.toString(), options);
      }
      await sendMail(email, name, message, fields, type === 'job' ? `${name} would like to join our team` : 'New Project Inquiry');
      return { message: `Thanks for reaching out! We'll get back to you.` }
    }
  }
};
