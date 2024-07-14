import {
  Attraction,
  AttractionParams,
  SearchField,
} from '../../../app/models/attraction.ts';
import { PageData } from '../../../app/models/pagination.ts';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import agent from '../../../app/api/agent.ts';
import { RootState } from '../../../app/store/configureStore.ts';

interface AttractionsState {
  attractionsLoaded: boolean;
  attractionTypesLoaded: boolean;
  status: string;
  attractions: Attraction[];
  attractionTypes: string[];
  attractionParams: AttractionParams;
  pageData: PageData | null;
}

function getAxiosParams(attractionParams: AttractionParams) {
  const params = new URLSearchParams();
  params.append('pageNumber', attractionParams.pageNumber.toString());
  params.append('pageSize', attractionParams.pageSize.toString());
  params.append('sortField', attractionParams.sortField);
  params.append('sortOrder', attractionParams.sortOrder);
  if (attractionParams.searchValue.length > 0) {
    params.append('searchField', attractionParams.searchField);
    params.append('searchValue', attractionParams.searchValue);
  }
  attractionParams.types.forEach((type) => params.append('types', type));
  return params;
}

export const fetchAttractions = createAsyncThunk<
  Attraction[],
  void,
  { state: RootState }
>('attractions/fetchAttractions', async (_, thunkAPI) => {
  const params = getAxiosParams(
    thunkAPI.getState().attractions.attractionParams,
  );
  try {
    const response = await agent.Attractions.list(params);
    thunkAPI.dispatch(setPageData(response.pageData));
    return response.items;
  } catch (e) {
    console.log(e);
    return thunkAPI.rejectWithValue({ error: e });
  }
});

export const fetchAttractionTypes = createAsyncThunk(
  'attractions/fetchAttractionTypes',
  async (_, thunkAPI) => {
    try {
      return agent.AttractionTypes.list().then((response) =>
        response.map((type) => type.name),
      );
    } catch (e) {
      return thunkAPI.rejectWithValue({ error: e });
    }
  },
);

function initParams() {
  return {
    pageNumber: 1,
    pageSize: 6,
    sortField: 'Name',
    sortOrder: 'Ascending',
    searchField: 'All',
    searchValue: '',
    types: [],
  } as AttractionParams;
}

const initialState: AttractionsState = {
  attractionsLoaded: false,
  attractionTypesLoaded: false,
  status: 'idle',
  attractions: [],
  attractionTypes: [],
  attractionParams: initParams(),
  pageData: null,
};

export const attractionsSlice = createSlice({
  name: 'attractions',
  initialState,
  reducers: {
    setAttractionParams: (
      state,
      action: PayloadAction<Partial<AttractionParams>>,
    ) => {
      state.attractionsLoaded = false;
      state.attractionParams = {
        ...state.attractionParams,
        ...action.payload,
        pageNumber: 1,
      };
    },
    setSearchField: (state, action: PayloadAction<SearchField>) => {
      state.attractionsLoaded = state.attractionParams.searchValue === '';
      state.attractionParams = {
        ...state.attractionParams,
        searchField: action.payload,
      };
    },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.attractionsLoaded = false;
      state.attractionParams = {
        ...state.attractionParams,
        pageNumber: action.payload,
      };
    },
    setPageData: (state, action: PayloadAction<PageData>) => {
      state.pageData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAttractions.pending, (state) => {
      state.status = 'loading';
      state.status = 'loading';
    });
    builder.addCase(fetchAttractions.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.attractionsLoaded = true;
      state.attractions = action.payload;
    });
    builder.addCase(fetchAttractions.rejected, (state) => {
      state.status = 'failed';
    });
    builder.addCase(fetchAttractionTypes.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchAttractionTypes.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.attractionTypesLoaded = true;
      state.attractionTypes = action.payload;
    });
    builder.addCase(fetchAttractionTypes.rejected, (state) => {
      state.status = 'failed';
    });
  },
});

export const {
  setAttractionParams,
  setSearchField,
  setPageNumber,
  setPageData,
} = attractionsSlice.actions;
