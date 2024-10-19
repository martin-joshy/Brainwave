/* eslint-disable react/prop-types */
import { LiveblocksProvider, RoomProvider } from '@liveblocks/react/suspense';

import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import user_api from '../../../api/UserApi';
import { CollabEditorContext } from '../../../context/CollabEditorContext';
import Room from './Room';

export default function CollaborativeEditorContainer() {
  const { notebookRoomId, subtopicId } = useParams();
  const { setNotebookRoomId, setSubtopicId } = useContext(CollabEditorContext);

  useEffect(() => {
    setNotebookRoomId(notebookRoomId);
    setSubtopicId(subtopicId);
  }, [notebookRoomId, subtopicId, setNotebookRoomId, setSubtopicId]);

  const obtain_token = async () => {
    try {
      const response = await user_api.post('api/collab-editor/identify-user/');
      return response.data;
    } catch (error) {
      console.error('Error fetching token:', error);
      return null;
    }
  };

  const fetchUserDetails = async (users) => {
    const userIds = users.userIds;

    try {
      const response = await user_api.post('/api/collab-editor/resolve-user/', {
        userIds,
      });
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching user details:',
        error.response ? error.response.data : error.message
      );
    }
  };

  const fetchAllUsers = async ({ text, roomId }) => {
    console.log(roomId);
    try {
      const response = await user_api.post(
        `/api/collab-editor/resolve-room-users/`,
        {
          roomId: roomId,
        }
      );
      let users = response.data;

      if (text) {
        users = users.filter((username) => username.includes(text));
      }

      console.log(users);
      console.log(text);
      return users;
    } catch (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
  };

  return (
    <LiveblocksProvider
      authEndpoint={obtain_token}
      resolveUsers={fetchUserDetails}
      resolveMentionSuggestions={fetchAllUsers}
    >
      <RoomProvider id={notebookRoomId}>
        <Room />
      </RoomProvider>
    </LiveblocksProvider>
  );
}
