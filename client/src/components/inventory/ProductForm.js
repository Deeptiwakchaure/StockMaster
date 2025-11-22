import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { useInventory } from '../../context/InventoryContext';

const useStyles = makeStyles((theme) => ({
  alert: {
    marginBottom: theme.spacing(2),
  },
  form: {
    marginTop: theme.spacing(1),
  },
}));

const ProductForm = ({ open, handleClose, product, isEdit }) => {
  const classes = useStyles();
  const { categories, createProduct, updateProduct } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    unitOfMeasure: '',
    reorderLevel: 0,
    maxStock: 1000,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        description: product.description || '',
        category: product.category._id,
        unitOfMeasure: product.unitOfMeasure,
        reorderLevel: product.reorderLevel,
        maxStock: product.maxStock,
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        description: '',
        category: '',
        unitOfMeasure: '',
        reorderLevel: 0,
        maxStock: 1000,
      });
    }
  }, [isEdit, product, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await updateProduct(product._id, formData);
      } else {
        await createProduct(formData);
      }
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" className={classes.alert}>{error}</Alert>}
        <Box component="form" className={classes.form}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="sku"
            label="SKU"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              label="Category"
              onChange={handleChange}
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            id="unitOfMeasure"
            label="Unit of Measure"
            name="unitOfMeasure"
            value={formData.unitOfMeasure}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            id="reorderLevel"
            label="Reorder Level"
            name="reorderLevel"
            type="number"
            value={formData.reorderLevel}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            id="maxStock"
            label="Maximum Stock"
            name="maxStock"
            type="number"
            value={formData.maxStock}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            id="initialStock"
            label="Initial Stock (Optional)"
            name="initialStock"
            type="number"
            value={formData.initialStock || ''}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;