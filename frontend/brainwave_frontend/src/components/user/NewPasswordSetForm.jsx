import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Box, Button } from '@mui/material';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';

import 'react-toastify/dist/ReactToastify.css';

import { useState } from 'react';
import LoadingIndicator from '../common/LoadingIndicator';
import api from '../../api/Api';
import ToastContainerComponent from '../common/ToastContainerComponent';
import { validatePassword } from '../../validators';
import '../../styles/Form.css';
import FormInput from '../common/FormInput';

const NewPasswordSetForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError('');

    try {
      await api.post(`/api/user-auth/password-reset-confirm/${uid}/${token}/`, {
        new_password1: values.new_password1,
        new_password2: values.new_password2,
        uid: uid,
        token: token,
      });
      navigate('/login', {
        replace: true,
        state: {
          toastMessage:
            'Your password has been successfully changed. You can now log in with your new password.',
        },
      });
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

  const NewPasswordSetSchema = Yup.object().shape({
    new_password1: Yup.string()
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
    new_password2: Yup.string()
      .oneOf(
        [Yup.ref('new_password1'), null],
        "The two password fields didn't match."
      )
      .required('This field is required.'),
  });

  return (
    <Formik
      initialValues={{
        new_password1: '',
        new_password2: '',
      }}
      validationSchema={NewPasswordSetSchema}
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
              <KeyOutlinedIcon sx={{ fontSize: 50 }} />
            </Box>
          </div>
          <h1 className="py-3 w-full flex justify-center items-center font-nunito-sans font-semibold ">
            Create A Strong Password
          </h1>

          <FormInput
            name="new_password1"
            type="password"
            placeholder="New Password"
          />
          <FormInput
            name="new_password2"
            type="password"
            placeholder="Confirm New Password"
          />

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
                {isSubmitting ? 'Loading...' : 'Change Password'}
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

export default NewPasswordSetForm;
