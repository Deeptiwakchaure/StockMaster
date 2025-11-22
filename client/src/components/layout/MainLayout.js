import React, { useState } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { CssBaseline, useMediaQuery, useTheme } from '@material-ui/core';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import DashboardPage from '../../pages/DashboardPage';
import ProductPage from '../../pages/ProductPage';
import ReceiptPage from '../../pages/ReceiptPage';
import DeliveryPage from '../../pages/DeliveryPage';
import TransferPage from '../../pages/TransferPage';
import AdjustmentPage from '../../pages/AdjustmentPage';
import ProfilePage from '../../pages/ProfilePage';
import SettingsPage from '../../pages/SettingsPage';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when route changes on mobile
  React.useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main style={{ flexGrow: 1, marginTop: 64, padding: 16, width: '100%', overflow: 'auto' }}>
        <Switch>
          <Route exact path="/" component={DashboardPage} />
          <Route exact path="/products" component={ProductPage} />
          <Route exact path="/receipts" component={ReceiptPage} />
          <Route exact path="/deliveries" component={DeliveryPage} />
          <Route exact path="/transfers" component={TransferPage} />
          <Route exact path="/adjustments" component={AdjustmentPage} />
          <Route exact path="/settings" component={SettingsPage} />
          <Route exact path="/profile" component={ProfilePage} />
        </Switch>
      </main>
    </div>
  );
};

export default MainLayout;