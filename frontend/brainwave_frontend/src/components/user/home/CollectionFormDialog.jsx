import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from '@mui/material';
import Select from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import { grey } from '@mui/material/colors';

function AddToCollectionDialog() {
  const [open, setOpen] = React.useState(false);
  const [selectedCollection, setSelectedCollection] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCollectionChange = (event) => {
    setSelectedCollection(event.target.value);
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
        sx={{ color: grey[800] }}
      >
        Add to Collection
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '16px',
          },
        }}
      >
        <DialogTitle
          className="font-poppins"
          sx={{ fontSize: '18px', fontWeight: 'bold' }}
        >
          Add to Collection
        </DialogTitle>
        <DialogContent>
          <Select
            value={selectedCollection}
            onChange={handleCollectionChange}
            displayEmpty
            fullWidth
            sx={{
              marginTop: '8px',
              marginBottom: '16px',
            }}
          >
            <MenuItem value="" disabled>
              Select a Collection
            </MenuItem>
            <MenuItem value="Nano Technology">Nano Technology</MenuItem>
            <MenuItem value="Artificial Intelligence">
              Artificial Intelligence
            </MenuItem>
            <MenuItem value="Machine Learning">Machine Learning</MenuItem>
          </Select>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            fullWidth
            sx={{
              textTransform: 'none',
              borderColor: grey[400],
              color: grey[700],
              justifyContent: 'flex-start',
            }}
          >
            Create new collection
          </Button>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button onClick={handleClose} sx={{ color: grey[600] }}>
            Cancel
          </Button>
          <Button
            onClick={handleClose}
            variant="contained"
            color="primary"
            sx={{ borderRadius: '20px' }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default AddToCollectionDialog;
