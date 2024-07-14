import { TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../app/store/configureStore.ts';
import { setAttractionParams } from './attractionsSlice.ts';

export default function AttractionsSearch() {
  const dispatch = useAppDispatch();
  const { attractionParams } = useAppSelector((state) => state.attractions);
  const [searchValue, setSearchValue] = useState(attractionParams.searchValue);

  function debouncedSearch(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    dispatch(setAttractionParams({ searchValue: event.target.value }));
  }

  return (
    <TextField
      label="Search attractions"
      variant="outlined"
      fullWidth
      value={searchValue}
      onChange={(event) => {
        if (event.target.value === searchValue) return;
        setSearchValue(event.target.value);
        debouncedSearch(event);
      }}
    />
  );
}
