module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/stockmaster',
  JWT_SECRET: process.env.JWT_SECRET || 'stockmaster_secret_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  OTP_EXPIRE: process.env.OTP_EXPIRE || '10m',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@stockmaster.com',
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};