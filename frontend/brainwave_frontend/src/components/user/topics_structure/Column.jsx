/* eslint-disable react/prop-types */
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Task } from './Task';

export const Column = ({ subtopics, onSubtopicCheck }) => {
  return (
    <div className="column">
      <SortableContext items={subtopics} strategy={verticalListSortingStrategy}>
        {subtopics.map((subtopic) => (
          <Task
            key={subtopic.subtopic_id}
            id={subtopic.subtopic_id}
            title={subtopic.title}
            checked={subtopic.isChecked || false}
            onCheck={() => onSubtopicCheck(subtopic.subtopic_id)}
          />
        ))}
      </SortableContext>
    </div>
  );
};
