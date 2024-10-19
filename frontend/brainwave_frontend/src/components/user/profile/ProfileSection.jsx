import { Avatar } from '@mui/material';
import ProfileForm from './ProfileForm';
import { fetchUserProfile } from '../common/userProfileSlice';
import { Badge } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { IconButton } from '@mui/material';
import { ModalClose, Modal, Sheet, Typography } from '@mui/joy';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CropAndSetAvatar from './CropAndSetAvatar';

function ProfileSection() {
  const dispatch = useDispatch();
  const { user, userInfoIsLoading, error } = useSelector(
    (state) => state.userProfile
  );
  const domain = import.meta.env.VITE_API_URL;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div className="w-full h-screen pt-20">
      <Tabs aria-label="Vertical tabs" orientation="vertical" className="pt-4 ">
        <TabList className="w-1/4 h-screen gap-2 ">
          <Tab className="h-14">
            <AccountBoxRoundedIcon sx={{ color: '#000000' }} />
            Profile
          </Tab>
          <Tab className="h-14">
            <SettingsRoundedIcon sx={{ color: '#000000' }} /> Settings
          </Tab>
        </TabList>
        <TabPanel value={0}>
          <div className=" w-3/4 h-full p-8">
            <div className=" h-fit bg-white p-8 rounded-lg border-solid border border-slate-200">
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton
                    aria-label="edit"
                    size="small"
                    color="primary"
                    onClick={() => setOpen(true)}
                  >
                    <EditOutlinedIcon sx={{ color: '#000000' }} />
                  </IconButton>
                }
              >
                <Avatar
                  alt={user?.username ? user.username : 'Username'}
                  src={
                    user?.profile?.avatar
                      ? domain + user.profile.avatar
                      : undefined
                  }
                  sx={{ width: 130, height: 130 }}
                />
              </Badge>
              <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={open}
                onClose={() => setOpen(false)}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Sheet
                  variant="outlined"
                  sx={{
                    maxWidth: 500,
                    borderRadius: 'md',
                    p: 3,
                    boxShadow: 'lg',
                  }}
                >
                  <ModalClose variant="plain" sx={{ m: 1 }} />
                  <Typography
                    component="h2"
                    id="modal-title"
                    level="h4"
                    textColor="inherit"
                    fontWeight="lg"
                    mb={1}
                  >
                    Choose Profile Picture
                  </Typography>
                  <Typography id="modal-desc" textColor="text.tertiary">
                    <CropAndSetAvatar setOpen={setOpen} />
                  </Typography>
                </Sheet>
              </Modal>

              <ProfileForm />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={1}>
          <b>Settings</b> tab panel
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default ProfileSection;
