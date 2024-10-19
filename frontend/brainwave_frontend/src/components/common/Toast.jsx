import { toast, Slide } from 'react-toastify';

export const SuccessToast = ({ message, options = {} }) => {
  return toast.success(message, {
    position: 'top-center',
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Slide,
    ...options,
  });
};

export const ErrorToast = ({ message, options = {} }) => {
  return toast.error(message, {
    position: 'top-center',
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Slide,
    ...options,
  });
};
