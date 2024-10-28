import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button } from '@mui/material';

import 'react-toastify/dist/ReactToastify.css';

import { useState } from 'react';
import LoadingIndicator from '../common/LoadingIndicator';
import api from '../../api/Api';
import GoogleSignIn from './GoogleSignIn';
import ToastContainerComponent from '../common/ToastContainerComponent';
import '../../styles/Form.css';
import FormInput from '../common/FormInput';
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ADMIN_ACCESS_TOKEN,
  ADMIN_REFRESH_TOKEN,
} from '../../constants';
import { SuccessToast } from '../common/Toast';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.toastMessage) {
      SuccessToast({ message: location.state.toastMessage });
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError('');

    try {
      let res = await api.post('api/user-auth/login/', {
        username: values.username,
        password: values.password,
      });
      if (res.data.user.is_admin) {
        localStorage.setItem(ADMIN_ACCESS_TOKEN, res.data.access);
        localStorage.setItem(ADMIN_REFRESH_TOKEN, res.data.refresh);
        navigate('/admin/home', { replace: true });
      } else {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate('/home', { replace: true });
      }
    } catch (error) {
      if (error.response.data) {
        const firstKey = Object.keys(error.response.data)[0];
        setError(error.response.data[firstKey]);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }

    setLoading(false);
    setSubmitting(false);
  };

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .max(150, 'Username must be at most 150 characters long.')
      .required('This field is required.'),
    password: Yup.string().required('This field is required.'),
  });

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={LoginSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="m-0 w-[302.2px] flex flex-col items-start justify-start">
          <ToastContainerComponent />
          <div className=" relative w-full h-12 text-5xl-3 leading-[19px] font-medium font-poppins text-neutral-1 flex items-center justify-center min-w-[92px] ">
            Login to Brainwave
          </div>
          <div className="py-5 w-full flex justify-center items-center">
            <GoogleSignIn setError={setError} setLoading={setLoading} />
          </div>
          <div className="w-full h-max flex flex-col">
            <FormInput name="username" type="text" placeholder="Username" />
            <FormInput name="password" type="password" placeholder="Password" />
          </div>
          <div className="py-2 w-full flex items-center justify-center">
            {loading && <LoadingIndicator />}
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <div className="py-5 w-full flex flex-col items-center justify-center">
            <div>
              <Button
                className="self-stretch w-[155.5px] [filter:drop-shadow(0px_3.8px_4.25px_rgba(0,_0,_0,_0.25))] z-[3]"
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                sx={{
                  textTransform: 'none',
                  color: '#fff',
                  fontSize: '15.2',
                  background:
                    'linear-gradient(95.96deg, rgba(26, 73, 88, 0.78), rgba(31, 182, 195, 0.89))',
                  '&:hover': {
                    background:
                      'linear-gradient(95.96deg, rgba(26, 73, 88, 0.78), rgba(31, 182, 195, 0.89))',
                  },
                  width: 155.5,
                }}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </div>
            <div className="pt-2">
              <i className=" text-smi-1 font-nunito-sans ">
                <span className="text-gray-500">Or create an account?</span>
                <span className="text-black">
                  <Link to="/register"> Sign Up</Link>
                </span>
              </i>
            </div>
            <div>
              <i className=" text-smi-1 font-nunito-sans ">
                <span className="text-black">
                  <Link to="/login/password-reset">Forgot your password?</Link>
                </span>
              </i>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
