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
  alert: { marginBottom: theme.spacing(2) },
  form: { marginTop: theme.spacing(1) },
}));

const DeliveryForm = ({ open, handleClose }) => {
  const classes = useStyles();
  const { products, warehouses, createDelivery } = useInventory();
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    warehouse: '',
    reference: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        product: '',
        quantity: '',
        warehouse: warehouses.length > 0 ? warehouses[0]._id : '',
        reference: 'DEL-' + Date.now(),
        notes: '',
      });
    }
  }, [open, warehouses]);

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
      await createDelivery(formData);
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to create delivery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Delivery</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" className={classes.alert}>{error}</Alert>}
        <Box component="form" className={classes.form}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="product-label">Product</InputLabel>
            <Select
              labelId="product-label"
              id="product"
              name="product"
              value={formData.product}
              label="Product"
              onChange={handleChange}
            >
              {products.map((product) => (
                <MenuItem key={product._id} value={product._id}>
                  {product.name} ({product.sku})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            id="quantity"
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="warehouse-label">Warehouse</InputLabel>
            <Select
              labelId="warehouse-label"
              id="warehouse"
              name="warehouse"
              value={formData.warehouse}
              label="Warehouse"
              onChange={handleChange}
            >
              {warehouses.map((warehouse) => (
                <MenuItem key={warehouse._id} value={warehouse._id}>
                  {warehouse.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            fullWidth
            id="reference"
            label="Reference"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            id="notes"
            label="Notes"
            name="notes"
            multiline
            rows={3}
            value={formData.notes}
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
          {loading ? 'Creating...' : 'Create Delivery'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeliveryForm;