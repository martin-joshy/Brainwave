import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSharedUsers,
  updatePermission,
  removeUser,
} from './sharedNotebookSlice';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function SharingWithList() {
  const dispatch = useDispatch();
  const { sharedUsers, notebook_id } = useSelector(
    (state) => state.sharedNotebooks
  );

  useEffect(() => {
    dispatch(fetchSharedUsers(notebook_id));
  }, [dispatch, notebook_id]);

  const handlePermissionChange = (userId, newPermission) => {
    dispatch(
      updatePermission({ userId, notebook_id, permission: newPermission })
    );
  };

  const handleRemoveUser = (userId) => {
    dispatch(removeUser({ userId, notebook_id }));
  };

  return (
    <Box>
      <List>
        {sharedUsers.map((user) => (
          <ListItem key={user.id}>
            <ListItemText primary={user.full_name} secondary={user.username} />
            <FormControl
              variant="outlined"
              sx={{ minWidth: 120, marginRight: 2 }}
            >
              <InputLabel id={`permission-label-${user.id}`}>
                Permission
              </InputLabel>
              <Select
                labelId={`permission-label-${user.id}`}
                value={user.permission}
                onChange={(e) =>
                  handlePermissionChange(user.id, e.target.value)
                }
              >
                <MenuItem value="read">Read</MenuItem>
                <MenuItem value="write">Write</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleRemoveUser(user.id)}
            >
              Remove
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
