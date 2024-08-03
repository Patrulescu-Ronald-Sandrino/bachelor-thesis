import { useController, UseControllerProps } from 'react-hook-form';
import { TextField } from '@mui/material';
import { KeyboardEventHandler } from 'react';

interface Props extends UseControllerProps {
  label?: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
  placeholder?: string;
  onKeyDown?: KeyboardEventHandler | undefined;
  hideError?: boolean;
}

export default function FormTextInput({ hideError, ...props }: Props) {
  const { fieldState, field } = useController({ ...props, defaultValue: '' });
  return (
    <TextField
      {...props}
      {...field}
      multiline={props.multiline}
      rows={props.rows}
      type={props.type}
      placeholder={props.placeholder}
      fullWidth
      variant="outlined"
      error={hideError === true ? undefined : !!fieldState.error}
      helperText={hideError === true ? undefined : fieldState.error?.message}
      onKeyDown={props.onKeyDown}
    />
  );
}
