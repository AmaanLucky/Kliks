const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = {
  sendMail: async ({ from, to, subject, html }) => {
    const { data, error } = await resend.emails.send({ from, to, subject, html });
    if (error) throw new Error(error.message);
    return data;
  },
};
