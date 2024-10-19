/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const TopicsContext = createContext();

export const TopicsProvider = ({ children }) => {
  const [topics, setTopics] = useState([]);
  const [notebook, setNotebook] = useState(null);

  const addSubtopic = (topicId, title) => {
    setTopics((prevTopics) =>
      prevTopics.map((topic) =>
        topic.topic_id === topicId
          ? {
              ...topic,
              subtopics: [...topic.subtopics, { subtopic_id: uuidv4(), title }],
            }
          : topic
      )
    );
  };

  const updateSubtopicChecked = (topicId, subtopicId, checked) => {
    setTopics((prevTopics) =>
      prevTopics.map((topic) =>
        topic.topic_id === topicId
          ? {
              ...topic,
              subtopics: topic.subtopics.map((subtopic) =>
                subtopic.subtopic_id === subtopicId
                  ? { ...subtopic, isChecked: checked }
                  : subtopic
              ),
            }
          : topic
      )
    );
  };

  const updateAllSubtopicsChecked = (topicId, checked) => {
    setTopics((prevTopics) =>
      prevTopics.map((topic) =>
        topic.topic_id === topicId
          ? {
              ...topic,
              subtopics: topic.subtopics.map((subtopic) => ({
                ...subtopic,
                isChecked: checked,
              })),
            }
          : topic
      )
    );
  };

  return (
    <TopicsContext.Provider
      value={{
        topics,
        setTopics,
        addSubtopic,
        notebook,
        setNotebook,
        updateSubtopicChecked,
        updateAllSubtopicsChecked,
      }}
    >
      {children}
    </TopicsContext.Provider>
  );
};
