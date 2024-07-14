import { useAppSelector } from '../store/configureStore.ts';
import { Outlet, useLocation } from 'react-router-dom';
import { router } from './Routes.tsx';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

interface Props {
  roles?: string[];
}

export default function RequireAuth({ roles }: Props) {
  const { user } = useAppSelector((state) => state.account);
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      router.navigate('/login', { state: { from: location } });
    } else if (roles && !roles.some((r) => user.roles?.includes(r))) {
      toast.error('Not authorized to access this area');
      router.navigate('/attractions');
    }
  }, [location, roles, user]);

  return <Outlet />;
}
