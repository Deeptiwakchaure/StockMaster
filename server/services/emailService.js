const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create reusable transporter object using the default SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    service: config.EMAIL_SERVICE,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });
};

// Send OTP email
exports.sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: email,
      subject: 'StockMaster Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`,
      html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};