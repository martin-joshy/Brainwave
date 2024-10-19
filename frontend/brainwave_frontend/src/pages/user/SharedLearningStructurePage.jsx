import ProtectedRoute from '../../routes/ProtectedRoute';
import NavBar from '../../components/user/common/NavBar';
import Container from '@mui/material/Container';
import { TopicsProvider } from '../../context/TopicsContext';
import SharedMultiApp from '../../components/user/SharedMultiApp';

function SharedLearningStructurePage() {
  return (
    <ProtectedRoute>
      <TopicsProvider>
        <div className="bg-background-pattern bg-repeat-y bg-center w-screen min-h-screen dark:text-white dark:bg-dark-100">
          <NavBar />
          <Container maxWidth="lg" className="mt-20">
            <SharedMultiApp />
          </Container>
        </div>
      </TopicsProvider>
    </ProtectedRoute>
  );
}

export default SharedLearningStructurePage;
