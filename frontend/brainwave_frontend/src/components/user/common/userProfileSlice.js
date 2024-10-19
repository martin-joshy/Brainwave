import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import user_api from '../../../api/UserApi';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await user_api.get('api/user-auth/user-profile/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadCroppedAvatar = createAsyncThunk(
  'user/uploadCroppedAvatar',
  async ({ imageBlob, croppingRect }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', imageBlob, 'cropped-image.png');
      formData.append('croppingRect', JSON.stringify(croppingRect));

      const response = await user_api.post(
        'api/user-auth/upload-cropped-image/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await user_api.patch(
        'api/user-auth/user-profile/',
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    user: null,
    userInfoIsLoading: false,
    formStatus: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.userInfoIsLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.userInfoIsLoading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.userInfoIsLoading = false;
      })
      .addCase(uploadCroppedAvatar.fulfilled, (state, action) => {
        if (state.user) {
          console.log('before', state.user);
          state.user.profile.avatar = action.payload.fileUrl;
          console.log('after', state.user);
        }
      })
      .addCase(uploadCroppedAvatar.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.formStatus = 'loading';
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.formStatus = 'success';
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.formIsSubmitting = false;
      });
  },
});

export default userProfileSlice.reducer;
