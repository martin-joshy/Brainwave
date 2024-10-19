import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { grey } from '@mui/material/colors';

import ShareForm from './ShareForm';
import ListUsers from './ListUsers';
import SnackbarComponent from '../../common/SnackbarComponent';

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //   State and funtion to handle the tabs
  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <SendRoundedIcon sx={{ color: grey[700] }} />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Sharing With" value="1" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <ShareForm />
            <ListUsers />
          </TabPanel>
        </TabContext>
      </Menu>

      <SnackbarComponent />
    </div>
  );
}
