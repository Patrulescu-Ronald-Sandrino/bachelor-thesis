import { createBrowserRouter } from 'react-router-dom';
import App from '../layout/App.tsx';
import AttractionListPage from '../../features/attraction/list/AttractionListPage.tsx';
import HomePage from '../../features/home/HomePage.tsx';
import AttractionFormPage from '../../features/attraction/manage/AttractionFormPage.tsx';
import ProfilePage from '../../features/profile/ProfilePage.tsx';
import AttractionDetailsPage from '../../features/attraction/details/AttractionDetailsPage.tsx';
import RequireAuth from './RequireAuth.tsx';
import LoginPage from '../../features/account/LoginPage.tsx';
import RegisterPage from '../../features/account/RegisterPage.tsx';
import ServerError from '../errors/ServerError.tsx';
import NotFound from '../errors/NotFound.tsx';
import VerifyPage from '../../features/account/VerifyPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'verify-email', element: <VerifyPage /> },
      { path: 'server-error', element: <ServerError /> },
      {
        element: <RequireAuth />,
        children: [
          { path: 'attractions', element: <AttractionListPage /> },
          ...['add', ':id/edit'].map((path) => ({
            path: 'attractions/' + path,
            element: <AttractionFormPage />,
          })),
          { path: 'attractions/:id', element: <AttractionDetailsPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
      ...['not-found', '*'].map((path) => ({ path, element: <NotFound /> })),
    ],
  },
]);
