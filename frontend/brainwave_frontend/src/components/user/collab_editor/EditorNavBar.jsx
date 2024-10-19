import { useEffect, useState } from 'react';

import { useLocation, Link as RouterLink } from 'react-router-dom';

import { useOthers } from '@liveblocks/react/suspense';

import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Link from '@mui/material/Link';

function EditorNavBar() {
  const [notebookId, setNotebookId] = useState('');
  const [currentPageTitle, setCurrentPageTitle] = useState('');
  const [prevPageTitle, setPrevPageTitle] = useState('');
  const location = useLocation();
  const others = useOthers();
  const domain = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (location.state) {
      setNotebookId(location.state.notebookId);
      setCurrentPageTitle(location.state.subtopic_title);
      setPrevPageTitle(location.state.notebook_title);
    }
  }, [location.state, notebookId, currentPageTitle, prevPageTitle]);

  const handleClick = (event) => {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  };

  return (
    <div
      role="presentation"
      onClick={handleClick}
      className="m-3 flex justify-between items-center"
    >
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to={`/notebook/learning-structure/${notebookId}`}
        >
          {prevPageTitle}
        </Link>
        <Typography color="text.primary">{currentPageTitle}</Typography>
      </Breadcrumbs>
      <AvatarGroup max={4}>
        {others.map((user) => (
          <Avatar
            key={user.connectionId}
            alt={user.info.username}
            src={domain + user.info.avatar}
            sx={{ bgcolor: user.info.color }}
          />
        ))}
      </AvatarGroup>
    </div>
  );
}

export default EditorNavBar;
