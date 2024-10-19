/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from 'react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';

import { TopicsContext } from '../../../context/TopicsContext';
import { Column } from './Column';
import { Input } from './Input';

// eslint-disable-next-line react/prop-types
const DraggableApp = ({ id, title, subtopics, handleDragEnd, sensors }) => {
  const { updateSubtopicChecked, updateAllSubtopicsChecked } =
    useContext(TopicsContext);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
    const allSelected =
      subtopics.length > 0 && subtopics.every((st) => st.isChecked);
    setAllChecked(allSelected);
  }, [subtopics]);

  const handleSelectAll = (e) => {
    console.log(e.target.checked);
    const checked = e.target.checked;
    setAllChecked(checked);

    updateAllSubtopicsChecked(id, checked);
  };

  const handleSubtopicCheck = (subtopicId) => {
    const checked = !subtopics.find(
      (subtopic) => subtopic.subtopic_id === subtopicId
    ).isChecked;

    updateSubtopicChecked(id, subtopicId, checked);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white mx-8 rounded-3xl font-poppins py-2 my-8 border-2 border-solid border-[#D6D6D6]"
    >
      <div className="flex justify-between items-center m-4">
        <p className="font-semibold text-lg">{title}</p>
        <input
          type="checkbox"
          className="accent-green-500"
          checked={allChecked}
          onChange={handleSelectAll}
        />
      </div>
      <Input onSubmit={(title) => updateSubtopicChecked(id, uuidv4(), title)} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <Column subtopics={subtopics} onSubtopicCheck={handleSubtopicCheck} />
      </DndContext>
    </div>
  );
};

export default DraggableApp;
