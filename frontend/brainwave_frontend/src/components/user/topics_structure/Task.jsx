/* eslint-disable react/prop-types */
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { TopicsContext } from '../../../context/TopicsContext';

export const Task = ({ id, title, checked, onCheck }) => {
  const { notebook } = useContext(TopicsContext);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const navigate = useNavigate();

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const RedirectToEditor = () => {
    navigate(`/notebook/collaborative-editor/${notebook.room_id}/${id}`, {
      state: {
        notebookId: notebook.notebook_id,
        subtopic_title: title,
        notebook_title: notebook.title,
      },
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-[#F8F8F8] hover:bg-[#F2F1F1] m-3 h-8 flex items-center rounded-md hover:cursor-pointer"
      onClick={RedirectToEditor}
    >
      <input
        type="checkbox"
        className="accent-green-500"
        checked={checked}
        onChange={onCheck}
      />
      <span className="ms-2">{title}</span>
    </div>
  );
};
