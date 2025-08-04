import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
} from '@mui/material';

const mockBalances = [
  { _id: 'Asset', total: 75000, count: 5 },
  { _id: 'Liability', total: 25000, count: 3 },
  { _id: 'Equity', total: 50000, count: 2 },
  { _id: 'Revenue', total: 100000, count: 4 },
  { _id: 'Expense', total: 30000, count: 6 },
];

export const AccountBalances: React.FC = () => {
  const totalBalance = mockBalances.reduce((sum, item) => sum + item.total, 0);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Account Balances Report
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Balance
              </Typography>
              <Typography variant="h4">
                ${totalBalance.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Accounts
              </Typography>
              <Typography variant="h4">
                {mockBalances.reduce((sum, item) => sum + item.count, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Account Types
              </Typography>
              <Typography variant="h4">{mockBalances.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Types List */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Account Types Overview
              </Typography>
              <Grid container spacing={2}>
                {mockBalances.map((balance) => (
                  <Grid item xs={12} sm={6} md={4} key={balance._id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6">{balance._id}</Typography>
                        <Typography variant="h4" color="primary">
                          ${balance.total.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {balance.count} accounts
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 