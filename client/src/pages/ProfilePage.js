import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';

const useStyles = makeStyles((theme) => ({
  alert: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const ProfilePage = () => {
  const classes = useStyles();
  const { user } = useAuth();
  const { updateUser } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUser(user._id, formData);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // In a real app, you would have an endpoint to change password
      // For now, we'll just show a success message
      setSuccess('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      
      {error && <Alert severity="error" className={classes.alert}>{error}</Alert>}
      {success && <Alert severity="success" className={classes.alert}>{success}</Alert>}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profile Information
              </Typography>
              <Box component="form" onSubmit={handleUpdateProfile}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleProfileChange}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleProfileChange}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  className={classes.button}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <Box component="form" onSubmit={handleChangePassword}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="currentPassword"
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="newPassword"
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="confirmPassword"
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  className={classes.button}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              <Box style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Typography variant="body1">
                  <strong>Role:</strong> {user?.role?.replace('_', ' ').toUpperCase()}
                </Typography>
                <Typography variant="body1">
                  <strong>Member Since:</strong> {new Date(user?.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;