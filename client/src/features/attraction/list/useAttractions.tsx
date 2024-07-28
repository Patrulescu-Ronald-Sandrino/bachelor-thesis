import { useCallback, useEffect } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../app/store/configureStore.ts';
import {
  fetchAttractions,
  fetchAttractionTypes,
  setAttractionParams,
} from './attractionsSlice.ts';
import { useSearchParams } from 'react-router-dom';
import { PAGE_SIZES } from '../../../app/models/attraction.ts';

export default function useAttractions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const {
    attractionsLoaded,
    attractionTypesLoaded,
    attractions,
    attractionTypes,
    pageData,
  } = useAppSelector((state) => state.attractions);

  const queryPageSizeOrDefault = useCallback(() => {
    const queryPageSize = Number(searchParams.get('pageSize'));
    return !queryPageSize || !PAGE_SIZES.includes(queryPageSize)
      ? PAGE_SIZES[0]
      : queryPageSize;
  }, [searchParams]);

  useEffect(() => {
    const pageSize = queryPageSizeOrDefault();
    if (!pageData || !pageData.pageSize) {
      dispatch(setAttractionParams({ pageSize }));
    }
  }, [dispatch, pageData, queryPageSizeOrDefault]);

  useEffect(() => {
    if (!attractionsLoaded) {
      dispatch(fetchAttractions()).then(() => {
        if (pageData && pageData.pageSize)
          setSearchParams(new URLSearchParams(`pageSize=${pageData.pageSize}`));
      });
    }
  }, [attractionsLoaded, dispatch, pageData, setSearchParams]);

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
