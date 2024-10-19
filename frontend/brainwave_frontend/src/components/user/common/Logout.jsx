import { Navigate } from 'react-router-dom';

function Logout() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');

  return <Navigate to="/login" />;
}

export default Logout;
