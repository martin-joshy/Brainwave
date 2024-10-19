import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api_user from '../../../../api/UserApi';

// Thunk for fetching shared users
export const fetchSharedUsers = createAsyncThunk(
  'sharedNotebooks/fetchSharedUsers',
  async (notebook_id, { rejectWithValue }) => {
    try {
      const response = await api_user.get(
        `/api/notebooks/${notebook_id}/shared-users/`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Thunk for sharing a notebook with a user
export const shareNotebook = createAsyncThunk(
  'sharedNotebooks/shareNotebook',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api_user.post(
        `/api/notebooks/${data.notebook_id}/share/`,
        data
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Thunk for updating user permissions
export const updatePermission = createAsyncThunk(
  'sharedNotebooks/updatePermission',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api_user.patch(
        `/api/notebooks/${data.notebook_id}/update-permission/`,
        data
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Thunk for removing a user from the shared list
export const removeUser = createAsyncThunk(
  'sharedNotebooks/removeUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api_user.delete(
        `/api/notebooks/${data.notebook_id}/remove-user/${data.userId}/`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Redux slice
const sharedNotebookSlice = createSlice({
  name: 'sharedNotebooks',
  initialState: {
    sharedUsers: [],
    loading: false,
    error: null,
    notebook_id: null, // Optionally store the current notebook_id if needed
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch shared users
      .addCase(fetchSharedUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSharedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.sharedUsers = action.payload;
      })
      .addCase(fetchSharedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // Share notebook
      .addCase(shareNotebook.pending, (state) => {
        state.loading = true;
      })
      .addCase(shareNotebook.fulfilled, (state, action) => {
        state.loading = false;
        state.sharedUsers.push(action.payload);
      })
      .addCase(shareNotebook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // Update permission
      .addCase(updatePermission.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePermission.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.sharedUsers.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.sharedUsers[index].permission = action.payload.permission;
        }
      })
      .addCase(updatePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // Remove user
      .addCase(removeUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.loading = false;
        state.sharedUsers = state.sharedUsers.filter(
          (user) => user.id !== action.meta.arg.userId
        );
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      });
  },
});

// Optionally export selectors if needed
export const selectSharedUsers = (state) => state.sharedNotebooks.sharedUsers;
export const selectLoading = (state) => state.sharedNotebooks.loading;
export const selectError = (state) => state.sharedNotebooks.error;

export default sharedNotebookSlice.reducer;
