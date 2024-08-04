import { Outlet, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../store/configureStore.ts';
import { fetchCurrentUser } from '../../features/account/accountSlice.ts';
import Loadable from './Loadable.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header.tsx';
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';

function useTheme() {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  const [darkMode, setDarkMode] = useState(isDarkMode);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212',
      },
    },
  });

  function handleThemeChange() {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', (!darkMode).toString());
  }

  return { theme, darkMode, handleThemeChange };
}

function App() {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
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
  const { theme, darkMode, handleThemeChange } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <Loadable loading={loading}>
        {pathname !== '/' && (
          <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
        )}
        <Container sx={{ mt: 3 }}>
          <Outlet />
        </Container>
      </Loadable>
    </ThemeProvider>
  );
}

export default App;
