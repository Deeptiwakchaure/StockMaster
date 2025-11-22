import React, { useState } from 'react';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@material-ui/core';
import { Add, Edit, Delete } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useInventory } from '../context/InventoryContext';

const useStyles = makeStyles((theme) => ({
  tabs: {
    marginBottom: theme.spacing(3),
  },
  addButton: {
    marginBottom: theme.spacing(2),
  },
}));

const SettingsPage = () => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', capacity: '' });
  const { warehouses, createWarehouse, categories, createCategory } = useInventory();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tabValue === 0) {
      await createWarehouse(formData);
    } else {
      await createCategory(formData);
    }
    setFormData({ name: '', location: '', capacity: '' });
    setShowForm(false);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} className={classes.tabs}>
        <Tab label="Warehouses" />
        <Tab label="Categories" />
      </Tabs>

      {tabValue === 0 && (
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setShowForm(!showForm)}
            className={classes.addButton}
          >
            Add Warehouse
          </Button>

          {showForm && (
            <Card style={{ marginBottom: 16 }}>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Warehouse Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    margin="normal"
                    required
                  />
                  <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary" style={{ marginRight: 8 }}>
                      Save
                    </Button>
                    <Button onClick={() => setShowForm(false)}>Cancel</Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {warehouses.map((warehouse) => (
                  <TableRow key={warehouse._id}>
                    <TableCell>{warehouse.name}</TableCell>
                    <TableCell>{warehouse.location}</TableCell>
                    <TableCell>{warehouse.capacity}</TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="secondary">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setShowForm(!showForm)}
            className={classes.addButton}
          >
            Add Category
          </Button>

          {showForm && (
            <Card style={{ marginBottom: 16 }}>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Category Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    margin="normal"
                  />
                  <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary" style={{ marginRight: 8 }}>
                      Save
                    </Button>
                    <Button onClick={() => setShowForm(false)}>Cancel</Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="secondary">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Container>
  );
};

export default SettingsPage;
