import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import api from '../../api/Api';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const GoogleSignIn = ({ setError, setLoading }) => {
  const navigate = useNavigate();
  const handleSuccess = async (response) => {
    console.log('Login success:', response);
    setLoading(true);
    try {
      const res = await api.post('/api/user-auth/google/', {
        access_token: response.credential,
        id_token: response.credential,
      });
      console.log('Login success:', res.data);
      navigate('/home', { replace: true });
    } catch (error) {
      console.error('Error Logging in using google', error);
      const data = error.response.data;
      if (
        data.non_field_errors &&
        data.non_field_errors.includes(
          'User is already registered with this e-mail address.'
        )
      ) {
        setError('User is already registered with this e-mail address.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
    setLoading(false);
  };

  const handleFailure = (error) => {
    console.error('Login failed:', error);
  };

  return (
    <GoogleOAuthProvider clientId="104626412310-ted5n6vm5tp3ds91ae7rojv7t4bcvjog.apps.googleusercontent.com">
      <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
    </GoogleOAuthProvider>
  );
};

export default GoogleSignIn;
