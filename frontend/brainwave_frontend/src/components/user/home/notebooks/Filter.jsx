import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import Typography from '@mui/material/Typography';
import { setSortBy } from './notebooksSlice';

function Filter() {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (criteria) => {
    dispatch(setSortBy(criteria));
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-controls={open ? 'filter-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <FilterListIcon />
      </IconButton>

      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'filter-button',
        }}
      >
        <MenuItem onClick={() => handleSortChange('a-z')}>
          <Typography variant="body2">Alphabetical A-Z</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('z-a')}>
          <Typography variant="body2">Alphabetical Z-A</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('newest')}>
          <Typography variant="body2">Newest First</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('oldest')}>
          <Typography variant="body2">Oldest First</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default Filter;
