import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  Receipt,
  Assessment,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }: { title: string; value: string; icon: React.ReactElement; color: string }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '50%',
              p: 1,
              mr: 2,
            }}
          >
            {React.cloneElement(icon, { sx: { color } })}
          </Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const Dashboard: React.FC = () => {

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value="$24,500"
            icon={<TrendingUp />}
            color="#059669"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Expenses"
            value="$12,300"
            icon={<AccountBalance />}
            color="#dc2626"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Journal Entries"
            value="156"
            icon={<Receipt />}
            color="#0284c7"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Accounts"
            value="24"
            icon={<Assessment />}
            color="#d97706"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Financial Overview
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Charts and detailed analytics will be displayed here.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 