import AdminProtectedRoute from '../../routes/AdminProtectedRoute';
import AdminHome from '../../components/admin/common/AdminHome';
import Test from '../../components/admin/user_table/Test';

function AdminHomePage() {
  return (
    <AdminProtectedRoute>
      <AdminHome>
        <Test />
      </AdminHome>
    </AdminProtectedRoute>
  );
}

export default AdminHomePage;
