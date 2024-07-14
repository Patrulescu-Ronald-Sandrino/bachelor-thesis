import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { ChangeEvent } from 'react';

interface Props {
  options: { value: string; label: string }[];
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  selectedValue: string;
  label: string;
}

export default function RadioButtonGroup({
  options,
  onChange,
  selectedValue,
  label,
}: Props) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <RadioGroup onChange={onChange} value={selectedValue}>
        {options.map(({ value, label }) => (
          <FormControlLabel
            control={<Radio />}
            label={label}
            key={value}
            value={value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
