import { useEffect } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../app/store/configureStore.ts';
import { fetchAttractions, fetchAttractionTypes } from './attractionsSlice.ts';

export default function useAttractions() {
  const dispatch = useAppDispatch();
  const {
    attractionsLoaded,
    attractionTypesLoaded,
    attractions,
    attractionTypes,
    pageData,
  } = useAppSelector((state) => state.attractions);

  useEffect(() => {
    if (!attractionsLoaded) {
      dispatch(fetchAttractions());
    }
  }, [attractionsLoaded, dispatch]);

  useEffect(() => {
    if (!attractionTypesLoaded) {
      dispatch(fetchAttractionTypes());
    }
  }, [attractionTypesLoaded, dispatch]);

  return {
    attractionsLoaded,
    attractionTypesLoaded,
    attractions,
    attractionTypes,
    pageData,
  };
}
