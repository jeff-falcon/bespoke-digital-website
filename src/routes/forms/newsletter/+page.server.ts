export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');
    console.log('email', email);
    return { message: `Thanks for signing up!` }
  }
};
