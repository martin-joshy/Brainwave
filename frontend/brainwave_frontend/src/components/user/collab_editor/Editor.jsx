/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import * as Y from 'yjs';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import { useRoom, useSelf } from '@liveblocks/react/suspense';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

import { CollabEditorContext } from '../../../context/CollabEditorContext';

function Editor() {
  const room = useRoom();
  const [doc, setDoc] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  if (!doc || !provider) {
    return null;
  }

  return <BlockNote doc={doc} provider={provider} />;
}

function BlockNote({ doc, provider }) {
  const userInfo = useSelf((me) => me.info);
  const { subtopicId } = useContext(CollabEditorContext);
  const editor = useCreateBlockNote({
    collaboration: {
      provider,

      fragment: doc.getXmlFragment(subtopicId),

      user: {
        name: userInfo.username ? userInfo.username : 'User',
        color: userInfo.color ? userInfo.color : '#DC3132',
      },
    },
  });

  return (
    <div className="w-full h-full">
      <BlockNoteView
        editor={editor}
        className="h-screen bg-white rounded-lg drop-shadow-2xl"
        theme="light"
      />
    </div>
  );
}

export default Editor;
