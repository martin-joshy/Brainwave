/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';

export const CollabEditorContext = createContext();

export const CollabEditorProvider = ({ children }) => {
  const [notebookRoomId, setNotebookRoomId] = useState(null);
  const [subtopicId, setSubtopicId] = useState(null);

  return (
    <CollabEditorContext.Provider
      value={{
        notebookRoomId,
        setNotebookRoomId,
        subtopicId,
        setSubtopicId,
      }}
    >
      {children}
    </CollabEditorContext.Provider>
  );
};
