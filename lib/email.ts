import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, from = 'Goodwill Medical <noreply@goodwillmedical.com>', replyTo }: EmailOptions) {
  try {
    const data = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
}

// Order confirmation email
export async function sendOrderConfirmation(order: any, userEmail: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0070f3; color: white; padding: 20px; text-align: center; }
          .order-details { background: #f4f4f4; padding: 20px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          .total { font-size: 1.2em; font-weight: bold; text-align: right; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Order!</h1>
            <p>Order #${order.orderNumber}</p>
          </div>
          <p>Dear ${order.user?.name || 'Customer'},</p>
          <p>We're pleased to confirm your order. Below are the details:</p>
          
          <div class="order-details">
            <h3>Order Summary</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map((item: any) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">
              Total: $${order.total}
            </div>
          </div>
          
          <p>We'll notify you when your order ships. You can track your order at any time:</p>
          <p><a href="${process.env.NEXTAUTH_URL}/order/tracking/${order.orderNumber}">Track your order</a></p>
          
          <div class="footer">
            <p>Goodwill Medical Supplies<br>Bombo Rd, Kampala, Uganda<br>
            <a href="mailto:goodwilldiagnosticltd60@gmail.com">goodwilldiagnosticltd60@gmail.com</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `Order Confirmation #${order.orderNumber}`,
    html,
    replyTo: 'support@goodwillmedical.com',
  });
}

// Password reset email
export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 500px; margin: 0 auto; padding: 20px; }
          .header { background: #0070f3; color: white; padding: 20px; text-align: center; }
          .button { display: inline-block; padding: 12px 24px; background: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <p>Hi,</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          <p>If you didn't request this, you can safely ignore this email. The link expires in 1 hour.</p>
          <hr>
          <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
          <div class="footer">
            <p>Goodwill Medical Supplies</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset Your Password',
    html,
  });
}

// Contact form auto-reply
export async function sendContactAutoReply(name: string, email: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>We Received Your Message</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 500px; margin: 0 auto; padding: 20px; }
          .header { background: #0070f3; color: white; padding: 20px; text-align: center; }
          .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Contacting Us</h1>
          </div>
          <p>Dear ${name},</p>
          <p>We've received your message and will get back to you within 24 hours.</p>
          <p>If you need immediate assistance, please call us at +256 703 494876.</p>
          <div class="footer">
            <p>Goodwill Medical Supplies<br>Bombo Rd, Kampala, Uganda</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Thank You for Contacting Goodwill Medical Supplies',
    html,
    replyTo: 'support@goodwillmedical.com',
  });
}

// Newsletter subscription confirmation
export async function sendNewsletterConfirmation(email: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Newsletter Subscription Confirmed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 500px; margin: 0 auto; padding: 20px; }
          .header { background: #0070f3; color: white; padding: 20px; text-align: center; }
          .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>You're Subscribed!</h1>
          </div>
          <p>Thank you for subscribing to Goodwill Medical Supplies newsletter.</p>
          <p>You'll receive updates on new products, healthcare tips, and exclusive offers.</p>
          <p>You can unsubscribe at any time using the link at the bottom of our emails.</p>
          <div class="footer">
            <p>Goodwill Medical Supplies</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Newsletter Subscription Confirmed',
    html,
  });
}
