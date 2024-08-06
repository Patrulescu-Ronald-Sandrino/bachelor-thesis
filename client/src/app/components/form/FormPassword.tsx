import { useController, UseControllerProps } from 'react-hook-form';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import React, { useState } from 'react';

interface Props extends UseControllerProps {
  label: string;
  fullWidth?: boolean;
}

export default function FormPassword({ label, fullWidth, ...props }: Props) {
  const { fieldState, field } = useController({ ...props, defaultValue: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <FormControl variant="outlined" fullWidth={fullWidth}>
      <InputLabel htmlFor={props.name}>{label}</InputLabel>
      <OutlinedInput
        {...props}
        {...field}
        error={!!fieldState.error}
        type={showPassword ? 'text' : 'password'}
        label={label}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText error>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  );
}
