import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './theme';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { AccountsList } from './pages/Accounts/AccountsList';
import { JournalEntryForm } from './pages/Journals/JournalEntryForm';
import { AccountBalances } from './pages/Reports/AccountBalances';
import { BalanceSheet } from './pages/Reports/BalanceSheet';
import { IncomeStatement } from './pages/Reports/IncomeStatement';

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<AccountsList />} />
            <Route path="/journals/new" element={<JournalEntryForm onSubmit={(values) => console.log(values)} />} />
            <Route path="/reports/balances" element={<AccountBalances />} />
            <Route path="/reports/balance-sheet" element={<BalanceSheet />} />
            <Route path="/reports/income-statement" element={<IncomeStatement />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </ThemeProvider>
  );
};