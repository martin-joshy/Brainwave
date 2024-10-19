import React from 'react';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Divider from '@mui/joy/Divider';
import Button from '@mui/joy/Button';

import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { updateUserPermission } from './sharingUsersSlice';

function ShareForm() {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.sharingUsers);
  const { notebookId } = useParams();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username');
    const permission = formData.get('permission_level');
    const data = {
      username,
      permissionType: permission,
      notebookId: notebookId,
    };

    dispatch(updateUserPermission(data));
    event.currentTarget.reset();
  };
  return (
    <form className="flex flex-row gap-1" onSubmit={handleSubmit}>
      <Input
        placeholder="Username"
        name="username"
        required
        endDecorator={
          <React.Fragment>
            <Divider orientation="vertical" />
            <Select
              variant="plain"
              name="permission_level"
              defaultValue="write"
              required
              slotProps={{
                listbox: {
                  variant: 'outlined',
                  sx: { zIndex: 1300 },
                },
              }}
              sx={{ mr: -1.5, '&:hover': { bgcolor: 'transparent' } }}
            >
              <Option value="read">Read Only</Option>
              <Option value="write">Write</Option>
            </Select>
          </React.Fragment>
        }
        sx={{ width: 300 }}
      />
      <Button
        type="submit"
        size="small"
        loading={status.updateUserPermission === 'pending'}
      >
        Share
      </Button>
    </form>
  );
}

export default ShareForm;
