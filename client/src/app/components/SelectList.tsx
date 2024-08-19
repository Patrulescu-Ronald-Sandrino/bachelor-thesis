import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

interface Props<TValue> {
  label?: string;
  selectedValue: TValue;
  items: { value: TValue; label: string }[] | TValue[];
  onChange: (value: TValue) => void;
  notFullWidth?: boolean;
}

export default function SelectList<TValue extends string | number>({
  label,
  selectedValue,
  items,
  onChange,
  notFullWidth,
}: Props<TValue>) {
  return (
    <FormControl fullWidth={notFullWidth !== true}>
      <InputLabel>{label}</InputLabel>
      <Select
        labelId={label}
        value={selectedValue}
        label={label}
        onChange={(e) => onChange(e.target.value as TValue)}
      >
        {items.map((item) => {
          return typeof item === 'object' ? (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ) : (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
