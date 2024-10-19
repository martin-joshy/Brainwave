/* eslint-disable react/prop-types */
import { useState, useContext } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { TopicsContext } from '../../../context/TopicsContext';

export const Input = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const { addSubtopic } = useContext(TopicsContext);

  const handleSubmit = () => {
    if (!input) return;

    onSubmit(input);
    addSubtopic(input);

    setInput('');
  };

  return (
    <div className="container flex justify-start m-0">
      <div className=" h-8 flex rounded-md p-0 w-2/4 focus-within:w-5/6">
        <input
          className=" bg-[#F8F8F8] rounded-md h-full w-full focus:outline-none"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div
          onClick={handleSubmit}
          className="h-full rounded-r-md w-10 flex justify-center items-center"
        >
          <AddIcon fontSize="large" />
        </div>
      </div>
    </div>
  );
};
