import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import vaultService, { VaultEntry } from '../services/vault';

const Dashboard: React.FC = () => {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<VaultEntry | null>(null);
  const [encryptionPassword, setEncryptionPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const data = await vaultService.getEntries();
      setEntries(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch entries');
    }
  };

  const handleCreateEntry = () => {
    setSelectedEntry(null);
    setOpenDialog(true);
  };

  const handleEditEntry = (entry: VaultEntry) => {
    setSelectedEntry(entry);
    setOpenDialog(true);
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await vaultService.deleteEntry(id);
      fetchEntries();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete entry');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedEntry) {
        await vaultService.updateEntry(selectedEntry._id!, {
          title: selectedEntry.title,
          category: selectedEntry.category,
          content: selectedEntry.content,
          visibility: selectedEntry.visibility,
          autoDeleteDate: selectedEntry.autoDeleteDate,
          unlockAfter: selectedEntry.unlockAfter
        }, encryptionPassword);
      } else {
        await vaultService.createEntry({
          title: '',
          category: 'Notes',
          content: '',
          visibility: 'Private',
          autoDeleteDate: undefined,
          unlockAfter: undefined
        }, encryptionPassword);
      }
      setOpenDialog(false);
      fetchEntries();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save entry');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Vault</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateEntry}
        >
          New Entry
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {entries.map((entry) => (
          <Grid item xs={12} sm={6} md={4} key={entry._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{entry.title}</Typography>
                <Typography color="textSecondary" gutterBottom>
                  {entry.category}
                </Typography>
                <Typography variant="body2">
                  Visibility: {entry.visibility}
                </Typography>
                {entry.autoDeleteDate && (
                  <Typography variant="body2" color="error">
                    Auto-delete: {new Date(entry.autoDeleteDate).toLocaleDateString()}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEditEntry(entry)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteEntry(entry._id!)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{selectedEntry ? 'Edit Entry' : 'New Entry'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              margin="normal"
              value={selectedEntry?.title || ''}
              onChange={(e) => setSelectedEntry({ ...selectedEntry!, title: e.target.value })}
              required
            />
            <TextField
              label="Category"
              select
              fullWidth
              margin="normal"
              value={selectedEntry?.category || 'Notes'}
              onChange={(e) => setSelectedEntry({ ...selectedEntry!, category: e.target.value as any })}
              required
            >
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Health">Health</MenuItem>
              <MenuItem value="Personal">Personal</MenuItem>
              <MenuItem value="Notes">Notes</MenuItem>
            </TextField>
            <TextField
              label="Content"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={selectedEntry?.content || ''}
              onChange={(e) => setSelectedEntry({ ...selectedEntry!, content: e.target.value })}
              required
            />
            <TextField
              label="Visibility"
              select
              fullWidth
              margin="normal"
              value={selectedEntry?.visibility || 'Private'}
              onChange={(e) => setSelectedEntry({ ...selectedEntry!, visibility: e.target.value as any })}
              required
            >
              <MenuItem value="Private">Private</MenuItem>
              <MenuItem value="Shared">Shared</MenuItem>
              <MenuItem value="UnlockAfter">Unlock After Date</MenuItem>
            </TextField>
            {selectedEntry?.visibility === 'UnlockAfter' && (
              <TextField
                label="Unlock After"
                type="datetime-local"
                fullWidth
                margin="normal"
                value={selectedEntry?.unlockAfter || ''}
                onChange={(e) => setSelectedEntry({ ...selectedEntry!, unlockAfter: new Date(e.target.value) })}
                InputLabelProps={{ shrink: true }}
              />
            )}
            <TextField
              label="Auto-delete Date"
              type="datetime-local"
              fullWidth
              margin="normal"
              value={selectedEntry?.autoDeleteDate || ''}
              onChange={(e) => setSelectedEntry({ ...selectedEntry!, autoDeleteDate: new Date(e.target.value) })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Encryption Password"
              type="password"
              fullWidth
              margin="normal"
              value={encryptionPassword}
              onChange={(e) => setEncryptionPassword(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 