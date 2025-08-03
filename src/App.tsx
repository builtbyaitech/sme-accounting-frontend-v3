import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import { theme } from './theme';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { JournalEntryForm } from './pages/Journals/JournalEntryForm';
import { AccountsList } from './pages/Accounts/AccountsList';
import { AccountBalances } from './pages/Reports/AccountBalances';
import { BalanceSheet } from './pages/Reports/BalanceSheet';
import { IncomeStatement } from './pages/Reports/IncomeStatement';

const queryClient = new QueryClient();

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <Router>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/journals/new" element={<JournalEntryForm />} />
                <Route path="/accounts" element={<AccountsList />} />
                <Route path="/reports/balances" element={<AccountBalances />} />
                <Route path="/reports/balance-sheet" element={<BalanceSheet />} />
                <Route path="/reports/income-statement" element={<IncomeStatement />} />
                {/* Add more routes as needed */}
              </Routes>
            </DashboardLayout>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}; 