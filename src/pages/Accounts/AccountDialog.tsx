import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  balance: number;
  status: 'active' | 'inactive';
}

interface AccountDialogProps {
  open: boolean;
  onClose: () => void;
  account: Account | null;
}

const accountTypes = [
  'Asset',
  'Liability',
  'Equity',
  'Revenue',
  'Expense',
];

const validationSchema = Yup.object({
  code: Yup.string()
    .required('Account code is required')
    .matches(/^\d{4}$/, 'Account code must be 4 digits'),
  name: Yup.string().required('Account name is required'),
  type: Yup.string().required('Account type is required'),
  balance: Yup.number()
    .required('Balance is required')
    .min(0, 'Balance cannot be negative'),
  status: Yup.string().required('Status is required'),
});

export const AccountDialog: React.FC<AccountDialogProps> = ({
  open,
  onClose,
  account,
}) => {
  const formik = useFormik({
    initialValues: {
      code: account?.code || '',
      name: account?.name || '',
      type: account?.type || '',
      balance: account?.balance || 0,
      status: account?.status || 'active',
    },
    validationSchema,
    onSubmit: (values) => {
      // In a real app, this would be an API call
      console.log('Form submitted:', values);
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {account ? 'Edit Account' : 'Add New Account'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="Account Code"
              name="code"
              value={formik.values.code}
              onChange={formik.handleChange}
              error={formik.touched.code && Boolean(formik.errors.code)}
              helperText={formik.touched.code && formik.errors.code}
            />
            <TextField
              fullWidth
              label="Account Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              select
              label="Account Type"
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              error={formik.touched.type && Boolean(formik.errors.type)}
              helperText={formik.touched.type && formik.errors.type}
            >
              {accountTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Balance"
              name="balance"
              type="number"
              value={formik.values.balance}
              onChange={formik.handleChange}
              error={formik.touched.balance && Boolean(formik.errors.balance)}
              helperText={formik.touched.balance && formik.errors.balance}
            />
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              error={formik.touched.status && Boolean(formik.errors.status)}
              helperText={formik.touched.status && formik.errors.status}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {account ? 'Save Changes' : 'Add Account'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 