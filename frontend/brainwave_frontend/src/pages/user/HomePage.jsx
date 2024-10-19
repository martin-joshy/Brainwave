import Home from '../../components/user/home/Home';
import ProtectedRoute from '../../routes/ProtectedRoute';

function HomePage() {
  // eslint-disable-next-line react/no-children-prop
  return (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  );
}

export default HomePage;
