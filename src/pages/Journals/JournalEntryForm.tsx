import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const mockAccounts = [
  { id: '1', name: 'Cash' },
  { id: '2', name: 'Accounts Receivable' },
  { id: '3', name: 'Inventory' },
  { id: '4', name: 'Accounts Payable' },
  { id: '5', name: 'Revenue' },
  { id: '6', name: 'Expenses' },
];

interface JournalEntryFormProps {
  onSubmit: (values: any) => void;
  initialValues?: any;
}

export const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  const [totalDebits, setTotalDebits] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [entries, setEntries] = useState([
    { account: '', debit: 0, credit: 0 },
    { account: '', debit: 0, credit: 0 },
  ]);
  const [description, setDescription] = useState('');

  const handleAddEntry = () => {
    setEntries([
      ...entries,
      { account: '', debit: 0, credit: 0 },
    ]);
  };

  const handleRemoveEntry = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
  };

  const calculateTotals = () => {
    const debits = entries.reduce(
      (sum, entry) => sum + (entry.debit || 0),
      0
    );
    const credits = entries.reduce(
      (sum, entry) => sum + (entry.credit || 0),
      0
    );
    setTotalDebits(debits);
    setTotalCredits(credits);
  };

  React.useEffect(() => {
    calculateTotals();
  }, [entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date: new Date(),
      description,
      entries,
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3 }}>
          New Journal Entry
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Entries</Typography>
              </Box>

              {entries.map((entry, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 2,
                    alignItems: 'flex-start',
                  }}
                >
                  <TextField
                    select
                    label="Account"
                    value={entry.account}
                    onChange={(e) => {
                      const newEntries = [...entries];
                      newEntries[index].account = e.target.value;
                      setEntries(newEntries);
                    }}
                    sx={{ flex: 2 }}
                  >
                    {mockAccounts.map((account) => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Debit"
                    type="number"
                    value={entry.debit}
                    onChange={(e) => {
                      const newEntries = [...entries];
                      newEntries[index].debit = parseFloat(e.target.value) || 0;
                      setEntries(newEntries);
                    }}
                    sx={{ flex: 1 }}
                  />

                  <TextField
                    label="Credit"
                    type="number"
                    value={entry.credit}
                    onChange={(e) => {
                      const newEntries = [...entries];
                      newEntries[index].credit = parseFloat(e.target.value) || 0;
                      setEntries(newEntries);
                    }}
                    sx={{ flex: 1 }}
                  />

                  {entries.length > 2 && (
                    <IconButton
                      onClick={() => handleRemoveEntry(index)}
                      color="error"
                      sx={{ mt: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}

              <Button
                startIcon={<AddIcon />}
                onClick={handleAddEntry}
                sx={{ mb: 3 }}
              >
                Add Entry
              </Button>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 3,
                  p: 2,
                  backgroundColor: '#f8fafc',
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle1">
                  Total Debits: ${totalDebits.toFixed(2)}
                </Typography>
                <Typography variant="subtitle1">
                  Total Credits: ${totalCredits.toFixed(2)}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color={
                    totalDebits === totalCredits
                      ? 'success.main'
                      : 'error.main'
                  }
                >
                  {totalDebits === totalCredits
                    ? 'Balanced'
                    : 'Not Balanced'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => formik.resetForm()}>
                <Button variant="outlined" onClick={() => {
                  setDescription('');
                  setEntries([
                    { account: '', debit: 0, credit: 0 },
                    { account: '', debit: 0, credit: 0 },
                  ]);
                }}>
                  Reset
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={totalDebits !== totalCredits}
                >
                  Save Entry
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}; 