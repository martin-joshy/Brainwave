import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import user_api from '../../../../api/UserApi';

export const fetchSharedUsers = createAsyncThunk(
  'sharingUsers/fetchSharedUsers',
  async (notebookId, { rejectWithValue }) => {
    try {
      const response = await user_api.post(
        `/api/collab-editor/users-with-access/`,
        {
          notebook_id: notebookId,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserPermission = createAsyncThunk(
  'sharingUsers/updateUserPermission',
  async ({ username, permissionType, notebookId }, { rejectWithValue }) => {
    try {
      const response = await user_api.post(
        '/api/collab-editor/update-editor-access/',
        {
          username,
          permission_level: permissionType,
          notebook_id: notebookId,
        }
      );
      const data = response.data;
      return { username, permissionType, data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const sharingUsersSlice = createSlice({
  name: 'sharingUsers',
  initialState: {
    sharedUsers: [],
    status: {
      fetchSharedUsers: 'idle',
      updateUserPermission: 'idle',
    },
    message: {
      success: null,
      error: null,
    },
  },
  reducers: {
    clearMessage: (state) => {
      state.message.success = null;
      state.message.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchSharedUsers.pending, (state) => {
        state.status.fetchSharedUsers = 'pending';
      })
      .addCase(fetchSharedUsers.fulfilled, (state, action) => {
        state.status.fetchSharedUsers = 'fulfilled';
        state.sharedUsers = action.payload;
      })
      .addCase(fetchSharedUsers.rejected, (state, action) => {
        state.status.fetchSharedUsers = 'rejected';
        state.message.error = action.payload.error
          ? action.payload.error
          : 'An Error Occured';
      })
      .addCase(updateUserPermission.pending, (state) => {
        state.status.updateUserPermission = 'pending';
      })
      .addCase(updateUserPermission.fulfilled, (state, action) => {
        const { username, permissionType, data } = action.payload;
        if (permissionType === 'null') {
          state.sharedUsers = state.sharedUsers.filter(
            (user) => user.username !== username
          );
        } else {
          state.sharedUsers.push(data);
        }
        state.status.updateUserPermission = 'fulfilled';
      })
      .addCase(updateUserPermission.rejected, (state, action) => {
        state.status.updateUserPermission = 'rejected';
        state.message.error = action.payload.error
          ? action.payload.error
          : 'An Error Occured';
      });
  },
});

export const { clearMessage } = sharingUsersSlice.actions;

export default sharingUsersSlice.reducer;
