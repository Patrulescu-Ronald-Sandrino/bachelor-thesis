import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import { UserDto } from '../../app/models/user.ts';
import { FieldValues } from 'react-hook-form';
import agent from '../../app/api/agent.ts';
import { router } from '../../app/router/Routes.tsx';
import { toast } from 'react-toastify';
import { shallowCopy } from '../../app/util/object.ts';

interface AccountState {
  user: UserDto | null;
}

const initialState: AccountState = {
  user: null,
};

export const signInUser = createAsyncThunk<UserDto, FieldValues>(
  'account/signInUser',
  async (data, thunkApi) => {
    try {
      const user = await agent.Account.login(data);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (e) {
      return thunkApi.rejectWithValue(e);
    }
  },
);

export const fetchCurrentUser = createAsyncThunk<UserDto>(
  'account/fetchCurrentUser',
  async (_, thunkApi) => {
    thunkApi.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
    try {
      const user = await agent.Account.currentUser();
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (e) {
      return thunkApi.rejectWithValue(e);
    }
  },
  {
    condition: () => {
      if (!localStorage.getItem('user')) return false;
    },
  },
);

function getRolesFromClaims(claims: { [index: string]: string | string[] }) {
  const roleOrRoles: string | string[] = claims['role'];
  return typeof roleOrRoles === 'string' ? [roleOrRoles] : roleOrRoles;
}

const getUserWithTokenData = (user: UserDto) => {
  const userWithTokenData = shallowCopy(user);
  const claims = JSON.parse(atob(user.token.split('.')[1]));

  userWithTokenData.roles = getRolesFromClaims(claims);
  userWithTokenData.id = claims['nameid'];

  return userWithTokenData;
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      localStorage.removeItem('user');
      void router.navigate('/');
    },
    setUser: (state, action: PayloadAction<UserDto>) => {
      state.user = getUserWithTokenData(action.payload);
    },
    setUserPhoto: (state, action: PayloadAction<string | null>) => {
      if (state.user) state.user.photo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.user = null;
      localStorage.removeItem('user');
      toast.error('Session expired - please login again');
      void router.navigate('/login', {
        state: { from: router.state.location },
      });
    });
    builder.addCase(signInUser.rejected, (_, action) => {
      throw action.payload;
    });
    builder.addMatcher(
      isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled),
      (state, action: PayloadAction<UserDto>) => {
        state.user = getUserWithTokenData(action.payload);
      },
    );
  },
});

export const { signOut, setUser, setUserPhoto } = accountSlice.actions;
