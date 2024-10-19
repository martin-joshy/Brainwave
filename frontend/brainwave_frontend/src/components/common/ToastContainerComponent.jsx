import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContainerComponent = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={false}
      newestOnTop={false}
      closeOnClick={true}
      rtl={false}
      pauseOnFocusLoss
      draggable
      theme="dark"
      transition:Slide
    />
  );
};

export default ToastContainerComponent;
