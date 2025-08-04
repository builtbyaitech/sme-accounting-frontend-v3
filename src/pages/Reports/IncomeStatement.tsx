import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon,
} from '@mui/icons-material';

const mockData = {
  revenue: [{ _id: 'Revenue', total: 100000, count: 4 }],
  expenses: [{ _id: 'Expense', total: 30000, count: 6 }],
};

export const IncomeStatement: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const totalRevenue = mockData.revenue.reduce(
    (sum, item) => sum + item.total,
    0
  );
  const totalExpenses = mockData.expenses.reduce(
    (sum, item) => sum + item.total,
    0
  );
  const netIncome = totalRevenue - totalExpenses;

  const exportToCsv = () => {
    setIsExporting(true);
    console.log('Exporting to CSV...');
    setTimeout(() => setIsExporting(false), 1000);
  };

  const exportToPdf = () => {
    setIsExporting(true);
    console.log('Exporting to PDF...');
    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">Income Statement</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<CsvIcon />}
            onClick={exportToCsv}
            disabled={isExporting}
            sx={{ mr: 1 }}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<PdfIcon />}
            onClick={exportToPdf}
            disabled={isExporting}
          >
            Export PDF
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" color="success.main">
                ${totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Expenses
              </Typography>
              <Typography variant="h4" color="error">
                ${totalExpenses.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Net Income
              </Typography>
              <Typography
                variant="h4"
                color={netIncome >= 0 ? 'success.main' : 'error'}
              >
                ${netIncome.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography variant="h6">Revenue</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Account Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockData.revenue.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item._id}</TableCell>
                    <TableCell align="right">
                      ${item.total.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <strong>Total Revenue</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>${totalRevenue.toLocaleString()}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Expenses Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography variant="h6">Expenses</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Account Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockData.expenses.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item._id}</TableCell>
                    <TableCell align="right">
                      ${item.total.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <strong>Total Expenses</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>${totalExpenses.toLocaleString()}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Net Income Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography variant="h6">Net Income</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Net Income</strong>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: netIncome >= 0 ? 'success.main' : 'error',
                    }}
                  >
                    <strong>${netIncome.toLocaleString()}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}; 