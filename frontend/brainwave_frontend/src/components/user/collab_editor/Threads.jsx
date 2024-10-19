import { Thread } from '@liveblocks/react-ui';
import { useThreads } from '@liveblocks/react/suspense';

function Threads() {
  const { threads } = useThreads();
  console.log(threads);

  return (
    <>
      {threads.map((thread) => (
        <Thread key={thread.id} thread={thread} />
      ))}
    </>
  );
}

export default Threads;
