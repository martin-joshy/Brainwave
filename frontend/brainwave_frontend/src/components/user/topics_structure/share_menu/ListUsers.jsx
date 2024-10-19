import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSharedUsers, updateUserPermission } from './sharingUsersSlice';
import SharedUser from './SharedUser';

function ListUsers() {
  const domain = import.meta.env.VITE_API_URL;
  const { notebookId } = useParams();
  const dispatch = useDispatch();
  const { sharedUsers, status } = useSelector((state) => state.sharingUsers);

  useEffect(() => {
    if (status.fetchSharedUsers === 'idle') {
      dispatch(fetchSharedUsers(notebookId));
    }
  }, [dispatch]);

  const handleChange = (user) => (event, newValue) => {
    dispatch(
      updateUserPermission({
        username: user.username,
        permissionType: newValue,
        notebookId,
      })
    );
  };

  return (
    <div className="w-full mt-3 ">
      {status.fetchSharedUsers === 'pending' && <div>Loading...</div>}
      {status.fetchSharedUsers === 'rejected' && (
        <div>Error in Displaying users. Please try again</div>
      )}
      {status.fetchSharedUsers === 'fulfilled' && sharedUsers.length === 0 ? (
        <div> No shared users</div>
      ) : (
        sharedUsers.map((user) => (
          <SharedUser
            key={user.username}
            user={user}
            domain={domain}
            notebookId={notebookId}
            handleChange={handleChange}
          />
        ))
      )}
    </div>
  );
}

export default ListUsers;
