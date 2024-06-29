import { useAppSelector } from '../store/configureStore.ts';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../layout/Header.tsx';

interface Props {
  roles?: string[];
}

export default function RequireAuth({ roles }: Props) {
  const { user } = useAppSelector((state) => state.account);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (roles && !roles.some((r) => user.roles?.includes(r))) {
    toast.error('Not authorized to access this area');
    return <Navigate to="/attractions" />;
  }

  return (
    <>
      <Header />
      <div style={{ marginLeft: '1em', marginRight: '1em' }}>
        <Outlet />
      </div>
    </>
  );
}
