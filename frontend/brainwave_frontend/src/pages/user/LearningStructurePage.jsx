import MultiApp from '../../components/user/topics_structure/MultiApp';
import ProtectedRoute from '../../routes/ProtectedRoute';
import NavBar from '../../components/user/common/NavBar';
import Container from '@mui/material/Container';
import { TopicsProvider } from '../../context/TopicsContext';

function LearningStructurePage() {
  return (
    <ProtectedRoute>
      <TopicsProvider>
        <div className="bg-background-pattern bg-repeat-y bg-center w-screen min-h-screen dark:text-white dark:bg-dark-100">
          <NavBar />
          <Container maxWidth="lg" className="mt-20">
            <MultiApp withApi={true} />
          </Container>
        </div>
      </TopicsProvider>
    </ProtectedRoute>
  );
}

export default LearningStructurePage;
