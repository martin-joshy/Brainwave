import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from '../components/user/home/favorites/favoritesSlice';
import notebooksReducer from '../components/user/home/notebooks/notebooksSlice';
import userReducer from '../components/admin/user_table/userSlice';
import sharedNotebooksReducer from '../components/user/home/shared/sharedNotebooksSlice';
import sharingUsersReducer from '../components/user/topics_structure/share_menu/sharingUsersSlice';
import userProfileSlice from '../components/user/common/userProfileSlice';

export default configureStore({
  reducer: {
    favorites: favoritesReducer,
    notebooks: notebooksReducer,
    users: userReducer,
    sharedNotebooks: sharedNotebooksReducer,
    sharingUsers: sharingUsersReducer,
    userProfile: userProfileSlice,
  },
});
