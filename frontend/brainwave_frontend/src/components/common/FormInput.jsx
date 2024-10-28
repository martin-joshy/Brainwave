import { Field, ErrorMessage, useField } from 'formik';
import TextField from '@mui/material/TextField';

const FormInput = ({ name, type, placeholder }) => {
  const [, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div
      className={`form-group w-full flex flex-col items-center ${hasError ? 'pt-2' : 'pt-4'}`}
    >
      <Field
        className="w-full [border:none] bg-[transparent] self-stretch font-h5-regular text-smi-1 text-character-disabled-placeholder-25 z-[3]"
        type={type}
        name={name}
        placeholder={placeholder}
        as={TextField}
        variant="outlined"
        sx={{
          '& fieldset': {
            borderColor: hasError ? '#D32F2F' : '#d9d9d9',
          },
          '& .MuiInputBase-root': {
            height: '43px',
            backgroundColor: '#fff',
            borderRadius: '6.82px',
            fontSize: '14.1px',
            '& input': {
              padding: '16px 14px',
              boxSizing: 'border-box',
              height: '100%',
              '&:-webkit-autofill': {
                transition: 'background-color 5000s ease-in-out 0s',
                boxShadow: 'none',
                WebkitTextFillColor: '#000000',
              },
            },
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderWidth: '1px',
            },
            '&.Mui-focused fieldset': {
              borderWidth: '1px',
            },
          },
          '& .MuiInputBase-input': {
            color: '#000000',
          },
          '& .MuiInputBase-input::placeholder': {
            color: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-600 font-inter font-extralight text-left w-full"
      />
    </div>
  );
};

export default FormInput;
