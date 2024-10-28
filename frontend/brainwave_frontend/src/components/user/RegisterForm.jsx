import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';

import { useState } from 'react';
import LoadingIndicator from '../common/LoadingIndicator';
import api from '../../api/Api';
import GoogleSignIn from '../../components/user/GoogleSignIn';
import { ErrorToast } from '../common/Toast';
import ToastContainerComponent from '../common/ToastContainerComponent';
import { validateUsername, validatePassword } from '../../validators';
import '../../styles/Form.css';
import FormInput from '../common/FormInput';

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setLoading(true);
    setError('');

    try {
      await api.post('api/user-auth/register/', {
        username: values.username,
        email: values.email,
        password1: values.password,
        password2: values.confirm_password,
      });

      navigate('/login', {
        state: { toastMessage: 'Verification email sent successfully.' },
        replace: true,
      });
    } catch (error) {
      if (error.response && error.response.data) {
        const responseErrors = error.response.data;
        setErrors(responseErrors);
        ErrorToast({
          message:
            'Registration failed. Please check your input and try again.',
        });
      } else {
        ErrorToast({
          message: 'An unexpected error occurred. Please try again later.',
        });
      }
    }

    setLoading(false);
    setSubmitting(false);
  };

  const RegistrationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(
        /^[\w.@+-]+$/,
        'Enter a valid username. This value may contain only letters, numbers, and @/./+/-/_ characters.'
      )
      .max(150, 'Username must be at most 150 characters long.')
      .required('This field is required.')
      .test(
        'checkUsernameExists',
        'A user with that username already exists.',
        async (value) => {
          try {
            return await validateUsername(value);
          } catch (err) {
            setError(err.message);
            return false;
          }
        }
      ),
    email: Yup.string()
      .email('Enter a valid email address.')
      .max(320, 'Email must be at most 320 characters long.')
      .required('This field is required.'),
    password: Yup.string()
      .required('This field is required.')
      .test('validatePassword', '', async function (value) {
        try {
          const errors = await validatePassword(value);
          if (errors) {
            return this.createError({ message: errors.join(' ') });
          }
          return true;
        } catch (err) {
          setError(err.message);
          return false;
        }
      }),
    confirm_password: Yup.string()
      .oneOf(
        [Yup.ref('password'), null],
        "The two password fields didn't match."
      )
      .required('This field is required.'),
  });

  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        password: '',
        confirm_password: '',
      }}
      validationSchema={RegistrationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="m-0 w-[302.2px] flex flex-col items-start justify-start">
          <ToastContainerComponent />
          <div className=" relative w-full h-12 text-5xl-3 leading-[19px] font-medium font-poppins text-neutral-1 flex items-center justify-center min-w-[92px] ">
            Sign up
          </div>
          <div className="py-4 w-full flex justify-center items-center">
            <GoogleSignIn setError={setError} setLoading={setLoading} />
          </div>
          <div className="w-full h-max flex flex-col">
            <FormInput name="username" type="text" placeholder="Username" />
            <FormInput name="email" type="email" placeholder="Email" />
            <FormInput name="password" type="password" placeholder="Password" />
            <FormInput
              name="confirm_password"
              type="password"
              placeholder="Confirm Password"
            />
          </div>
          <div className="w-full flex items-center justify-center">
            {loading && <LoadingIndicator />}
          </div>
          {error && <div className="text-red-600">{error}</div>}
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
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </div>
            <div className="pt-2">
              <i className=" text-smi-1 font-nunito-sans ">
                <span className="text-gray-500">Already have an account?</span>
                <span className="text-black">
                  <Link to="/login"> Sign in</Link>
                </span>
              </i>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
