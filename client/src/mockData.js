export const mockCategories = [
  { _id: '1', name: 'Raw Materials', description: 'Raw materials for production' },
  { _id: '2', name: 'Finished Goods', description: 'Ready to ship products' },
  { _id: '3', name: 'Components', description: 'Parts and components' },
];

export const mockWarehouses = [
  { _id: '1', name: 'Main Warehouse', location: 'New York', capacity: 10000, type: 'storage' },
  { _id: '2', name: 'Production Floor', location: 'New York - Building B', capacity: 5000, type: 'production' },
  { _id: '3', name: 'Warehouse 2', location: 'Los Angeles', capacity: 8000, type: 'storage' },
];

export const mockProducts = [
  { _id: '1', name: 'Steel Rods', sku: 'STL001', category: mockCategories[0], unitOfMeasure: 'kg', reorderLevel: 50, maxStock: 500, description: 'Steel rods for production', stock: 100 },
  { _id: '2', name: 'Office Chair', sku: 'CHR001', category: mockCategories[1], unitOfMeasure: 'pcs', reorderLevel: 10, maxStock: 100, description: 'Ergonomic office chair', stock: 25 },
  { _id: '3', name: 'Bolts', sku: 'BLT001', category: mockCategories[2], unitOfMeasure: 'pcs', reorderLevel: 100, maxStock: 1000, description: 'M8 Bolts', stock: 150 },
  { _id: '4', name: 'Steel Frames', sku: 'FRM001', category: mockCategories[1], unitOfMeasure: 'pcs', reorderLevel: 5, maxStock: 50, description: 'Chair frames', stock: 8 },
];

export const mockTransactions = [];

export const mockDashboardData = {
  totalProducts: mockProducts.length,
  lowStockProducts: mockProducts.filter(p => p.stock <= p.reorderLevel).length,
  outOfStockProducts: mockProducts.filter(p => p.stock === 0).length,
  pendingReceipts: 0,
  pendingDeliveries: 0,
  scheduledTransfers: 0,
  recentTransactions: [],
};
