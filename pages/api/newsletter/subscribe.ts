import { NextApiRequest, NextApiResponse } from 'next';
import { sendNewsletterConfirmation } from '../../../lib/email';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = subscribeSchema.parse(req.body);

    // Store email in database (you need to create a NewsletterSubscriber model)
    // await prisma.newsletterSubscriber.create({ data: { email } });

    // Send confirmation email
    await sendNewsletterConfirmation(email);

    // Optionally notify admin
    // await sendEmail({ to: 'admin@example.com', subject: 'New Subscriber', html: `<p>${email} subscribed</p>` });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
}
