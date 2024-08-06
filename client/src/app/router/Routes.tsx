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
import VerifyEmailPage from '../../features/account/VerifyEmailPage.tsx';
import ResetPasswordPage from '../../features/account/ResetPasswordPage.tsx';
import ForgotPasswordPage from '../../features/account/ForgotPasswordPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'verify-email', element: <VerifyEmailPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
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
