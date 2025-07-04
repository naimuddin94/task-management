import status from 'http-status';
import nodemailer from 'nodemailer';
import config from '../config';
import AppError from './AppError';

const sendOtpEmail = async (email: string, otp: string, fullName: string) => {
  try {
    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.nodemailer.email,
        pass: config.nodemailer.password,
      },
    });

    // Email HTML template with dynamic placeholders
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Smart Brief OTP</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet" />
  </head>
  <body style="margin: 0; font-family: 'Poppins', sans-serif; background: #ffffff; font-size: 14px;">
    <div style="max-width: 680px; margin: 0 auto; padding: 45px 30px 60px; background: #f4f7ff; background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner); background-repeat: no-repeat; background-size: 800px 452px; background-position: top center; font-size: 14px; color: #434343;">
      <header>
        <table style="width: 100%;">
          <tbody>
            <tr>
              <td>
                <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3v1" />
                <path d="M12 20v1" />
                <path d="M3 12h1" />
                <path d="M20 12h1" />
                <path d="m18.364 5.636-.707.707" />
                <path d="m6.343 17.657-.707.707" />
                <path d="m5.636 5.636.707.707" />
                <path d="m17.657 17.657.707.707" />
                <path d="M12 8a4 4 0 0 1 0 8" />
              </svg>
              </td>
              <td style="text-align: right;">
                <span style="font-size: 16px; line-height: 30px; color: #ffffff;">${new Date().toLocaleDateString()}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      <main>
        <div style="margin-top: 70px; padding: 92px 30px 115px; background: #ffffff; border-radius: 30px; text-align: center;">
          <div style="max-width: 489px; margin: 0 auto;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1f1f1f;">One-Time Password (OTP)</h1>
            <p style="margin-top: 18px; font-size: 16px; font-weight: 500;">Hi ${fullName},</p>
            <p style="margin-top: 17px; font-weight: 500; letter-spacing: 0.5px;">
              You requested to verify your Smart Brief account. Use the following OTP to continue. This code is valid for <span style="font-weight: 600; color: #1f1f1f;">5 minutes</span>.
              Do not share this code with anyone—even Smart Brief staff.
            </p>
            <p style="margin-top: 60px; font-size: 40px; font-weight: 600; letter-spacing: 25px; color: #ba3d4f;">
              ${otp}
            </p>
          </div>
        </div>

        <p style="max-width: 400px; margin: 90px auto 0; text-align: center; font-weight: 500; color: #8c8c8c;">
          Need help? Contact us at
          <a href="mailto:support@smartbrief.com" style="color: #499fb6; text-decoration: none;">support@smartbrief.com</a>
          or visit our
          <a href="#" target="_blank" style="color: #499fb6; text-decoration: none;">Help Center</a>
        </p>
      </main>

      <footer style="max-width: 490px; margin: 30px auto 0; text-align: center; border-top: 1px solid #e6ebf1; padding-top: 30px;">
        <p style="margin: 0; font-size: 16px; font-weight: 600; color: #434343;">Smart Brief</p>
        <p style="margin: 8px 0; color: #434343;">123 Innovation Street, Tech City</p>
        <div style="margin-top: 16px;">
          <a href="#" target="_blank" style="display: inline-block;">
            <img width="32px" alt="Facebook" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook" />
          </a>
          <a href="#" target="_blank" style="display: inline-block; margin-left: 8px;">
            <img width="32px" alt="Instagram" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram" />
          </a>
          <a href="#" target="_blank" style="display: inline-block; margin-left: 8px;">
            <img width="32px" alt="Twitter" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter" />
          </a>
          <a href="#" target="_blank" style="display: inline-block; margin-left: 8px;">
            <img width="32px" alt="YouTube" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube" />
          </a>
        </div>
        <p style="margin-top: 18px; font-size: 12px; color: #888888;">© 2025 Smart Brief. All rights reserved.</p>
      </footer>
    </div>
  </body>
</html>
`;

    // <img src="cid:steady_hands_logo" alt="Steady Hands Logo">

    // Email options: from, to, subject, and HTML body
    const mailOptions = {
      from: config.nodemailer.email, // Sender's email address
      to: email, // Recipient's email address
      subject: 'Your OTP for Account Verification',
      html: htmlTemplate,
    };

    // Send the email using Nodemailer
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw new AppError(status.INTERNAL_SERVER_ERROR, 'Failed to send email');
  }
};

export default sendOtpEmail;
