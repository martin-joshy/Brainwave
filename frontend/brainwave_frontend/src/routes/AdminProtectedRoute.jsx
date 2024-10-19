import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api/Api';
import { ADMIN_ACCESS_TOKEN, ADMIN_REFRESH_TOKEN } from '../constants';
import { useState, useEffect } from 'react';

import LoadingIndicator from '../components/common/LoadingIndicator';

// eslint-disable-next-line react/prop-types
function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(ADMIN_REFRESH_TOKEN);
    try {
      const res = await api.post('/api/user_auth/token/refresh/', {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ADMIN_ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ADMIN_ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <LoadingIndicator />
      </div>
    );
  }

  return isAuthorized ? children : <Navigate to="/login" replace={true} />;
}

export default ProtectedRoute;
