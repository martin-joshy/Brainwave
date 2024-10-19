import ProtectedRoute from '../../routes/ProtectedRoute';
import NavBar from '../../components/user/common/NavBar';
import ProfileSection from '../../components/user/profile/ProfileSection';

function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="bg-background-pattern bg-repeat-y bg-center w-screen min-h-screen dark:text-white dark:bg-dark-100">
        <NavBar />
        <ProfileSection />
      </div>
    </ProtectedRoute>
  );
}

export default ProfilePage;
