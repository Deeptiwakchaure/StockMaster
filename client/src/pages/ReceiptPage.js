import React from 'react';
import TransactionList from '../components/inventory/TransactionList';
import ReceiptForm from '../components/inventory/ReceiptForm';

const ReceiptPage = () => {
  return (
    <TransactionList 
      type="receipt" 
      title="Receipts" 
      FormComponent={ReceiptForm} 
    />
  );
};

export default ReceiptPage;