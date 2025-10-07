const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  EMAIL_USER,
} = process.env;

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

async function createTransporter() {
  const accessToken = await oAuth2Client.getAccessToken();
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: EMAIL_USER,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken: GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
}

module.exports = createTransporter;
