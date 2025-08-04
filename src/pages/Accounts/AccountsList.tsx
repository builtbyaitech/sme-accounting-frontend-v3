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
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [accounts] = useState<Account[]>(mockAccounts);

  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.code.includes(searchQuery)
  );

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
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => console.log('Add account')}
          >
            Add Account
          </Button>
        </Box>
      </Box>

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

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredAccounts.map((account) => (
              <Card key={account.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6">{account.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {account.code} - {account.type} - {account.category}
                      </Typography>
                      <Typography variant="h6" color={account.type === 'Asset' ? 'error.main' : 'success.main'}>
                        ${account.balance.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={account.status}
                        color={account.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}; 