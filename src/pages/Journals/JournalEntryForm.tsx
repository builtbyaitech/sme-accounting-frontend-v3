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
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { NumericFormat } from 'react-number-format';

const validationSchema = yup.object({
  date: yup.date().required('Date is required'),
  description: yup.string().required('Description is required'),
  entries: yup.array().of(
    yup.object({
      account: yup.string().required('Account is required'),
      debit: yup.number().min(0, 'Debit must be positive'),
      credit: yup.number().min(0, 'Credit must be positive'),
    })
  ).min(2, 'At least two entries are required'),
});

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
  const theme = useTheme();
  const [totalDebits, setTotalDebits] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);

  const formik = useFormik({
    initialValues: initialValues || {
      date: new Date(),
      description: '',
      entries: [
        { account: '', debit: 0, credit: 0 },
        { account: '', debit: 0, credit: 0 },
      ],
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleAddEntry = () => {
    formik.setFieldValue('entries', [
      ...formik.values.entries,
      { account: '', debit: 0, credit: 0 },
    ]);
  };

  const handleRemoveEntry = (index: number) => {
    const newEntries = formik.values.entries.filter((_, i) => i !== index);
    formik.setFieldValue('entries', newEntries);
  };

  const calculateTotals = () => {
    const debits = formik.values.entries.reduce(
      (sum, entry) => sum + (entry.debit || 0),
      0
    );
    const credits = formik.values.entries.reduce(
      (sum, entry) => sum + (entry.credit || 0),
      0
    );
    setTotalDebits(debits);
    setTotalCredits(credits);
  };

  React.useEffect(() => {
    calculateTotals();
  }, [formik.values.entries]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3 }}>
          New Journal Entry
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={formik.values.date}
                  onChange={(date) => formik.setFieldValue('date', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.date && Boolean(formik.errors.date),
                      helperText: formik.touched.date && formik.errors.date,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Entries</Typography>
              </Box>

              {formik.values.entries.map((entry, index) => (
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
                    name={`entries.${index}.account`}
                    value={entry.account}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.entries?.[index]?.account &&
                      Boolean(formik.errors.entries?.[index]?.account)
                    }
                    helperText={
                      formik.touched.entries?.[index]?.account &&
                      formik.errors.entries?.[index]?.account
                    }
                    sx={{ flex: 2 }}
                  >
                    {mockAccounts.map((account) => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <NumericFormat
                    customInput={TextField}
                    label="Debit"
                    name={`entries.${index}.debit`}
                    value={entry.debit}
                    onValueChange={(values) => {
                      formik.setFieldValue(
                        `entries.${index}.debit`,
                        values.floatValue || 0
                      );
                    }}
                    thousandSeparator
                    prefix="$"
                    sx={{ flex: 1 }}
                  />

                  <NumericFormat
                    customInput={TextField}
                    label="Credit"
                    name={`entries.${index}.credit`}
                    value={entry.credit}
                    onValueChange={(values) => {
                      formik.setFieldValue(
                        `entries.${index}.credit`,
                        values.floatValue || 0
                      );
                    }}
                    thousandSeparator
                    prefix="$"
                    sx={{ flex: 1 }}
                  />

                  {formik.values.entries.length > 2 && (
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
                  backgroundColor: theme.palette.background.default,
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