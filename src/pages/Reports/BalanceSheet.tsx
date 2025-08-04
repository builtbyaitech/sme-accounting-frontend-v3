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

const mockBalances = {
  assets: [{ _id: 'Asset', total: 75000, count: 5 }],
  liabilities: [{ _id: 'Liability', total: 25000, count: 3 }],
  equity: [{ _id: 'Equity', total: 50000, count: 2 }],
};

export const BalanceSheet: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const totalAssets = mockBalances.assets.reduce((sum, item) => sum + item.total, 0);
  const totalLiabilities = mockBalances.liabilities.reduce((sum, item) => sum + item.total, 0);
  const totalEquity = mockBalances.equity.reduce((sum, item) => sum + item.total, 0);

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
                {mockBalances.assets.map((item) => (
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
                {mockBalances.liabilities.map((item) => (
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
                {mockBalances.equity.map((item) => (
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