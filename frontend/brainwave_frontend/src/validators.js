import api from './api/Api';

export const validatePassword = async (password) => {
  if (password !== '') {
    try {
      const response = await api.post('api/user-auth/validate-password/', {
        password: password,
      });
      return response.data.detail || null;
    } catch (error) {
      console.error('Error validating password:', error);
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
};

export const validateUsername = async (username) => {
  try {
    const response = await api.post('api/user-auth/validate-username/', {
      username: username,
    });
    if (response.data.is_available) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error validating username:', error);
    throw new Error('An unexpected error occurred. Please try again later.');
  }
};
