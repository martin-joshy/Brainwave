import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import user_api from '../../../../api/UserApi';

// Async thunk to fetch shared notebooks
export const fetchSharedNotebooks = createAsyncThunk(
  'sharedNotebooks/fetchSharedNotebooks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await user_api.get(
        '/api/collab-editor/shared-notebooks/'
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeUserFromNotebook = createAsyncThunk(
  'sharedNotebooks/removeUserFromNotebook',
  async ({ notebook_id }, { rejectWithValue }) => {
    try {
      const response = await user_api.post('/api/collab-editor/remove-user/', {
        notebook_id,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const sharedNotebooksSlice = createSlice({
  name: 'sharedNotebooks',
  initialState: {
    notebooks: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSharedNotebooks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSharedNotebooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notebooks = action.payload;
      })
      .addCase(fetchSharedNotebooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeUserFromNotebook.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeUserFromNotebook.fulfilled, (state) => {
        state.status = 'succeeded';
        console.log('Notebook removed successfully');
      })
      .addCase(removeUserFromNotebook.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default sharedNotebooksSlice.reducer;
