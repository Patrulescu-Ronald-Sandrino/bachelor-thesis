import { createBrowserRouter } from 'react-router-dom';
import App from '../layout/App.tsx';
import AttractionsPage from '../../features/attractions/view/AttractionsPage.tsx';
import HomePage from '../../features/home/HomePage.tsx';
import AddAttractionPage from '../../features/attractions/AddAttractionPage.tsx';
import ProfilePage from '../../features/profile/ProfilePage.tsx';
import AttractionPage from '../../features/attractions/view/AttractionPage.tsx';
import RequireAuth from './RequireAuth.tsx';
import LoginPage from '../../features/account/LoginPage.tsx';
import RegisterPage from '../../features/account/RegisterPage.tsx';
import ServerError from '../errors/ServerError.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'server-error', element: <ServerError /> },
      {
        element: <RequireAuth />,
        children: [
          { path: 'attractions', element: <AttractionsPage /> },
          { path: 'attractions/:id', element: <AttractionPage /> },
          { path: 'profile', element: <ProfilePage /> },
          {
            element: <RequireAuth roles={['Admin']} />,
            children: [
              { path: 'attractions/add', element: <AddAttractionPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
