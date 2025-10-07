const createTransporter = require('../utils/googleTransporter');
require('dotenv').config();

exports.sendContactEmail = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const transporter = await createTransporter();

    // Admin Email
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Us Submission from ${name}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <div style="border:1px solid #ddd; padding:10px;">${message}</div>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    // User Confirmation Email
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✔ We’ve received your message — Globuz India',
      html: `
        <h2>Thank You, ${name}!</h2>
        <p>Your message has been received. Our team will contact you shortly.</p>
        <h3>Your Submitted Message:</h3>
        <div style="border:1px solid #ddd; padding:10px;">${message}</div>
        <p>For further questions, reply to this email or contact us at 
        <a href="mailto:contact@Globuzindia.in">contact@Globuzindia.in</a>.</p>
      `,
    };

    try {
      await transporter.sendMail(userMailOptions);
    } catch (err) {
      console.warn('User email failed:', err.message);
    }

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Admin email failed:', error.message);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
};
