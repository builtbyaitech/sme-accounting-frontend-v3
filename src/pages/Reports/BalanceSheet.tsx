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

interface BalanceSheetData {
  assets: AccountBalance[];
  liabilities: AccountBalance[];
  equity: AccountBalance[];
}

export const BalanceSheet: React.FC = () => {
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

  const balanceSheetData: BalanceSheetData = {
    assets: balances?.filter((b) => b._id === 'Asset') || [],
    liabilities: balances?.filter((b) => b._id === 'Liability') || [],
    equity: balances?.filter((b) => b._id === 'Equity') || [],
  };

  const totalAssets = balanceSheetData.assets.reduce((sum, item) => sum + item.total, 0);
  const totalLiabilities = balanceSheetData.liabilities.reduce((sum, item) => sum + item.total, 0);
  const totalEquity = balanceSheetData.equity.reduce((sum, item) => sum + item.total, 0);

  const exportToCsv = () => {
    setIsExporting(true);
    try {
      const data = [
        ['Balance Sheet', ''],
        ['', ''],
        ['Assets', 'Amount'],
        ...balanceSheetData.assets.map((item) => [item._id, item.total]),
        ['Total Assets', totalAssets],
        ['', ''],
        ['Liabilities', 'Amount'],
        ...balanceSheetData.liabilities.map((item) => [item._id, item.total]),
        ['Total Liabilities', totalLiabilities],
        ['', ''],
        ['Equity', 'Amount'],
        ...balanceSheetData.equity.map((item) => [item._id, item.total]),
        ['Total Equity', totalEquity],
      ];

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Balance Sheet');
      XLSX.writeFile(wb, 'balance_sheet.xlsx');
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
      doc.text('Balance Sheet', 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${today}`, 14, 22);

      // Assets
      doc.setFontSize(12);
      doc.text('Assets', 14, 30);
      const assetsData = balanceSheetData.assets.map((item) => [
        item._id,
        `$${item.total.toLocaleString()}`,
      ]);
      assetsData.push(['Total Assets', `$${totalAssets.toLocaleString()}`]);

      // Liabilities
      doc.text('Liabilities', 14, 90);
      const liabilitiesData = balanceSheetData.liabilities.map((item) => [
        item._id,
        `$${item.total.toLocaleString()}`,
      ]);
      liabilitiesData.push(['Total Liabilities', `$${totalLiabilities.toLocaleString()}`]);

      // Equity
      doc.text('Equity', 14, 150);
      const equityData = balanceSheetData.equity.map((item) => [
        item._id,
        `$${item.total.toLocaleString()}`,
      ]);
      equityData.push(['Total Equity', `$${totalEquity.toLocaleString()}`]);

      // Add tables
      (doc as any).autoTable({
        startY: 35,
        head: [['Account Type', 'Amount']],
        body: assetsData,
      });

      (doc as any).autoTable({
        startY: 95,
        head: [['Account Type', 'Amount']],
        body: liabilitiesData,
      });

      (doc as any).autoTable({
        startY: 155,
        head: [['Account Type', 'Amount']],
        body: equityData,
      });

      doc.save('balance_sheet.pdf');
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
        <Typography variant="h4">Balance Sheet</Typography>
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
                Total Assets
              </Typography>
              <Typography variant="h4" color="primary">
                ${totalAssets.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Liabilities
              </Typography>
              <Typography variant="h4" color="error">
                ${totalLiabilities.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Equity
              </Typography>
              <Typography variant="h4" color="success.main">
                ${totalEquity.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Balance Sheet Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography variant="h6">Assets</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Account Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {balanceSheetData.assets.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item._id}</TableCell>
                    <TableCell align="right">
                      ${item.total.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <strong>Total Assets</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>${totalAssets.toLocaleString()}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography variant="h6">Liabilities</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Account Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {balanceSheetData.liabilities.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item._id}</TableCell>
                    <TableCell align="right">
                      ${item.total.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <strong>Total Liabilities</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>${totalLiabilities.toLocaleString()}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography variant="h6">Equity</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Account Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {balanceSheetData.equity.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item._id}</TableCell>
                    <TableCell align="right">
                      ${item.total.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <strong>Total Equity</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>${totalEquity.toLocaleString()}</strong>
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