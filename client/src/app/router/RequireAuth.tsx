import { useAppSelector } from '../store/configureStore.ts';
import { Outlet, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { router } from './Routes.tsx';
import Loadable from '../layout/Loadable.tsx';

interface Props {
  roles?: string[];
}

export default function RequireAuth({ roles }: Props) {
  const { user } = useAppSelector((state) => state.account);
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    if (!user) {
      void router.navigate('/login', { state: { from: location } });
    } else if (roles && !roles.some((r) => user.roles?.includes(r))) {
      toast.error('Not authorized to access this area');
      void router.navigate('/attractions');
    }
  }, [user, roles, location]);

  return (
    <Loadable loading={loading} target="app">
      <Outlet />
    </Loadable>
  );
}
