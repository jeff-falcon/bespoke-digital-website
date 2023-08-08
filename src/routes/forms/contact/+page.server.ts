export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const name = data.get('name');
    const message = data.get('message');
    console.log('contact', { name, email, message });
    return { message: `Thanks for reaching out! We'll get back to you.` }
  }
};
