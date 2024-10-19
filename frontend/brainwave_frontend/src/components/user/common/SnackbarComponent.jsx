import { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage } from '../../user/topics_structure/share_menu/sharingUsersSlice';

function SnackbarComponent() {
  const dispatch = useDispatch();
  const { success, error } = useSelector((state) => state.sharingUsers.message);
  const message = success || error;
  const severity = success ? 'success' : 'error';
  const [open, setOpen] = useState(!!message);

  const handleClose = () => {
    setOpen(false);
    dispatch(clearMessage());
  };

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        variant="filled"
        severity={severity}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default SnackbarComponent;
