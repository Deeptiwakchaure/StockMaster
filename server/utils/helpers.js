// Generate reference number
exports.generateReference = (prefix) => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 5);
  return `${prefix}-${timestamp}-${randomStr}`.toUpperCase();
};

// Format date
exports.formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};