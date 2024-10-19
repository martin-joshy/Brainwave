import { useEffect, useState, useRef, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, updateUser } from './userSlice';
import {
  Card,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from '@mui/material';

const UserManagementGrid = () => {
  const dispatch = useDispatch();
  const { users, status } = useSelector((state) => state.users);
  const [snackbar, setSnackbar] = useState(null);
  const [promiseArguments, setPromiseArguments] = useState(null);
  const noButtonRef = useRef(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const handleCloseSnackbar = () => setSnackbar(null);

  const validateRow = (row) => {
    if (row.first_name.length > 150) {
      throw new Error('The maximum character allowed for First Name is 150');
    }
    if (row.last_name.length > 150) {
      throw new Error('The maximum character allowed for Last Name is 150');
    }
  };

  const processRowUpdate = useCallback(
    (updatedRow, originalRow) =>
      new Promise((resolve, reject) => {
        try {
          validateRow(updatedRow);
          const mutation = computeMutation(updatedRow, originalRow);
          if (mutation) {
            setPromiseArguments({ resolve, reject, updatedRow, originalRow });
          } else {
            resolve(originalRow);
          }
        } catch (error) {
          setSnackbar({ children: error.message, severity: 'error' });
          reject(originalRow);
        }
      }),
    []
  );

  const handleYes = async () => {
    const { updatedRow, originalRow, resolve, reject } = promiseArguments;

    try {
      await dispatch(
        updateUser({ id: updatedRow.id, data: updatedRow })
      ).unwrap();
      setSnackbar({
        children: 'User successfully updated',
        severity: 'success',
      });
      resolve(updatedRow);
      setPromiseArguments(null);
    } catch (error) {
      setSnackbar({ children: 'Failed to update user', severity: 'error' });
      reject(originalRow);
      setPromiseArguments(null);
    }
  };

  const handleNo = () => {
    const { originalRow, resolve } = promiseArguments;
    resolve(originalRow);
    setPromiseArguments(null);
  };

  const renderConfirmDialog = () => {
    if (!promiseArguments) {
      return null;
    }

    const { updatedRow, originalRow } = promiseArguments;
    const mutation = computeMutation(updatedRow, originalRow);

    return (
      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: () => noButtonRef.current?.focus() }}
        open={!!promiseArguments}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent
          dividers
        >{`Pressing 'Yes' will change ${mutation}.`}</DialogContent>
        <DialogActions>
          <Button ref={noButtonRef} onClick={handleNo}>
            No
          </Button>
          <Button onClick={handleYes}>Yes</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const computeMutation = (newRow, oldRow) => {
    if (newRow.first_name !== oldRow.first_name) {
      return `First Name from '${oldRow.first_name}' to '${newRow.first_name}'`;
    }
    if (newRow.last_name !== oldRow.last_name) {
      return `Last Name from '${oldRow.last_name}' to '${newRow.last_name}'`;
    }
    if (newRow.is_active !== oldRow.is_active) {
      return `Active status from '${oldRow.is_active}' to '${newRow.is_active}'`;
    }
    return null;
  };

  return (
    <>
      <Card>
        <h1 className="font-poppins text-gray-200 pl-4">Users</h1>
      </Card>
      <div style={{ height: 400, width: '100%' }}>
        {renderConfirmDialog()}
        <DataGrid
          rows={users}
          columns={columns}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => {
            console.error('Row update error:', error);
            setSnackbar({ children: 'Error updating row', severity: 'error' });
          }}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
        {!!snackbar && (
          <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
      </div>
    </>
  );
};

export default UserManagementGrid;

const columns = [
  {
    field: 'first_name',
    headerName: 'First Name',
    width: 150,
    editable: true,
  },
  { field: 'last_name', headerName: 'Last Name', width: 150, editable: true },
  { field: 'username', headerName: 'Username', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'date_joined', headerName: 'Date Joined', width: 200 },
  {
    field: 'is_active',
    headerName: 'Active',
    width: 100,
    type: 'boolean',
    editable: true,
  },
];
