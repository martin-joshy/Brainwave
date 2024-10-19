import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchNotebooks } from './notebooksSlice';
import NotebookSVG from '../../../svg/NotebookSVG';
import MenuList from '../MenuList';
import { selectSortedNotebooks } from './SortedNotebooksSelector';

function Notebooks() {
  const dispatch = useDispatch();
  const notebooks = useSelector(selectSortedNotebooks);
  const { status, error } = useSelector((state) => state.notebooks);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchNotebooks());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  const handleSelectNotebook = (notebook) => {
    navigate(`/notebook/learning-structure/${notebook.notebook_id}`);
  };

  return (
    <div className="grid grid-cols-2 xs-min:grid-cols-3 min-870px:grid-cols-3 sm-min:grid-cols-4 min-875px:grid-cols-4 lg-min:grid-cols-5 p-4 gap-y-10">
      {notebooks.map((notebook) => (
        <div
          key={notebook.notebook_id}
          className="relative w-[200px] h-[180px] "
        >
          <NotebookSVG className="w-full h-full" />
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={() => handleSelectNotebook(notebook)}
          >
            <p
              className="text-white text-lg p-10 overflow-hidden whitespace-nowrap text-ellipsis"
              title={notebook.title}
            >
              {notebook.title}
            </p>
          </div>
          <div className="absolute top-3 right-10 flex items-center justify-center cursor-pointer ">
            <MenuList notebook={notebook} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Notebooks;
