import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
  CircularProgress,
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
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface AccountBalance {
  _id: string;
  total: number;
  count: number;
}

interface IncomeStatementData {
  revenue: AccountBalance[];
  expenses: AccountBalance[];
}

export const IncomeStatement: React.FC = () => {
  const theme = useTheme();
  const [isExporting, setIsExporting] = useState(false);

  const { data: balances, isLoading } = useQuery<AccountBalance[]>(
    'accountBalances',
    async () => {
      const response = await fetch('http://localhost:5000/api/accounts/balances');
      if (!response.ok) {
        throw new Error('Failed to fetch account balances');
      }
      return response.json();
    }
  );

  const incomeStatementData: IncomeStatementData = {
    revenue: balances?.filter((b) => b._id === 'Revenue') || [],
    expenses: balances?.filter((b) => b._id === 'Expense') || [],
  };

  const totalRevenue = incomeStatementData.revenue.reduce(
    (sum, item) => sum + item.total,
    0
  );
  const totalExpenses = incomeStatementData.expenses.reduce(
    (sum, item) => sum + item.total,
    0
  );
  const netIncome = totalRevenue - totalExpenses;

  const exportToCsv = () => {
    setIsExporting(true);
    try {
      const data = [
        ['Income Statement', ''],
        ['', ''],
        ['Revenue', 'Amount'],
        ...incomeStatementData.revenue.map((item) => [item._id, item.total]),
        ['Total Revenue', totalRevenue],
        ['', ''],
        ['Expenses', 'Amount'],
        ...incomeStatementData.expenses.map((item) => [item._id, item.total]),
        ['Total Expenses', totalExpenses],
        ['', ''],
        ['Net Income', netIncome],
      ];

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Income Statement');
      XLSX.writeFile(wb, 'income_statement.xlsx');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPdf = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      const today = new Date().toLocaleDateString();

      // Title
      doc.setFontSize(16);
      doc.text('Income Statement', 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${today}`, 14, 22);

      // Revenue
      doc.setFontSize(12);
      doc.text('Revenue', 14, 30);
      const revenueData = incomeStatementData.revenue.map((item) => [
        item._id,
        `$${item.total.toLocaleString()}`,
      ]);
      revenueData.push(['Total Revenue', `$${totalRevenue.toLocaleString()}`]);

      // Expenses
      doc.text('Expenses', 14, 90);
      const expensesData = incomeStatementData.expenses.map((item) => [
        item._id,
        `$${item.total.toLocaleString()}`,
      ]);
      expensesData.push(['Total Expenses', `$${totalExpenses.toLocaleString()}`]);

      // Net Income
      doc.text('Net Income', 14, 150);
      const netIncomeData = [['Net Income', `$${netIncome.toLocaleString()}`]];

      // Add tables
      (doc as any).autoTable({
        startY: 35,
        head: [['Account Type', 'Amount']],
        body: revenueData,
      });

      (doc as any).autoTable({
        startY: 95,
        head: [['Account Type', 'Amount']],
        body: expensesData,
      });

      (doc as any).autoTable({
        startY: 155,
        head: [['Account Type', 'Amount']],
        body: netIncomeData,
      });

      doc.save('income_statement.pdf');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
                {incomeStatementData.revenue.map((item) => (
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
                {incomeStatementData.expenses.map((item) => (
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