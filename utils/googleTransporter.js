const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  pool: true,                 // enable connection pooling
  maxConnections: 5,          // max concurrent connections
  maxMessages: 100,           // max messages per connection
  rateLimit: true,            // enforce rate limit
  tls: {
    rejectUnauthorized: false, // allow self-signed certs if needed
  },
  connectionTimeout: 10000,    // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Mailer verification failed:', error);
  } else {
    console.log('Mailer is ready to send messages');
  }
});

module.exports = transporter;
