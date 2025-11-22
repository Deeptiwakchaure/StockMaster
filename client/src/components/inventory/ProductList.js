import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TextField,
  Box,
  Typography,
  Chip,
} from '@material-ui/core';
import {
  Add,
  Edit,
  Delete,
  Search,
} from '@material-ui/icons';
import { useInventory } from '../../context/InventoryContext';
import ProductForm from './ProductForm';

const ProductList = () => {
  const { products, loading, deleteProduct } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsEdit(false);
    setOpenForm(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEdit(true);
    setOpenForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Products</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      </Box>

      <Box mb={2}>
        <TextField
          placeholder="Search products..."
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: <Search />,
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Unit of Measure</TableCell>
              <TableCell>Current Stock</TableCell>
              <TableCell>Reorder Level</TableCell>
              <TableCell>Max Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>
                  <Chip
                    label={product.category.name}
                    size="small"
                    color="primary"
                  />
                </TableCell>
                <TableCell>{product.unitOfMeasure}</TableCell>
                <TableCell>
                  <strong>{product.stock || 0}</strong>
                </TableCell>
                <TableCell>{product.reorderLevel}</TableCell>
                <TableCell>{product.maxStock}</TableCell>
                <TableCell>
                  {(product.stock || 0) === 0 ? (
                    <Chip label="Out of Stock" size="small" style={{ backgroundColor: '#f44336', color: 'white' }} />
                  ) : (product.stock || 0) <= product.reorderLevel ? (
                    <Chip label="Low Stock" size="small" color="secondary" />
                  ) : (
                    <Chip label="In Stock" size="small" color="primary" />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredProducts.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="body1">No products found</Typography>
        </Box>
      )}

      <ProductForm
        open={openForm}
        handleClose={handleCloseForm}
        product={selectedProduct}
        isEdit={isEdit}
      />
    </div>
  );
};

export default ProductList;