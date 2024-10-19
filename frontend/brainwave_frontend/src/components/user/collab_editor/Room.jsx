import { Container } from '@mui/material';
import EditorNavBar from './EditorNavBar';
import Editor from './Editor';
import { ClientSideSuspense } from '@liveblocks/react/suspense';
import { Skeleton } from '@mui/material';
import CommentThread from './CommentThread';

function Room() {
  return (
    <Container maxWidth="lg" className=" h-fit pt-20 ">
      <ClientSideSuspense
        fallback={
          <div>
            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
            <div className="w-full h-screen flex flex-row gap-4">
              <Skeleton variant="rectangular" width="100%" height="100%" />
              <Skeleton variant="rectangular" width="25%" height="100%" />
            </div>
          </div>
        }
      >
        <EditorNavBar />
        <div className="flex flex-row gap-4">
          <div className="w-3/4">
            <Editor />
          </div>
          <div className="w-1/4 ">
            <CommentThread />
          </div>
        </div>
      </ClientSideSuspense>
    </Container>
  );
}

export default Room;
