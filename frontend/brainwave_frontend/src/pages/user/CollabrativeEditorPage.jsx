import CollaborativeEditorContainer from '../../components/user/collab_editor/CollaborativeEditorContainer';
import { CollabEditorProvider } from '../../context/CollabEditorContext';
import NavBar from '../../components/user/common/NavBar';
import ProtectedRoute from '../../routes/ProtectedRoute';

function CollabrativeEditor() {
  return (
    <ProtectedRoute>
      <CollabEditorProvider>
        <div className="bg-background-pattern bg-repeat-y bg-center w-screen min-h-screen dark:text-white dark:bg-dark-100">
          <NavBar />
          <CollaborativeEditorContainer />
        </div>
      </CollabEditorProvider>
    </ProtectedRoute>
  );
}

export default CollabrativeEditor;
