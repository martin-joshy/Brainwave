import * as React from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  MenuItem,
} from '@mui/material';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import AddIcon from '@mui/icons-material/Add';
import { grey } from '@mui/material/colors';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  topic: Yup.string().required('Topic is required'),
  expertise: Yup.string().required('Level of expertise is required'),
});

export default function FormDialog() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      topic: '',
      expertise: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleClose();
      formik.resetForm();
      navigate('/confirm-learning-structure', { state: { formData: values } });
    },
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <AddIcon
        sx={{ cursor: 'pointer', color: grey[50], fontSize: 60 }}
        onClick={handleClickOpen}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <DialogContentText>
              To generate topics, please enter the main topic and your level of
              expertise.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="topic"
              name="topic"
              label="Topic"
              fullWidth
              value={formik.values.topic}
              onChange={formik.handleChange}
              variant="standard"
              error={formik.touched.topic && Boolean(formik.errors.topic)}
              helperText={formik.touched.topic && formik.errors.topic}
            />
            <FormControl fullWidth>
              <InputLabel id="expertise-select-label">
                Level of Expertise
              </InputLabel>
              <Select
                labelId="expertise-select-label"
                margin="dense"
                id="expertise"
                name="expertise"
                label="Level of Expertise"
                value={formik.values.expertise}
                onChange={formik.handleChange}
                variant="standard"
                error={
                  formik.touched.expertise && Boolean(formik.errors.expertise)
                }
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="expert">Expert</MenuItem>
              </Select>
              <FormHelperText>
                {formik.touched.expertise && formik.errors.expertise}
              </FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button color="primary" variant="contained" fullWidth type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
