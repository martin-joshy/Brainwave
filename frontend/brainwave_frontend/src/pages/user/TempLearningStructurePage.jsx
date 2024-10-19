import MultiApp from '../../components/user/topics_structure/MultiApp';
import ProtectedRoute from '../../routes/ProtectedRoute';
import NavBar from '../../components/user/common/NavBar';
import { TopicsProvider } from '../../context/TopicsContext';

function TempLearningStructure() {
  return (
    <ProtectedRoute>
      <TopicsProvider>
        <div className="bg-background-pattern bg-repeat-y bg-center w-screen min-h-screen dark:text-white dark:bg-dark-100">
          <NavBar />
          <MultiApp withApi={false} />
        </div>
      </TopicsProvider>
    </ProtectedRoute>
  );
}

export default TempLearningStructure;
