/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { grey } from '@mui/material/colors';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';

import { addFavorite } from './favorites/favoritesSlice';
import { deleteNotebook } from './notebooks/notebooksSlice';

function MenuList({ notebook }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const notebookId = notebook.notebook_id;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFavoriteClick = () => {
    dispatch(addFavorite({ notebookId, favorite: true }));
    handleClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleClose();
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteNotebook(notebookId));
    setDeleteDialogOpen(false);
  };

  return (
    <div>
      <MoreHorizIcon
        sx={{ color: grey[50] }}
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      />

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem disableGutters className="pr-4" onClick={handleDeleteClick}>
          <ListItemIcon className="pl-2">
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontSize={12} fontStyle="poppins">
              Delete
            </Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem disableGutters>
          <ListItemIcon className="pl-2">
            <ShareOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontSize={12} fontStyle="poppins">
              Share
            </Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem disableGutters>
          <ListItemIcon className="pl-2">
            <StarOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography
              variant="body2"
              fontSize={12}
              fontStyle="poppins"
              onClick={handleFavoriteClick}
              className="pr-2"
            >
              Favourite
            </Typography>
          </ListItemText>
        </MenuItem>
        {/* <MenuItem disableGutters>
          <ListItemIcon className="pl-2">
            <PlaylistAddRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontSize={12} fontStyle="poppins">
              Add to <span className="block pr-2">Collection</span>
            </Typography>
          </ListItemText>
        </MenuItem> */}
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm your action</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the notebook titled "
            {notebook.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MenuList;
