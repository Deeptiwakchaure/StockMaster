import React, { useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@material-ui/core';
import {
  LocalShipping,
  SwapHoriz,
  Warning,
  Error,
  CheckCircle,
  Storage as Inventory,
} from '@material-ui/icons';
import { useInventory } from '../../context/InventoryContext';
import KPICard from './KPICard';
import { formatDateTime, getStatusColor, getTransactionTypeLabel, getTransactionTypeIcon } from '../../utils/helpers';

const Dashboard = () => {
  const { dashboardData, fetchDashboardData, loading } = useInventory();

  useEffect(() => {
    // Skip auto-fetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !dashboardData) {
    return <div>Loading...</div>;
  }

  const {
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    pendingReceipts,
    pendingDeliveries,
    scheduledTransfers,
    recentTransactions,
  } = dashboardData;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Products"
            value={totalProducts}
            icon={<Inventory />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Low Stock Items"
            value={lowStockProducts}
            icon={<Warning />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Out of Stock Items"
            value={outOfStockProducts}
            icon={<Error />}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Pending Operations"
            value={pendingReceipts + pendingDeliveries + scheduledTransfers}
            icon={<CheckCircle />}
            color="success.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ marginTop: 16 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Receipts
              </Typography>
              <Box display="flex" alignItems="center">
                <Inventory color="primary" style={{ marginRight: 8 }} />
                <Typography variant="h4">{pendingReceipts}</Typography>
              </Box>
              <Box mt={2}>
                <Button variant="contained" color="primary" fullWidth>
                  View All Receipts
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Deliveries
              </Typography>
              <Box display="flex" alignItems="center">
                <LocalShipping color="primary" style={{ marginRight: 8 }} />
                <Typography variant="h4">{pendingDeliveries}</Typography>
              </Box>
              <Box mt={2}>
                <Button variant="contained" color="primary" fullWidth>
                  View All Deliveries
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Scheduled Transfers
              </Typography>
              <Box display="flex" alignItems="center">
                <SwapHoriz color="primary" style={{ marginRight: 8 }} />
                <Typography variant="h4">{scheduledTransfers}</Typography>
              </Box>
              <Box mt={2}>
                <Button variant="contained" color="primary" fullWidth>
                  View All Transfers
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card style={{ marginTop: 24 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Transactions
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reference</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentTransactions.map((transaction) => {
                  const Icon = getTransactionTypeIcon(transaction.type);
                  return (
                    <TableRow key={transaction._id}>
                      <TableCell>{transaction.reference}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Icon style={{ marginRight: 8 }} />
                          {getTransactionTypeLabel(transaction.type)}
                        </Box>
                      </TableCell>
                      <TableCell>{transaction.product.name}</TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;