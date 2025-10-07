const transporter = require('../utils/googleTransporter');

/**
 * Send email with retries
 * @param {Object} mailOptions - nodemailer mail options
 * @param {number} retries - number of retry attempts
 */
const sendEmailWithRetry = async (mailOptions, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await transporter.sendMail(mailOptions);
    } catch (err) {
      console.warn(`Email attempt ${attempt} failed: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise(res => setTimeout(res, 2000)); // wait 2s before retry
    }
  }
};

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
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; color:#333;">
          <div style="background:#0d6efd; color:white; padding:20px; text-align:center; border-radius:8px 8px 0 0;">
            <h2>New Contact Request</h2>
          </div>
          <div style="padding:20px; background:#f7f7f7; border-radius:0 0 8px 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong></p>
            <div style="background:white; padding:15px; border-radius:5px; border:1px solid #ddd;">
              ${message}
            </div>
          </div>
        </div>
      `,
      headers: { 'Content-Type': 'text/html; charset=UTF-8' },
    };

    await sendEmailWithRetry(adminMailOptions, 3);

    // ================= User Confirmation Email =================
    const subject = '✔ We’ve received your message — Globuz India';
    const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`;

    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: encodedSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e0e0e0; border-radius:10px; overflow:hidden;">
          <div style="background-color:#0d6efd; color:white; text-align:center; padding:25px;">
            <h2 style="margin:0;">Thank You, ${name}!</h2>
            <p style="margin:5px 0 0;">We’ve received your message</p>
          </div>
          <div style="padding:25px; background-color:#f9f9f9;">
            <p style="font-size:16px; line-height:1.6;">Our team will contact you shortly.</p>
            <h3 style="color:#0d6efd; margin-top:20px;">Your Message:</h3>
            <div style="background:white; padding:15px; border-radius:5px; border:1px solid #ddd; font-size:14px; line-height:1.5;">
              ${message}
            </div>
            <p style="margin-top:20px; font-size:15px;">
              For further questions, reply to this email or contact us at 
              <a href="mailto:contact@Globuzindia.in" style="color:#0d6efd;">contact@Globuzindia.in</a>.
            </p>
          </div>
          <div style="background-color:#f0f0f0; padding:15px; text-align:center; font-size:12px; color:#555;">
            &copy; ${new Date().getFullYear()} Globuz India. All rights reserved.
          </div>
        </div>
      `,
      headers: { 'Content-Type': 'text/html; charset=UTF-8' },
    };

    try {
      await sendEmailWithRetry(userMailOptions, 3);
    } catch (userEmailError) {
      console.warn('User confirmation email failed after retries:', userEmailError.message);
    }

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Admin email send failed:', error.message);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
};
