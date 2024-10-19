import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import user_api from '../../../../api/UserApi';

export const fetchNotebooks = createAsyncThunk(
  'notebooks/fetchAllNotebooks',
  async () => {
    const response = await user_api.get('api/notebook-manage/notebooks/list/');
    return response.data;
  }
);

export const deleteNotebook = createAsyncThunk(
  'notebooks/deleteNotebook',
  async (notebookId) => {
    await user_api.delete(
      `api/notebook-manage/notebooks/${notebookId}/delete/`
    );
    return notebookId;
  }
);

const notebooksSlice = createSlice({
  name: 'notebooks',
  initialState: {
    notebooks: [],
    status: 'idle',
    error: null,
    sortBy: 'newest',
  },
  reducers: {
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotebooks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotebooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notebooks = action.payload;
      })
      .addCase(fetchNotebooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteNotebook.fulfilled, (state, action) => {
        state.notebooks = state.notebooks.filter(
          (notebook) => notebook.notebook_id !== action.payload
        );
      });
  },
});

export const { setSortBy } = notebooksSlice.actions;

export default notebooksSlice.reducer;
