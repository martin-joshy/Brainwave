import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import user_api from '../../api/UserApi';

export default function SharedMultiApp() {
  const [topics, setTopics] = useState([]);
  const [notebook, setNotebook] = useState({});
  const navigate = useNavigate();
  const { notebookId } = useParams();

  useEffect(() => {
    const fetchNotebook = async () => {
      try {
        const response = await user_api.get(
          `/api/notebook-manage/shared-notebook/${notebookId}/`
        );
        setNotebook(response.data);
        setTopics(response.data.topics);
      } catch (error) {
        console.error('Error fetching notebook:', error);
      }
    };

    fetchNotebook();
  }, [notebookId]);

  function RedirectToEditor(subtopic_title, topic_id) {
    navigate(`/notebook/collaborative-editor/${notebook.room_id}/${topic_id}`, {
      state: {
        notebookId: notebook.notebook_id,
        subtopic_title: subtopic_title,
        notebook_title: notebook.title,
      },
    });
  }

  return (
    <Container maxWidth="xl" className="mt-12 pt-4">
      <Box className="bg-[#F2F1F1] w-full h-24 flex justify-between rounded-t-3xl">
        <h1 className="pl-10">{notebook.title}</h1>
      </Box>

      <div>
        {topics.map((topic) => (
          <div
            key={topic.topic_id}
            className="bg-white mx-8 rounded-3xl font-poppins py-2 my-8 border-2 border-solid border-[#D6D6D6]"
          >
            <div className="flex justify-between items-center m-4">
              <p className="font-semibold text-lg">{topic.title}</p>
            </div>
            <div className="ml-8">
              {topic.subtopics.map((subtopic) => (
                <div
                  key={subtopic.subtopic_id}
                  className="bg-[#F8F8F8] hover:bg-[#F2F1F1] m-3 h-8 flex items-center rounded-md hover:cursor-pointer"
                  onClick={() =>
                    RedirectToEditor(subtopic.title, subtopic.subtopic_id)
                  }
                >
                  <span className="ms-2">{subtopic.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
