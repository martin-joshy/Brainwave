/* eslint-disable react/no-unknown-property */
import NavBar from '../common/NavBar';
import Add from '/icons/add.svg';
import NotebookSVG from '../../svg/NotebookSVG';
import FormDialog from '../FormDialog';
import BookmarkSVG from '../../svg/Bookmark';
import MenuList from './MenuList';
import CollectionFormDialog from './CollectionFormDialog';
import FavSideBarBox from './favorites/FavSideBarBox';
import Notebooks from './notebooks/Notebooks';
import Filter from './notebooks/Filter';
import SharedNotebooks from './shared/SharedNotebooks';

function Home() {
  return (
    <div className="bg-background-pattern bg-repeat-y bg-center w-screen min-h-screen dark:text-white dark:bg-dark-100 font-poppins">
      <NavBar />
      <div className="w-screen h-full flex flex-row">
        <div className="pt-[80px] w-[285px] min-h-screen max-h-fit bg-custom-gray-100 dark:bg-dark-400 sticky top-0 left-0 md-max:hidden">
          {/* <div className="px-4 ml-2 mr-2 h-fit pb-2 flex flex-col justify-center bg-white dark:bg-dark-300 break-all rounded-2xl">
            <div className=" w-full h-fit flex justify-between flex-row text-black font-poppins ">
              <span>
                <p className="text-base font-bold">My Collection</p>
              </span>
              <div className=" flex justify-center items-center">
                <img src={Add} alt="add_icon" />
              </div>
            </div>
            <div className="w-full h-32 font-poppins text-smi-1 overflow-auto no-scrollbar">
              <ul className="list-none p-0 m-0 space-y-2">
                <li>Bioengineering</li>
                <li>Nanotechnology</li>
                <li>Robotics</li>
                <li>Sustainable Engineering</li>
                <li>Full Stack Dev</li>
                <li>Data Science</li>
                <li>Machine Learning</li>
              </ul>
            </div>
          </div> */}
          <FavSideBarBox />
          <SharedNotebooks />
        </div>
        <div className="mt-20 w-full h-[1000px] ">
          <div className="flex flex-col gap-y-10">
            <div className="relative p-4 w-[200px] h-[180px] ">
              <NotebookSVG className="w-full h-full" />
              <div className="absolute top-4 right-16 flex items-center justify-center ">
                <BookmarkSVG />
              </div>
              <div className="absolute inset-x-0 bottom-10 flex items-center justify-center">
                <p className="text-white text-lg">Add Notebook</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center cursor-pointer ">
                <FormDialog />
              </div>
            </div>
            {/* <CollectionFormDialog /> */}
            <div className="bg-[#D9D9D9] ml-9 pr-14 h-8 rounded-l-full font-poppins indent-4 flex items-center justify-between">
              <p>Your Notebooks</p>
              <Filter />
            </div>
            <Notebooks />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
