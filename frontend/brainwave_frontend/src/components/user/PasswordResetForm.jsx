import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
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

          <div className="relative w-full h-12 text-5xl-3 leading-[19px] font-medium font-poppins text-neutral-1 flex items-center justify-center min-w-[92px]">
            Reset Password
          </div>

          <div className="py-7 w-full flex justify-center items-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm bg-white/30 shadow-[0_8px_32px_0_rgba(31,182,195,0.1)]">
              <LockOutlinedIcon
                sx={{
                  fontSize: 36,
                  color: 'rgba(26, 73, 88, 0.85)',
                }}
              />
            </div>
          </div>

          <div className="w-full flex flex-col justify-center items-center pb-4 font-nunito-sans">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Enter your email and we will send you a link to reset your
                password.
              </p>
            </div>
          </div>

          <div className="w-full">
            <FormInput name="email" type="email" placeholder="Email" />
          </div>

          <div className="py-2 w-full flex items-center justify-center">
            {loading && <LoadingIndicator />}
            {error && <div className="text-red-600">{error}</div>}
          </div>

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
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
            <div className="pt-2">
              <i className="text-smi-1 font-nunito-sans">
                <span className="text-gray-500">Back to </span>
                <span className="text-black">
                  <Link to="/login">Login</Link>
                </span>
              </i>
            </div>
            <div>
              <i className="text-smi-1 font-nunito-sans">
                <span className="text-gray-500">Don't have an account? </span>
                <span className="text-black">
                  <Link to="/register">Sign Up</Link>
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
