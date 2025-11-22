import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import {
  Add,
  Search,
  FilterList,
} from '@material-ui/icons';
import { useInventory } from '../../context/InventoryContext';
import { formatDateTime, getStatusColor, getTransactionTypeLabel, getTransactionTypeIcon } from '../../utils/helpers';

const TransactionList = ({ type, title, FormComponent }) => {
  const { transactions, fetchTransactions, warehouses, loading } = useInventory();
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    // Skip auto-fetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    let result = transactions.filter(t => t.type === type);
    
    if (searchTerm) {
      result = result.filter(t => 
        t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter) {
      result = result.filter(t => t.status === statusFilter);
    }
    
    if (warehouseFilter) {
      result = result.filter(t => 
        (t.warehouse && t.warehouse._id === warehouseFilter) ||
        (t.fromWarehouse && t.fromWarehouse._id === warehouseFilter) ||
        (t.toWarehouse && t.toWarehouse._id === warehouseFilter)
      );
    }
    
    setFilteredTransactions(result);
  }, [transactions, searchTerm, statusFilter, warehouseFilter, type]);

  const handleAddTransaction = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const getTransactionDetails = (transaction) => {
    switch (transaction.type) {
      case 'receipt':
        return `Warehouse: ${transaction.warehouse.name}`;
      case 'delivery':
        return `Warehouse: ${transaction.warehouse.name}`;
      case 'transfer':
        return `From: ${transaction.fromWarehouse.name} To: ${transaction.toWarehouse.name}`;
      case 'adjustment':
        return `Warehouse: ${transaction.warehouse.name}`;
      default:
        return '';
    }
  };

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">{title}</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddTransaction}
        >
          Add {title.slice(0, -1)}
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          placeholder="Search..."
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: <Search />,
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flexGrow: 1 }}
        />
        <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="waiting">Waiting</MenuItem>
            <MenuItem value="ready">Ready</MenuItem>
            <MenuItem value="done">Done</MenuItem>
            <MenuItem value="canceled">Canceled</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" size="small" style={{ minWidth: 150 }}>
          <InputLabel id="warehouse-filter-label">Warehouse</InputLabel>
          <Select
            labelId="warehouse-filter-label"
            id="warehouse-filter"
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            label="Warehouse"
          >
            <MenuItem value="">All</MenuItem>
            {warehouses.map((warehouse) => (
              <MenuItem key={warehouse._id} value={warehouse._id}>
                {warehouse.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reference</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction) => {
              const Icon = getTransactionTypeIcon(transaction.type);
              return (
                <TableRow key={transaction._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Icon style={{ marginRight: 8 }} />
                      {transaction.reference}
                    </Box>
                  </TableCell>
                  <TableCell>{transaction.product.name}</TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>{getTransactionDetails(transaction)}</TableCell>
                  <TableCell>{formatDateTime(transaction.createdAt)}</TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.status}
                      color={getStatusColor(transaction.status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredTransactions.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="body1">No transactions found</Typography>
        </Box>
      )}

      {FormComponent && (
        <FormComponent open={openForm} handleClose={handleCloseForm} />
      )}
    </div>
  );
};

export default TransactionList;