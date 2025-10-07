const transporter = require('../utils/googleTransporter');
const nodemailer = require('nodemailer');

exports.sendContactEmail = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // ================= Admin Email =================
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Us Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
          <div style="background: #0d6efd; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1>New Contact Request</h1>
          </div>
          <div style="padding: 20px; background: #f7f7f7; border-radius: 0 0 8px 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
              ${message}
            </div>
          </div>
        </div>
      `,
      headers: { 'Content-Type': 'text/html; charset=UTF-8' }
    };

    await transporter.sendMail(adminMailOptions);

    // ================= User Confirmation Email =================
    const subject = '✔ We’ve received your message — Globuz India';
    const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`;

    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: encodedSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
          <!-- Header -->
          <div style="background-color: #0d6efd; color: white; text-align: center; padding: 25px;">
            <h1 style="margin:0; font-size: 24px;">Thank You, ${name}!</h1>
            <p style="margin: 5px 0 0;">Your message has been received</p>
          </div>

          <!-- Body -->
          <div style="padding: 25px; background-color: #f9f9f9;">
            <p style="font-size: 16px; line-height: 1.6;">
              We’ve received your message and our team will contact you shortly.
            </p>

            <h3 style="color: #0d6efd; margin-top: 20px;">Your Submitted Message:</h3>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; border: 1px solid #ddd; font-size: 14px; line-height: 1.5;">
              ${message}
            </div>

            <p style="margin-top: 20px; font-size: 15px;">
              If you have any further questions, you can reply to this email or contact us at 
              <a href="mailto:contact@Globuzindia.in" style="color: #0d6efd;">contact@Globuzindia.in</a>.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #555;">
            &copy; ${new Date().getFullYear()} Globuz India. All rights reserved.
          </div>
        </div>
      `,
      headers: { 'Content-Type': 'text/html; charset=UTF-8' }
    };

    await transporter.sendMail(userMailOptions);

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};
