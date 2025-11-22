import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import PrivateRoute from './components/common/PrivateRoute';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './components/auth/Login';
import SignupPage from './components/auth/Signup';
import OTPResetPage from './components/auth/OTPReset';
import DashboardPage from './pages/DashboardPage';
import ProductPage from './pages/ProductPage';
import ReceiptPage from './pages/ReceiptPage';
import DeliveryPage from './pages/DeliveryPage';
import TransferPage from './pages/TransferPage';
import AdjustmentPage from './pages/AdjustmentPage';
import ProfilePage from './pages/ProfilePage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <InventoryProvider>
          <Router>
            <Switch>
              <Route exact path="/login" component={LoginPage} />
              <Route exact path="/signup" component={SignupPage} />
              <Route exact path="/reset-password" component={OTPResetPage} />
              <PrivateRoute path="/" component={MainLayout} />
            </Switch>
          </Router>
        </InventoryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;