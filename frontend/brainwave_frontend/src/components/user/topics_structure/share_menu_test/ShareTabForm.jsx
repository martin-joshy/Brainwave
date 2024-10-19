import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { shareNotebook } from './sharedNotebookSlice';
import { TopicsContext } from '../../../../context/TopicsContext';

export default function ShareTabForm() {
  const { notebook } = useContext(TopicsContext);
  const notebook_id = notebook.notebook_id;
  const [formData, setFormData] = useState({
    username: '',
    permission: 'write', // Default permission level
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.sharedNotebooks);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(shareNotebook({ ...formData, notebook_id }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ minWidth: 120 }}>
      <FormControl fullWidth margin="normal">
        <TextField
          id="username"
          name="username"
          label="Username"
          variant="outlined"
          value={formData.username}
          onChange={handleChange}
          disabled={loading}
        />
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        Share
      </Button>
      {error && <p style={{ color: 'red' }}>{error.error}</p>}
    </Box>
  );
}
