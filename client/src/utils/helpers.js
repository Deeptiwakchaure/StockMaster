// Format date
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format date and time
export const formatDateTime = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Get status color
export const getStatusColor = (status) => {
  switch (status) {
    case 'done':
      return 'success';
    case 'ready':
      return 'primary';
    case 'waiting':
      return 'warning';
    case 'draft':
      return 'info';
    case 'canceled':
      return 'error';
    default:
      return 'default';
  }
};

// Get transaction type label
export const getTransactionTypeLabel = (type) => {
  switch (type) {
    case 'receipt':
      return 'Receipt';
    case 'delivery':
      return 'Delivery';
    case 'transfer':
      return 'Transfer';
    case 'adjustment':
      return 'Adjustment';
    default:
      return type;
  }
};

// Get transaction type icon
export const getTransactionTypeIcon = (type) => {
  const Storage = require('@material-ui/icons/Storage').default;
  const LocalShipping = require('@material-ui/icons/LocalShipping').default;
  const SwapHoriz = require('@material-ui/icons/SwapHoriz').default;
  const Tune = require('@material-ui/icons/Tune').default;
  const Receipt = require('@material-ui/icons/Receipt').default;
  
  switch (type) {
    case 'receipt':
      return Storage;
    case 'delivery':
      return LocalShipping;
    case 'transfer':
      return SwapHoriz;
    case 'adjustment':
      return Tune;
    default:
      return Receipt;
  }
};