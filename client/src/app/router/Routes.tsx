import { createBrowserRouter } from 'react-router-dom';
import App from '../layout/App.tsx';
import AttractionsPage from '../../features/attractions/view/AttractionsPage.tsx';
import HomePage from '../../features/home/HomePage.tsx';
import AddAttractionPage from '../../features/attractions/AddAttractionPage.tsx';
import ProfilePage from '../../features/profile/ProfilePage.tsx';
import AttractionPage from '../../features/attractions/view/AttractionPage.tsx';

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'attractions', element: <AttractionsPage /> },
      { path: 'attractions/:id', element: <AttractionPage /> },
      { path: 'attractions/add', element: <AddAttractionPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
]);
