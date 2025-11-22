import React from 'react';
import TransactionList from '../components/inventory/TransactionList';
import DeliveryForm from '../components/inventory/DeliveryForm';

const DeliveryPage = () => {
  return (
    <TransactionList 
      type="delivery" 
      title="Deliveries" 
      FormComponent={DeliveryForm} 
    />
  );
};

export default DeliveryPage;