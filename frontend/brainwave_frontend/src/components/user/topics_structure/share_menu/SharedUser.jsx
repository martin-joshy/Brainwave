/* eslint-disable react/prop-types */
import Avatar from '@mui/joy/Avatar';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';

const SharedUser = ({ user, domain, handleChange }) => {
  const [defaultPermission, setDefaultPermission] = useState(
    user.permission_type === 'admin' ? 'write' : 'read'
  );
  return (
    <div
      key={user.username}
      className="flex flex-row justify-between w-full mt-3 items-center"
    >
      <Avatar
        className="place-self-start"
        alt={user.username}
        src={user?.profile?.avatar ? domain + user.profile.avatar : undefined}
        sx={{ bgcolor: user?.profile?.color || '#DC3132' }}
        size="sm"
      />
      <div className=" w-56">{user.username}</div>
      <div className="flex w-14 ">
        <Select
          indicator={<KeyboardArrowDown />}
          defaultValue={defaultPermission}
          onChange={handleChange(user)}
          slotProps={{
            listbox: {
              variant: 'outlined',
              sx: { zIndex: 1300 },
            },
          }}
          size="sm"
          sx={{
            fontSize: '0.7rem',
            [`& .${selectClasses.indicator}`]: {
              transition: '0.2s',
              [`&.${selectClasses.expanded}`]: {
                transform: 'rotate(-180deg)',
              },
            },
          }}
        >
          <Option value="read">Read Only</Option>
          <Option value="write">Write</Option>
          <Option value="null">Remove</Option>
        </Select>
      </div>
    </div>
  );
};

export default SharedUser;
