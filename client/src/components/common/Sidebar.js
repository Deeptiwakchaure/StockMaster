import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core';
import {
  Dashboard,
  LocalShipping,
  SwapHoriz,
  Tune,
  Settings,
  Person,
} from '@material-ui/icons';
import Category from '@material-ui/icons/Category';
import Assignment from '@material-ui/icons/Assignment';
import { useHistory, useLocation } from 'react-router-dom';

const Sidebar = ({ open, toggleSidebar }) => {
  const history = useHistory();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Products', icon: <Category />, path: '/products' },
    { text: 'Receipts', icon: <Assignment />, path: '/receipts' },
    { text: 'Deliveries', icon: <LocalShipping />, path: '/deliveries' },
    { text: 'Transfers', icon: <SwapHoriz />, path: '/transfers' },
    { text: 'Adjustments', icon: <Tune />, path: '/adjustments' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
  ];

  const handleNavigation = (path) => {
    history.push(path);
    if (window.innerWidth < 960) {
      toggleSidebar();
    }
  };

  return (
    <Drawer anchor="left" open={open} onClose={toggleSidebar}>
      <div style={{ width: 250 }}>
        <div style={{ padding: 16 }}>
          <h2>StockMaster</h2>
        </div>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;