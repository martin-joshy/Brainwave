import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import { Avatar } from '@mui/joy';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Skeleton } from '@mui/joy';

import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../common/userProfileSlice';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function TestComponent() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [theme, setTheme] = React.useState(
    localStorage.getItem('theme') || 'system'
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, userInfoIsLoading, error } = useSelector(
    (state) => state.userProfile
  );
  const domain = import.meta.env.VITE_API_URL;

  React.useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  React.useEffect(() => {
    const root = window.document.documentElement;
    const initialThemeValue = localStorage.getItem('theme') || 'system';
    if (
      initialThemeValue === 'dark' ||
      (initialThemeValue === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleProfileRedirect = () => {
    navigate('/user/profile');
  };

  const toggleTheme = () => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  return (
    <AppBar position="fixed" className="bg-primary-100 dark:bg-dark-200">
      <Container maxWidth="xl" className="bg-primary-100 dark:bg-dark-200">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <img src="/logo_navbar.png" />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
            <img src="/logo_navbar.png" />
          </Box>
          <Box
            className="flex items-center justify-center"
            sx={{
              flexGrow: 1,
              display: {
                xs: 'none',
                md: 'flex',
              },
            }}
          >
            <Button
              onClick={() => navigate('/home')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              HOME
            </Button>
          </Box>

          <Box className="flex w-20 justify-between items-center">
            <div>
              <Tooltip title="Toggle Theme">
                <IconButton onClick={toggleTheme} sx={{ p: 0 }}>
                  {theme === 'dark' ? (
                    <Brightness7Icon className="text-white" />
                  ) : (
                    <Brightness4Icon />
                  )}
                </IconButton>
              </Tooltip>
            </div>
            <div>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {userInfoIsLoading ? (
                    <Skeleton variant="circular" width={40} height={40} />
                  ) : (
                    <Avatar
                      alt={user?.username || 'User'}
                      src={
                        user?.profile?.avatar
                          ? domain + user.profile.avatar
                          : undefined
                      }
                      sx={{ bgcolor: user?.profile?.color || '#DC3132' }}
                    />
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleProfileRedirect}>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate('/logout')}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </div>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default TestComponent;
