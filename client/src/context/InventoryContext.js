import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { mockDashboardData, mockProducts, mockCategories, mockWarehouses } from '../mockData';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState(mockProducts);
  const [categories, setCategories] = useState(mockCategories);
  const [warehouses, setWarehouses] = useState(mockWarehouses);
  const [transactions, setTransactions] = useState([]);
  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Already loaded from mock data
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      // Already loaded from mock data
      setError(null);
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  // Fetch warehouses
  const fetchWarehouses = async () => {
    try {
      // Already loaded from mock data
      setError(null);
    } catch (err) {
      setError('Failed to fetch warehouses');
    }
  };

  // Fetch transactions
  const fetchTransactions = async (filters = {}) => {
    setLoading(true);
    try {
      // Filter local transactions
      let filtered = transactions;
      if (filters.type) {
        filtered = filtered.filter(t => t.type === filters.type);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const updatedDashboard = {
        totalProducts: products.length,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        pendingReceipts: transactions.filter(t => t.type === 'receipt' && t.status === 'waiting').length,
        pendingDeliveries: transactions.filter(t => t.type === 'delivery' && t.status === 'waiting').length,
        scheduledTransfers: transactions.filter(t => t.type === 'transfer' && t.status === 'waiting').length,
        recentTransactions: transactions.slice(0, 10),
      };
      setDashboardData(updatedDashboard);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Create product
  const createProduct = async (productData) => {
    setLoading(true);
    try {
      const newProduct = {
        _id: Date.now().toString(),
        ...productData,
        category: categories.find(c => c._id === productData.category),
        stock: productData.initialStock || 0,
      };
      setProducts([...products, newProduct]);
      setError(null);
      return { success: true };
    } catch (err) {
      setError('Failed to create product');
      return { success: false, message: 'Failed to create product' };
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const updateProduct = async (id, productData) => {
    setLoading(true);
    try {
      const updatedProduct = {
        ...products.find(p => p._id === id),
        ...productData,
        category: categories.find(c => c._id === productData.category),
      };
      setProducts(products.map((product) => product._id === id ? updatedProduct : product));
      setError(null);
      return { success: true };
    } catch (err) {
      setError('Failed to update product');
      return { success: false, message: 'Failed to update product' };
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      setProducts(products.filter((product) => product._id !== id));
      setError(null);
      return { success: true };
    } catch (err) {
      setError('Failed to delete product');
      return { success: false, message: 'Failed to delete product' };
    } finally {
      setLoading(false);
    }
  };

  // Create category
  const createCategory = async (categoryData) => {
    setLoading(true);
    try {
      const newCategory = { _id: Date.now().toString(), ...categoryData };
      setCategories([...categories, newCategory]);
      setError(null);
      return { success: true };
    } catch (err) {
      setError('Failed to create category');
      return { success: false, message: 'Failed to create category' };
    } finally {
      setLoading(false);
    }
  };

  // Create warehouse
  const createWarehouse = async (warehouseData) => {
    setLoading(true);
    try {
      const newWarehouse = { _id: Date.now().toString(), ...warehouseData };
      setWarehouses([...warehouses, newWarehouse]);
      setError(null);
      return { success: true };
    } catch (err) {
      setError('Failed to create warehouse');
      return { success: false, message: 'Failed to create warehouse' };
    } finally {
      setLoading(false);
    }
  };

  // Create receipt
  const createReceipt = async (receiptData) => {
    setLoading(true);
    try {
      const product = products.find(p => p._id === receiptData.product);
      const newReceipt = {
        _id: Date.now().toString(),
        type: 'receipt',
        ...receiptData,
        product,
        warehouse: warehouses.find(w => w._id === receiptData.warehouse),
        status: 'waiting',
        createdAt: new Date().toISOString(),
      };
      // Update product stock
      setProducts(products.map(p => 
        p._id === receiptData.product 
          ? { ...p, stock: (p.stock || 0) + parseInt(receiptData.quantity) }
          : p
      ));
      setTransactions([newReceipt, ...transactions]);
      setError(null);
      return { success: true };
    } catch (err) {
      setError('Failed to create receipt');
      return { success: false, message: 'Failed to create receipt' };
    } finally {
      setLoading(false);
    }
  };

  // Create delivery
  const createDelivery = async (deliveryData) => {
    setLoading(true);
    try {
      const product = products.find(p => p._id === deliveryData.product);
      const newDelivery = {
        _id: Date.now().toString(),
        type: 'delivery',
        ...deliveryData,
        product,
        warehouse: warehouses.find(w => w._id === deliveryData.warehouse),
        status: 'waiting',
        createdAt: new Date().toISOString(),
      };
      // Update product stock
      setProducts(products.map(p => 
        p._id === deliveryData.product 
          ? { ...p, stock: (p.stock || 0) - parseInt(deliveryData.quantity) }
          : p
      ));
      setTransactions([newDelivery, ...transactions]);
      setError(null);
      return { success: true };
    } catch (err) {
      setError('Failed to create delivery');
      return { success: false, message: 'Failed to create delivery' };
    } finally {
      setLoading(false);
    }
  };

  // Create transfer
  const createTransfer = async (transferData) => {
    setLoading(true);
    try {
      const newTransfer = {
        _id: Date.now().toString(),
        type: 'transfer',
        ...transferData,
        product: products.find(p => p._id === transferData.product),
        fromWarehouse: warehouses.find(w => w._id === transferData.fromWarehouse),
        toWarehouse: warehouses.find(w => w._id === transferData.toWarehouse),
        status: 'waiting',
        createdAt: new Date().toISOString(),
      };
      setTransactions([newTransfer, ...transactions]);
      setError(null);
      return { success: true };
    } catch (err) {
      setError('Failed to create transfer');
      return { success: false, message: 'Failed to create transfer' };
    } finally {
      setLoading(false);
    }
  };

  // Create adjustment
  const createAdjustment = async (adjustmentData) => {
    setLoading(true);
    try {
      const product = products.find(p => p._id === adjustmentData.product);
      const currentStock = product.stock || 0;
      const countedQty = parseInt(adjustmentData.quantity);
      const difference = countedQty - currentStock;
      
      const newAdjustment = {
        _id: Date.now().toString(),
        type: 'adjustment',
        ...adjustmentData,
        product,
        warehouse: warehouses.find(w => w._id === adjustmentData.warehouse),
        difference,
        status: 'done',
        createdAt: new Date().toISOString(),
      };
      // Update product stock to counted quantity
      setProducts(products.map(p => 
        p._id === adjustmentData.product 
          ? { ...p, stock: countedQty }
          : p
      ));
      setTransactions([newAdjustment, ...transactions]);
      setError(null);
      return { success: true };
    } catch (err) {
      setError('Failed to create adjustment');
      return { success: false, message: 'Failed to create adjustment' };
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    // Skip initialization on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        products,
        categories,
        warehouses,
        transactions,
        dashboardData,
        loading,
        error,
        fetchProducts,
        fetchCategories,
        fetchWarehouses,
        fetchTransactions,
        fetchDashboardData,
        createProduct,
        updateProduct,
        deleteProduct,
        createCategory,
        createWarehouse,
        createReceipt,
        createDelivery,
        createTransfer,
        createAdjustment,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};