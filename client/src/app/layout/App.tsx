import { Outlet, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/configureStore.ts';
import { fetchCurrentUser } from '../../features/account/accountSlice.ts';
import Loadable from './Loadable.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header.tsx';
import { Container } from '@mui/material';

const noHeaderPaths = ['/', '/login', '/register'];

function App() {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { user } = useAppSelector((state) => state.account);
  const [loading, setLoading] = useState(true);

  const showHeader = !noHeaderPaths.includes(pathname) && !!user;

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
    } catch (e) {
      console.log(e);
    }
  }, [dispatch]);

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp]);

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <Loadable loading={loading}>
        {showHeader && <Header />}
        <Container sx={{ mt: 4 }}>
          <Outlet />
        </Container>
      </Loadable>
    </>
  );
}

export default App;
