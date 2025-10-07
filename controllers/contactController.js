

const sendEmail = require("../utils/googleTransporter");

const sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Admin Email
    const adminHtml = `
      <div style="background:#f6f8fb; padding:20px; font-family:sans-serif;">
        <h2>New Contact Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b> ${message}</p>
      </div>
    `;

    // User Confirmation Email
    const userHtml = `
      <div style="background:#f6f8fb; padding:20px; font-family:sans-serif;">
        <h2>Thank You, ${name}</h2>
        <p>We’ve received your message and our team will contact you soon.</p>
        <p><b>Your Message:</b> ${message}</p>
      </div>
    `;

    await sendEmail(process.env.ADMIN_EMAIL, `📥 New Contact Form Submission - ${name}`, adminHtml);
    await sendEmail(email, "✅ We’ve received your message — Globuz India", userHtml);

    res.status(200).json({ success: true, message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send message.", error: error.message });
  }
};

module.exports = { sendContactEmail };

