import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

interface Props {
  label: string;
  selectedValue: string;
  items: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export default function SelectList({
  label,
  selectedValue,
  items,
  onChange,
}: Props) {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={selectedValue}
        label={label}
        onChange={(e) => onChange(e.target.value as string)}
      >
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
