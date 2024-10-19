import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

import { useState } from 'react';
import LoadingIndicator from '../common/LoadingIndicator';
import api from '../../api/Api';
import ToastContainerComponent from '../common/ToastContainerComponent';
import '../../styles/Form.css';
import { SuccessToast } from '../common/Toast';
import FormInput from '../common/FormInput';

const PasswordResetForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError('');

    try {
      await api.post('/api/user-auth/password-reset/', {
        email: values.email,
      });
      SuccessToast({ message: 'Password reset email sent successfully.' });
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

  const PasswordResetSchema = Yup.object().shape({
    email: Yup.string()
      .email('Enter a valid email address.')
      .max(320, 'Email must be at most 320 characters long.')
      .required('This field is required.'),
  });

  return (
    <Formik
      initialValues={{
        email: '',
      }}
      validationSchema={PasswordResetSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="m-0 w-[302.2px] flex flex-col items-start justify-start">
          <ToastContainerComponent />
          <div className="py-7 w-full flex justify-center items-center">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                border: '2px solid #000',
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 50 }} />
            </Box>
          </div>
          <div className=" w-full flex flex-col justify-center items-center pb-4 font-nunito-sans">
            <h1 className="font-bold">Trouble logging in?</h1>
            <div className="text-center ">
              <p>
                Enter your email and we will send you a link to get back into
                your account.
              </p>
            </div>
          </div>

          <FormInput name="email" type="email" placeholder="Email" />
          <div className="py-3 w-full flex justify-center items-center">
            {loading && <LoadingIndicator />}
            {error && <div className="text-red-600">{error}</div>}
          </div>
          <div className="py-4 w-full flex flex-col items-center justify-center">
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
                {isSubmitting ? 'Loading...' : 'Send Email'}
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
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PasswordResetForm;
