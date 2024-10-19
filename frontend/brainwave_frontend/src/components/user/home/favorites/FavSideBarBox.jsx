/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';

import Star from '/icons/star.svg';
import { fetchFavoriteNotebooks, removeFavorite } from './favoritesSlice';

const FavSideBarBox = () => {
  const dispatch = useDispatch();
  const { favorites, status, error } = useSelector((state) => state.favorites);
  const [open, setOpen] = useState(false);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFavoriteNotebooks());
    }
  }, [status, dispatch]);
  console.log(favorites);

  const handleClickOpen = (notebook) => {
    setSelectedNotebook(notebook);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNotebook(null);
  };

  const handleConfirm = () => {
    if (selectedNotebook) {
      dispatch(
        removeFavorite({
          notebookId: selectedNotebook.notebook_id,
          favorite: false,
        })
      );
    }
    setOpen(false);
    setSelectedNotebook(null);
  };

  const handleSelectNotebook = (notebook) => {
    navigate(`/notebook/learning-structure/${notebook.notebook_id}`);
  };

  return (
    <div className=" mt-6 ml-2 mr-2 pb-2 h-fit flex flex-col justify-center bg-white dark:bg-dark-300 break-all rounded-2xl">
      <div className="w-full h-fit flex justify-start flex-row text-black font-poppins">
        <div className="flex justify-center items-center pl-4">
          <img src={Star} alt="star_icon" />
        </div>
        <span className="ml-2 ">
          <p className="text-base font-bold">Favorite</p>
        </span>
      </div>
      <div className="w-full h-32 font-poppins text-xs overflow-auto no-scrollbar">
        {status === 'loading' && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <ul className=" list-none p-0 m-0  text-smi-1">
          {favorites.map((notebook) => (
            <li
              className="group hover:bg-[#F2F1F1] px-4 py-1 rounded-md cursor-pointer flex justify-between items-center"
              key={notebook.notebook_id}
            >
              <span
                className="w-full"
                onClick={() => handleSelectNotebook(notebook)}
              >
                {notebook.title}
              </span>

              <button
                className="appearance-none bg-transparent border-none p-0 m-0 cursor-pointer flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => handleClickOpen(notebook)}
                aria-label={`Remove ${notebook.title} from favorites`}
              >
                <CloseRoundedIcon fontSize="small" className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Dialog component */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Confirm your action'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove the notebook titled "
            {selectedNotebook?.title}" from favorites?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FavSideBarBox;
