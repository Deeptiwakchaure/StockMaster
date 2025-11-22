import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paper: {
    padding: theme.spacing(4),
    width: '100%',
  },
  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  alert: {
    marginBottom: theme.spacing(2),
  },
  linkBox: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      history.push('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.container}>
        <Paper elevation={3} className={classes.paper}>
          <Typography component="h1" variant="h5" align="center">
            StockMaster
          </Typography>
          <Typography component="h2" variant="h6" align="center" gutterBottom>
            Sign In
          </Typography>
          
          {error && <Alert severity="error" className={classes.alert}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} className={classes.form}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            <Box style={{ textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/reset-password');
                }}
              >
                Forgot password?
              </Link>
            </Box>
            <Box className={classes.linkBox}>
              <Link
                component="button"
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/signup');
                }}
              >
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;