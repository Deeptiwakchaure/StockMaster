const crypto = require('crypto');
const config = require('../config/config');

// Generate OTP
exports.generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Generate OTP expiration time
exports.getOTPExpiration = () => {
  return new Date(Date.now() + config.OTP_EXPIRE);
};