import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import LoadingIndicator from './LoadingIndicator';
import GoogleSignIn from './GoogleSignIn';
import { SuccessToast, ErrorToast } from './Toast';
import ToastContainerComponent from './ToastContainerComponent';
import api from '../api/Api';
import { validateUsername, validatePassword } from '../validators';

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

      SuccessToast({ message: 'Verification email sent successfully.' });
      // navigate('/login'); // Uncomment if using react-router
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
        <Form className="m-0 w-[302.2px] flex flex-col items-start justify-start gap-[18.3px] ">
          <ToastContainerComponent />
          <h1>Register to Brainwave</h1>

          <GoogleSignIn setError={setError} setLoading={setLoading} />

          <div className="form-group">
            <Field
              className="[border:none] bg-[transparent] self-stretch h-[31.1px] font-h5-regular text-smi-1 text-character-disabled-placeholder-25 z-[3]"
              type="text"
              name="username"
              placeholder="Username"
              as={TextField}
              variant="outlined"
              sx={{
                '& fieldset': { borderColor: '#d9d9d9' },
                '& .MuiInputBase-root': {
                  height: '31.1px',
                  backgroundColor: '#fff',
                  borderRadius: '6.82px',
                  fontSize: '12.1px',
                },
                '& .MuiInputBase-input': { color: 'rgba(0, 0, 0, 0.25)' },
              }}
            />
            <ErrorMessage
              name="username"
              component="div"
              className="text-danger"
            />
          </div>

          <div className="form-group">
            <Field
              className="[border:none] bg-[transparent] self-stretch h-[31.1px] font-h5-regular text-smi-1 text-character-disabled-placeholder-25 z-[3]"
              type="email"
              name="email"
              placeholder="Email"
              as={TextField}
              variant="outlined"
              sx={{
                '& fieldset': { borderColor: '#d9d9d9' },
                '& .MuiInputBase-root': {
                  height: '31.1px',
                  backgroundColor: '#fff',
                  borderRadius: '6.82px',
                  fontSize: '12.1px',
                },
                '& .MuiInputBase-input': { color: 'rgba(0, 0, 0, 0.25)' },
              }}
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-danger"
            />
          </div>

          <div className="form-group">
            <Field
              className="[border:none] bg-[transparent] self-stretch h-[31.1px] font-h5-regular text-smi-1 text-character-disabled-placeholder-25 z-[3]"
              type="password"
              name="password"
              placeholder="Password"
              as={TextField}
              variant="outlined"
              sx={{
                '& fieldset': { borderColor: '#d9d9d9' },
                '& .MuiInputBase-root': {
                  height: '31.1px',
                  backgroundColor: '#fff',
                  borderRadius: '6.82px',
                  fontSize: '12.1px',
                },
                '& .MuiInputBase-input': { color: 'rgba(0, 0, 0, 0.25)' },
              }}
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-danger"
            />
          </div>

          <div className="form-group">
            <Field
              className="[border:none] bg-[transparent] self-stretch h-[31.1px] font-h5-regular text-smi-1 text-character-disabled-placeholder-25 z-[3]"
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              as={TextField}
              variant="outlined"
              sx={{
                '& fieldset': { borderColor: '#d9d9d9' },
                '& .MuiInputBase-root': {
                  height: '31.1px',
                  backgroundColor: '#fff',
                  borderRadius: '6.82px',
                  fontSize: '12.1px',
                },
                '& .MuiInputBase-input': { color: 'rgba(0, 0, 0, 0.25)' },
              }}
            />
            <ErrorMessage
              name="confirm_password"
              component="div"
              className="text-danger"
            />
          </div>

          {loading && <LoadingIndicator />}
          {error && <div className="text-danger">{error}</div>}

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
        </Form>
      )}
    </Formik>
  );
};

SignUpForm.propTypes = {
  className: PropTypes.string,
};

export default SignUpForm;
