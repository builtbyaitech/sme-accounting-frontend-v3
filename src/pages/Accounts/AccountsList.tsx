import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileUpload as UploadIcon,
  FileDownload as DownloadIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import * as XLSX from 'xlsx';
import { AccountDialog } from './AccountDialog';

interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  category: string;
  description?: string;
  balance: number;
  status: 'active' | 'inactive';
}

const mockAccounts: Account[] = [
  {
    id: '1',
    code: '1000',
    name: 'Cash',
    type: 'Asset',
    category: 'Current Assets',
    balance: 50000,
    status: 'active',
  },
  {
    id: '2',
    code: '1100',
    name: 'Accounts Receivable',
    type: 'Asset',
    category: 'Current Assets',
    balance: 25000,
    status: 'active',
  },
  {
    id: '3',
    code: '2000',
    name: 'Accounts Payable',
    type: 'Liability',
    category: 'Current Liabilities',
    balance: 15000,
    status: 'active',
  },
];

export const AccountsList: React.FC = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);
  const [bulkMenuAnchor, setBulkMenuAnchor] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { data: accounts = mockAccounts } = useQuery<Account[]>(
    'accounts',
    async () => {
      // In a real app, this would be an API call
      return mockAccounts;
    }
  );

  const deleteMutation = useMutation(
    async (id: string) => {
      // In a real app, this would be an API call
      console.log('Deleting account:', id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('accounts');
        setSnackbar({
          open: true,
          message: 'Account deleted successfully',
          severity: 'success',
        });
      },
      onError: () => {
        setSnackbar({
          open: true,
          message: 'Error deleting account',
          severity: 'error',
        });
      },
    }
  );

  const bulkUpdateMutation = useMutation(
    async ({ ids, status }: { ids: string[]; status: 'active' | 'inactive' }) => {
      // In a real app, this would be an API call
      console.log('Updating accounts:', ids, 'to status:', status);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('accounts');
        setSnackbar({
          open: true,
          message: 'Accounts updated successfully',
          severity: 'success',
        });
      },
      onError: () => {
        setSnackbar({
          open: true,
          message: 'Error updating accounts',
          severity: 'error',
        });
      },
    }
  );

  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.code.includes(searchQuery)
  );

  const columns: GridColDef[] = [
    { field: 'code', headerName: 'Code', width: 100 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'category', headerName: 'Category', width: 150 },
    {
      field: 'balance',
      headerName: 'Balance',
      width: 150,
      renderCell: (params) => (
        <Typography
          color={
            params.row.type === 'Asset' || params.row.type === 'Expense'
              ? theme.palette.error.main
              : theme.palette.success.main
          }
        >
          ${params.value.toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'active' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleEdit = (account: Account) => {
    setSelectedAccount(account);
    setIsDialogOpen(true);
  };

  const handleDelete = (account: Account) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      deleteMutation.mutate(account.id);
    }
  };

  const handleAdd = () => {
    setSelectedAccount(null);
    setIsDialogOpen(true);
  };

  const handleBulkUpdate = (status: 'active' | 'inactive') => {
    if (selectedRows.length === 0) return;
    
    bulkUpdateMutation.mutate({
      ids: selectedRows as string[],
      status,
    });
    setBulkMenuAnchor(null);
  };

  const handleExport = () => {
    const data = accounts.map(({ id, ...account }) => account);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Accounts');
    XLSX.writeFile(wb, 'accounts.xlsx');
  };

  const handleExportTemplate = () => {
    const template = [
      {
        code: '1000',
        name: 'Cash',
        type: 'Asset',
        category: 'Current Assets',
        balance: 0,
        status: 'active',
      },
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'accounts_template.xlsx');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validate the data
        const requiredFields = ['code', 'name', 'type', 'category', 'balance', 'status'];
        const isValid = jsonData.every((row: any) =>
          requiredFields.every((field) => field in row)
        );

        if (!isValid) {
          setImportError('Invalid file format. Please check the template.');
          return;
        }

        // In a real app, this would be an API call
        console.log('Importing accounts:', jsonData);
        setSnackbar({
          open: true,
          message: 'Accounts imported successfully',
          severity: 'success',
        });
        setImportDialogOpen(false);
      } catch (error) {
        setImportError('Error reading file. Please try again.');
      }
    };
    reader.readAsArrayBuffer(file);
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
        <Typography variant="h4">Accounts</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => fileInputRef.current?.click()}
            sx={{ mr: 1 }}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => setBulkMenuAnchor(document.currentScript as HTMLElement)}
            sx={{ mr: 1 }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Account
          </Button>
        </Box>
      </Box>

      <Menu
        anchorEl={bulkMenuAnchor}
        open={Boolean(bulkMenuAnchor)}
        onClose={() => setBulkMenuAnchor(null)}
      >
        <MenuItem onClick={handleExport}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export Accounts</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportTemplate}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download Template</ListItemText>
        </MenuItem>
      </Menu>

      {selectedRows.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<MoreVertIcon />}
            onClick={(e) => setBulkMenuAnchor(e.currentTarget)}
          >
            Bulk Actions ({selectedRows.length})
          </Button>
          <Menu
            anchorEl={bulkMenuAnchor}
            open={Boolean(bulkMenuAnchor)}
            onClose={() => setBulkMenuAnchor(null)}
          >
            <MenuItem onClick={() => handleBulkUpdate('active')}>
              <ListItemIcon>
                <CheckCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Activate Selected</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleBulkUpdate('inactive')}>
              <ListItemIcon>
                <CancelIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Deactivate Selected</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      )}

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".xlsx,.xls"
        onChange={handleImport}
      />

      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredAccounts}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={(newSelection) => {
                setSelectedRows(newSelection);
              }}
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <AccountDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        account={selectedAccount}
      />

      <Dialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Import Accounts</DialogTitle>
        <DialogContent>
          {importError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {importError}
            </Alert>
          )}
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Please upload an Excel file (.xlsx) with the following columns:
            code, name, type, category, balance, status
          </Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadIcon />}
            fullWidth
          >
            Choose File
            <input
              type="file"
              hidden
              accept=".xlsx,.xls"
              onChange={handleImport}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 