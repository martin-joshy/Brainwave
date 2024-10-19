import { Input } from '@mui/joy';
import { FormControl } from '@mui/joy';
import { FormLabel } from '@mui/joy';
import Button from '@mui/joy/Button';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import FormHelperText from '@mui/joy/FormHelperText';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUserProfile,
  updateUserProfile,
} from '../common/userProfileSlice';
import SnackbarComponent from '../common/SnackbarComponent';

function ProfileForm() {
  const dispatch = useDispatch();
  const { user, userInfoIsLoading, formStatus, error } = useSelector(
    (state) => state.userProfile
  );

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const validationSchema = Yup.object({
    firstName: Yup.string().max(
      150,
      'First Name must be 150 characters or less'
    ),
    lastName: Yup.string().max(150, 'Last Name must be 150 characters or less'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(
        updateUserProfile({
          first_name: values.firstName,
          last_name: values.lastName,
        })
      );
    },
  });

  return !userInfoIsLoading ? (
    <div className="mt-5 border-solid border border-slate-200 rounded-lg">
      <form
        onSubmit={formik.handleSubmit}
        className="h-fit px-4 py-4 m-2 rounded"
      >
        <div className="font-bold pb-4">Contact Details</div>
        <div className="flex flex-row gap-4 pb-4 ">
          <FormControl className="w-1/3">
            <FormLabel>First Name</FormLabel>
            <Input
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="First Name"
              variant="outlined"
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
            />
            <FormHelperText>
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="text-red-500 flex justify-center items-center gap-2">
                  <InfoOutlined /> {formik.errors.firstName}
                </div>
              )}
            </FormHelperText>
          </FormControl>
          <FormControl className="w-1/3">
            <FormLabel>Last Name</FormLabel>
            <Input
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Last Name"
              variant="outlined"
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            />
            <FormHelperText>
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="text-red-500 flex justify-center items-center gap-2">
                  <InfoOutlined /> {formik.errors.lastName}
                </div>
              )}
            </FormHelperText>
          </FormControl>
        </div>

        <FormControl className="w-1/3 pb-4">
          <FormLabel>Email</FormLabel>
          <Input
            defaultValue={user?.email}
            placeholder="Email"
            variant="outlined"
            disabled
          />
        </FormControl>
        <Button loading={formStatus === 'loading'} type="submit">
          Save Changes
        </Button>
      </form>
      {error && <SnackbarComponent message={error} severity="error" />}
      {formStatus === 'success' && (
        <SnackbarComponent
          message="Profile Updated Successfully"
          severity="success"
        />
      )}
    </div>
  ) : null;
}

export default ProfileForm;
