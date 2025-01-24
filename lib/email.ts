import nodemailer from 'nodemailer';

type EmailData = {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: string;
    encoding: string;
  }>;
};

export async function sendEmail(data: EmailData) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.to,
    subject: data.subject,
    html: data.html,
    attachments: data.attachments
  };

  return await transporter.sendMail(mailOptions);
} 