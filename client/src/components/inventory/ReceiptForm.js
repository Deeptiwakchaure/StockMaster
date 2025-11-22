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
  Grid,
  Typography,
  Divider,
  CircularProgress,
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
  preview: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: '1px solid #e0e0e0',
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
}));

const ReceiptForm = ({ open, handleClose, onSuccess }) => {
  const classes = useStyles();
  const { products, warehouses, createReceipt } = useInventory();
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    warehouse: '',
    supplier: '',
    reference: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Initialize form when dialog opens
  useEffect(() => {
    if (open) {
      const defaultWarehouse = warehouses.length > 0 ? warehouses[0]._id : '';
      setFormData({
        product: '',
        quantity: '',
        warehouse: defaultWarehouse,
        supplier: '',
        reference: 'REC-' + Date.now(),
        notes: '',
      });
      setErrors({});
      setSubmitError('');
    }
  }, [open, warehouses]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.product) {
      newErrors.product = 'Product is required';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    if (!formData.warehouse) {
      newErrors.warehouse = 'Warehouse is required';
    }
    
    if (!formData.reference) {
      newErrors.reference = 'Reference is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setSubmitError('');
    
    try {
      const result = await createReceipt(formData);
      
      if (result.success) {
        handleClose();
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else {
        setSubmitError(result.message || 'Failed to create receipt');
      }
    } catch (err) {
      setSubmitError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedProduct = () => {
    return products.find(p => p._id === formData.product);
  };

  const getSelectedWarehouse = () => {
    return warehouses.find(w => w._id === formData.warehouse);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth

    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Create New Receipt
          </Typography>
          {loading && <CircularProgress size={24} />}
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {submitError && (
          <Alert severity="error" className={classes.alert}>
            {submitError}
          </Alert>
        )}
        
        <Box component="form" className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                margin="normal" 
                required
                error={!!errors.product}
              >
                <InputLabel id="product-label">Product</InputLabel>
                <Select
                  labelId="product-label"
                  id="product"
                  name="product"
                  value={formData.product}
                  label="Product"
                  onChange={handleChange}
                  disabled={loading}
                >
                  {products.map((product) => (
                    <MenuItem key={product._id} value={product._id}>
                      {product.name} ({product.sku})
                    </MenuItem>
                  ))}
                </Select>
                {errors.product && (
                  <Typography variant="caption" color="error">
                    {errors.product}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                margin="normal" 
                required
                error={!!errors.warehouse}
              >
                <InputLabel id="warehouse-label">Warehouse</InputLabel>
                <Select
                  labelId="warehouse-label"
                  id="warehouse"
                  name="warehouse"
                  value={formData.warehouse}
                  label="Warehouse"
                  onChange={handleChange}
                  disabled={loading}
                >
                  {warehouses.map((warehouse) => (
                    <MenuItem key={warehouse._id} value={warehouse._id}>
                      {warehouse.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.warehouse && (
                  <Typography variant="caption" color="error">
                    {errors.warehouse}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                fullWidth
                id="supplier"
                label="Supplier Name"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="quantity"
                label="Quantity Received"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                error={!!errors.quantity}
                helperText={errors.quantity}
                disabled={loading}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="reference"
                label="Reference"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                error={!!errors.reference}
                helperText={errors.reference}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
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
                disabled={loading}
                placeholder="Optional notes about this receipt"
              />
            </Grid>
          </Grid>
          
          {/* Preview Section */}
          {(formData.product || formData.warehouse) && (
            <>
              <Divider className={classes.divider} />
              <Typography variant="subtitle1" gutterBottom>
                Receipt Preview
              </Typography>
              
              <Box className={classes.preview}>
                <Grid container spacing={2}>
                  {formData.product && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Product
                      </Typography>
                      <Typography variant="body1">
                        {getSelectedProduct()?.name} ({getSelectedProduct()?.sku})
                      </Typography>
                    </Grid>
                  )}
                  
                  {formData.warehouse && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Warehouse
                      </Typography>
                      <Typography variant="body1">
                        {getSelectedWarehouse()?.name}
                      </Typography>
                    </Grid>
                  )}
                  
                  {formData.quantity && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Quantity
                      </Typography>
                      <Typography variant="body1">
                        {formData.quantity} {getSelectedProduct()?.unitOfMeasure || 'units'}
                      </Typography>
                    </Grid>
                  )}
                  
                  {formData.reference && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Reference
                      </Typography>
                      <Typography variant="body1">
                        {formData.reference}
                      </Typography>
                    </Grid>
                  )}
                  
                  {formData.supplier && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Supplier
                      </Typography>
                      <Typography variant="body1">
                        {formData.supplier}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={handleClose} 
          color="inherit"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Creating...' : 'Create Receipt'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReceiptForm;