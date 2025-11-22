import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Stepper,
  Step,
  StepLabel,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
  stepper: {
    marginBottom: theme.spacing(4),
  },
  linkBox: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
}));

const OTPResetPage = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { requestPasswordReset, resetPassword } = useAuth();
  const history = useHistory();

  const steps = ['Enter Email', 'Enter OTP', 'Reset Password'];

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await requestPasswordReset(email);
    
    if (result.success) {
      setSuccess('OTP has been sent to your email');
      setActiveStep(1);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await resetPassword(email, otp, newPassword);
    
    if (result.success) {
      setSuccess('Password has been reset successfully');
      setTimeout(() => history.push('/'), 2000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" onSubmit={handleRequestOTP} className={classes.form}>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </Box>
        );
      case 1:
        return (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); setActiveStep(2); }} className={classes.form}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="otp"
              label="One-Time Password"
              name="otp"
              autoComplete="one-time-code"
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Verify OTP
            </Button>
          </Box>
        );
      case 2:
        return (
          <Box component="form" onSubmit={handleResetPassword} className={classes.form}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.container}>
        <Paper elevation={3} className={classes.paper}>
          <Typography component="h1" variant="h5" align="center">
            StockMaster
          </Typography>
          <Typography component="h2" variant="h6" align="center" gutterBottom>
            Reset Password
          </Typography>
          
          {error && <Alert severity="error" className={classes.alert}>{error}</Alert>}
          {success && <Alert severity="success" className={classes.alert}>{success}</Alert>}
          
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {getStepContent(activeStep)}
          
          <Box className={classes.linkBox}>
            <Link
              component="button"
              variant="body2"
              onClick={(e) => {
                e.preventDefault();
                history.push('/login');
              }}
            >
              Back to Login
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default OTPResetPage;