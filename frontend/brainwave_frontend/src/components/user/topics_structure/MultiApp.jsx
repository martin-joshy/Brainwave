import { useContext, useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  TouchSensor,
  MouseSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import DraggableApp from './DraggableApp';
import { Container } from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { TopicsContext } from '../../../context/TopicsContext';
import user_api from '../../../api/UserApi';
import ShareMenu from './share_menu/ShareMenu';

// eslint-disable-next-line react/prop-types
export default function MultiApp({ withApi }) {
  const { topics, setTopics, setNotebook } = useContext(TopicsContext);
  const [title, setTitle] = useState('');
  const [retry, setRetry] = useState(false);
  const location = useLocation();
  const formData = location.state?.formData;
  const { notebookId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (notebookId && withApi) {
      user_api
        .get(`/api/notebook-manage/notebook/${notebookId}/`)
        .then((response) => {
          setTopics(response.data.topics);
          setTitle(response.data.title);
          setNotebook(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    } else if (formData && !withApi) {
      user_api
        .post('api/notebook-manage/generate-topics/', formData)
        .then((response) => {
          setTopics(response.data);
          setTitle(formData.topic);
          setRetry(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [notebookId, formData, withApi, retry]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleTopicDragEnd = (event) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    setTopics((prevTopics) => {
      const originalPos = prevTopics.findIndex(
        (topic) => topic.topic_id === active.id
      );
      const newPos = prevTopics.findIndex(
        (topic) => topic.topic_id === over.id
      );

      const updatedTopics = arrayMove(prevTopics, originalPos, newPos);

      if (withApi) {
        user_api
          .post(`/api/notebook-manage/swap-topic-order/`, {
            topic_id_1: active.id,
            topic_id_2: over.id,
          })
          .then((response) => {
            console.log('Topics reordered successfully:', response.data);
          })
          .catch((error) => {
            console.error('Error reordering topics:', error);
          });
      }

      return updatedTopics;
    });
  };

  const handleSubtopicDragEnd = (topicId) => (event) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    setTopics((prevTopics) =>
      prevTopics.map((topic) =>
        topic.topic_id === topicId
          ? {
              ...topic,
              subtopics: arrayMove(
                topic.subtopics,
                getSubtopicPos(topic.subtopics, active.id),
                getSubtopicPos(topic.subtopics, over.id)
              ),
            }
          : topic
      )
    );

    if (withApi) {
      user_api
        .post(`/api/notebook-manage/swap-subtopic-order/`, {
          subtopic_id_1: active.id,
          subtopic_id_2: over.id,
        })
        .then((response) => {
          console.log('Subtopics reordered successfully:', response.data);
        })
        .catch((error) => {
          console.error('Error reordering subtopics:', error);
        });
    }
  };

  const getSubtopicPos = (subtopics, id) =>
    subtopics.findIndex((subtopic) => subtopic.subtopic_id === id);

  const handleSave = () => {
    const notebookData = {
      title: formData.topic,
      topics: topics,
    };
    user_api
      .post('api/notebook-manage/notebook/', notebookData)
      .then((response) => {
        navigate(`/notebook/learning-structure/${response.data.notebook_id}`, {
          replace: true,
        });
        console.log('Notebook saved successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error saving notebook:', error);
      });
  };

  const handleRegenrate = () => {
    setRetry(true);
  };

  return (
    <Container maxWidth="xl" className="mt-12 pt-4">
      {retry ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <div className="bg-[#F2F1F1] w-full h-24 flex justify-between rounded-t-3xl">
            <h1 className="pl-10">{title}</h1>
            <div className=" flex  items-center w-28 justify-between mr-3">
              {!withApi ? (
                <>
                  <div onClick={handleSave}>
                    <Tooltip title="Save">
                      <IconButton>
                        <SaveRoundedIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div onClick={handleRegenrate}>
                    <Tooltip title="Regenerate">
                      <IconButton>
                        <ReplayRoundedIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </>
              ) : (
                <ShareMenu />
              )}
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleTopicDragEnd}
          >
            <SortableContext
              items={topics}
              strategy={verticalListSortingStrategy}
            >
              {topics.map((topic) => (
                <DraggableApp
                  key={topic.topic_id}
                  id={topic.topic_id}
                  title={topic.title}
                  subtopics={topic.subtopics}
                  handleDragEnd={handleSubtopicDragEnd(topic.topic_id)}
                  sensors={sensors}
                />
              ))}
            </SortableContext>
          </DndContext>
        </>
      )}
    </Container>
  );
}
