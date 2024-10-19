import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import user_api from '../../../../api/UserApi';

export const fetchFavoriteNotebooks = createAsyncThunk(
  'notebooks/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await user_api.get(
        'api/notebook-manage/notebooks/favorites/'
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'notebooks/removeFavorite',
  async ({ notebookId, favorite }, { rejectWithValue }) => {
    try {
      const response = await user_api.put(
        `/api/notebook-manage/notebooks/${notebookId}/favorite/`,
        { favorite }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addFavorite = createAsyncThunk(
  'notebooks/addFavorite',
  async ({ notebookId, favorite }, { rejectWithValue }) => {
    try {
      const response = await user_api.put(
        `/api/notebook-manage/notebooks/${notebookId}/favorite/`,
        { favorite }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    favorites: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteNotebooks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFavoriteNotebooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.favorites = action.payload;
      })
      .addCase(fetchFavoriteNotebooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        const RemovedNotebook = action.payload;
        state.favorites = state.favorites.filter(
          (notebook) => notebook.notebook_id !== RemovedNotebook.notebook_id
        );
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        const addedNotebook = action.payload;
        const exists = state.favorites.some(
          (notebook) => notebook.notebook_id === addedNotebook.notebook_id
        );

        if (!exists) {
          state.favorites = [addedNotebook, ...state.favorites];
        }
      });
  },
});

export default favoritesSlice.reducer;
