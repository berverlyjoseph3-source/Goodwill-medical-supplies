import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail, sendContactAutoReply } from '../../../lib/email';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = contactSchema.parse(req.body);

    // Send notification to admin
    const adminEmail = 'goodwilldiagnosticltd60@gmail.com';
    const adminHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${body.name}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Subject:</strong> ${body.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${body.message.replace(/\n/g, '<br>')}</p>
    `;

    await sendEmail({
      to: adminEmail,
      subject: `Contact Form: ${body.subject}`,
      html: adminHtml,
      replyTo: body.email,
    });

    // Send auto-reply to customer
    await sendContactAutoReply(body.name, body.email);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
