import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import RegisterPage from '../pages/user/RegisterPage';
import HomePage from '../pages/user/HomePage';
import LoginPage from '../pages/user/LoginPage';
import PasswordResetConfirmPage from '../pages/user/PasswordResetConfirmPage';
import PasswordResetPage from '../pages/user/PasswordResetPage';
import AdminHomePage from '../pages/admin/AdminHomePage';
import TestPage from '../pages/TestPage';
import TempLearningStructurePage from '../pages/user/TempLearningStructurePage';
import LearningStructurePage from '../pages/user/LearningStructurePage';
import Logout from '../components/user/common/Logout';
import AdminLogout from '../components/admin/common/AdminLogout';
import CollabrativeEditorPage from '../pages/user/CollabrativeEditorPage';
import SharedLearningStructurePage from '../pages/user/SharedLearningStructurePage';
import ProfilePage from '../pages/user/ProfilePage';

const router = createBrowserRouter([
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/login/password-reset',
    element: <PasswordResetPage />,
  },
  {
    path: '/login/new-password/',
    element: <PasswordResetConfirmPage />,
  },
  {
    path: '/admin/home',
    element: <AdminHomePage />,
  },
  {
    path: '/test',
    element: <TestPage />,
  },
  {
    path: '/confirm-learning-structure',
    element: <TempLearningStructurePage />,
  },
  {
    path: '/notebook/learning-structure/:notebookId',
    element: <LearningStructurePage />,
  },
  {
    path: '/logout',
    element: <Logout />,
  },
  {
    path: 'admin/logout',
    element: <AdminLogout />,
  },
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/notebook/collaborative-editor/:notebookRoomId/:subtopicId',
    element: <CollabrativeEditorPage />,
  },
  {
    path: '/notebook/shared-learning-structure/:notebookId',
    element: <SharedLearningStructurePage />,
  },
  {
    path: '/user/profile',
    element: <ProfilePage />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
