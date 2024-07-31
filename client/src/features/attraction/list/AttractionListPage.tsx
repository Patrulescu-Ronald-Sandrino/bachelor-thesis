import {
  PAGE_SIZES,
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
            <CheckboxButtons
              items={['Made by me']}
              checked={attractionParams.madeByMe ? ['Made by me'] : []}
              onChange={(items) =>
                dispatch(
                  setAttractionParams({
                    madeByMe: items.includes('Made by me'),
                  }),
                )
              }
            />
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
        </Grid>

        <Grid item xs={9}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-around"
            gap={1}
            mb={1}
          >
            <SelectList
              label="Page size"
              selectedValue={attractionParams.pageSize!}
              items={PAGE_SIZES.map((x) => ({
                label: x.toString(),
                value: x,
              }))}
              onChange={(value) =>
                dispatch(setAttractionParams({ pageSize: value }))
              }
            />
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
          </Box>

          <Grid container spacing={4}>
            {attractions.map((attraction) => (
              <Grid item xs={4} key={attraction.id}>
                {/*for fixing skeleton height*/}
                {/*{Math.random() < 0.5 ? (*/}
                {!attractionsLoaded ? (
                  <AttractionCardSkeleton />
                ) : (
                  <AttractionCard attraction={attraction} />
                )}
              </Grid>
            ))}
          </Grid>

          <Box mt={1} mb={1}>
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
