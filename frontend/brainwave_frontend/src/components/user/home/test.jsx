import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavoriteNotebooks } from '../../../../store/features/notebooks/favoritesSlice';
import Star from '/icons/star.svg';

const FavSideBarBox = () => {
  const dispatch = useDispatch();
  const { favorites, status, error } = useSelector((state) => state.favorites);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFavoriteNotebooks());
    }
  }, [status, dispatch]);

  return (
    <div className="px-4 mt-6 ml-2 mr-2 pb-2 h-fit flex flex-col justify-center bg-white dark:bg-dark-300 break-all rounded-2xl">
      <div className="w-full h-fit flex justify-start flex-row text-black font-poppins">
        <div className="flex justify-center items-center">
          <img src={Star} alt="star_icon" />
        </div>
        <span className="ml-2">
          <p className="text-base font-bold">Favorite</p>
        </span>
      </div>
      <div className="w-full h-32 font-poppins text-xs overflow-auto no-scrollbar">
        {status === 'loading' && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <ul className="list-none p-0 m-0 space-y-2 text-smi-1">
          {favorites.map((notebook) => (
            <li key={notebook.notebook_id}>{notebook.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FavSideBarBox;
