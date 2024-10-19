import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import admin_api from '../../../api/AdminApi';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await admin_api.get('api/admin/user-manage/user/');
  return response.data;
});

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }) => {
    const response = await admin_api.put(
      `api/admin/user-manage/user/${id}/update/`,
      data
    );
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        console.log('updateUser', action.payload);
      });
  },
});

export default userSlice.reducer;
