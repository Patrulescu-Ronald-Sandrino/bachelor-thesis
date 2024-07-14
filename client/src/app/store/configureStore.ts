import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { accountSlice } from '../../features/account/accountSlice.ts';
import { attractionsSlice } from '../../features/attraction/list/attractionsSlice.ts';

export const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    attractions: attractionsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
