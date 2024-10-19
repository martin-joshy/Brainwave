import { useNavigate } from 'react-router-dom';

function AdminLogout() {
  localStorage.removeItem('admin_access');
  localStorage.removeItem('admin_refresh');

  const navigate = useNavigate();

  return navigate('/login');
}

export default AdminLogout;
