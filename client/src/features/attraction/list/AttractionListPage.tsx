import {
  SearchField,
  SearchFields,
  SortField,
  SortFields,
  SortOrder,
  SortOrders,
} from '../../../app/models/attraction.ts';
import Loadable from '../../../app/layout/Loadable.tsx';
import { Box, Grid, Paper } from '@mui/material';
import AttractionCard from './AttractionCard.tsx';
import AttractionsSearch from './AttractionsSearch.tsx';
import AppPagination from '../../../app/components/AppPagination.tsx';
import RadioButtonGroup from '../../../app/components/RadioButtonGroup.tsx';
import CheckboxButtons from '../../../app/components/CheckboxButtons.tsx';
import useAttractions from './useAttractions.tsx';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../app/store/configureStore.ts';
import { splitByCapitalLetter } from '../../../app/util/string.ts';
import {
  setAttractionParams,
  setPageNumber,
  setSearchField,
} from './attractionsSlice.ts';
import AttractionCardSkeleton from './AttractionCardSkeleton.tsx';
import SelectList from '../../../app/components/SelectList.tsx';

export default function AttractionListPage() {
  const dispatch = useAppDispatch();
  const { attractionParams } = useAppSelector((state) => state.attractions);
  const {
    attractionsLoaded,
    attractionTypesLoaded,
    attractions,
    attractionTypes,
    pageData,
  } = useAttractions();

  return (
    <Loadable loading={!attractionTypesLoaded}>
      <Grid container columnSpacing={4}>
        <Grid item xs={3}>
          <Paper sx={{ mb: 2 }}>
            <AttractionsSearch />
          </Paper>

          <Paper sx={{ mb: 2, p: 2 }}>
            <RadioButtonGroup
              label="Search by"
              selectedValue={attractionParams.searchField}
              options={SearchFields.map((x) => ({
                value: x as string,
                label: splitByCapitalLetter(x),
              }))}
              onChange={(e) => {
                dispatch(setSearchField(e.target.value as SearchField));
              }}
            />
          </Paper>

          <Paper sx={{ mb: 2, p: 2 }}>
            <CheckboxButtons
              label="Types"
              items={attractionTypes}
              checked={attractionParams.types}
              onChange={(items) =>
                dispatch(setAttractionParams({ types: items }))
              }
            />
          </Paper>

          <Paper sx={{ mb: 2, p: 2 }}>
            <SelectList
              label="Sort field"
              selectedValue={attractionParams.sortField}
              items={SortFields.map((x) => ({
                value: x as string,
                label: splitByCapitalLetter(x),
              }))}
              onChange={(value) =>
                dispatch(setAttractionParams({ sortField: value as SortField }))
              }
            />
          </Paper>

          <Paper sx={{ mb: 2, p: 2 }}>
            <SelectList
              label="Sort order"
              selectedValue={attractionParams.sortOrder}
              items={SortOrders.map((x) => ({
                value: x,
                label: x,
              }))}
              onChange={(value) =>
                dispatch(setAttractionParams({ sortOrder: value as SortOrder }))
              }
            />
          </Paper>
        </Grid>

        <Grid item xs={9}>
          <Grid container spacing={4}>
            {attractions.map((attraction) => (
              <Grid item xs={4} key={attraction.id}>
                {!attractionsLoaded ? (
                  <AttractionCardSkeleton />
                ) : (
                  <AttractionCard attraction={attraction} />
                )}
              </Grid>
            ))}
          </Grid>

          <Box mt={3}>
            {pageData && (
              <AppPagination
                pageData={pageData}
                onPageChange={(page: number) => dispatch(setPageNumber(page))}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </Loadable>
  );
}
