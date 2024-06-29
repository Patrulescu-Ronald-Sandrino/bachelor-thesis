import { Outlet } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../store/configureStore.ts';
import { fetchCurrentUser } from '../../features/account/accountSlice.ts';
import Loadable from './Loadable.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

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
        <Outlet />
      </Loadable>
    </>
  );
}

export default App;
