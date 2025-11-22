import React from 'react';
import { Card, CardContent, Typography, Box } from '@material-ui/core';

const KPICard = ({ title, value, icon, color }) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value}
            </Typography>
          </Box>
          <Box color={color || 'primary.main'} fontSize={40}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KPICard;