import React from 'react';
import TransactionList from '../components/inventory/TransactionList';
import TransferForm from '../components/inventory/TransferForm';

const TransferPage = () => {
  return (
    <TransactionList 
      type="transfer" 
      title="Transfers" 
      FormComponent={TransferForm} 
    />
  );
};

export default TransferPage;