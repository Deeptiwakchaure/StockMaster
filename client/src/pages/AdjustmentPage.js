import React from 'react';
import TransactionList from '../components/inventory/TransactionList';
import AdjustmentForm from '../components/inventory/AdjustmentForm';

const AdjustmentPage = () => {
  return (
    <TransactionList 
      type="adjustment" 
      title="Adjustments" 
      FormComponent={AdjustmentForm} 
    />
  );
};

export default AdjustmentPage;