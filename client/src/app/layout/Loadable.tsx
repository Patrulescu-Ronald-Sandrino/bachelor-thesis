import { PropsWithChildren } from 'react';
import { CircularProgress } from '@mui/material';

interface Props extends PropsWithChildren {
  loading: boolean;
  message?: string;
  target?: string;
  className?: string;
  spinner?: boolean;
}

export default function Loadable({
  loading,
  message,
  target,
  className = 'centered-both',
  spinner = false,
  children,
}: Props) {
  const computedMessage = target
    ? `Loading ${target}...`
    : message ?? 'Loading...';

  return (
    <>
      {loading ? (
        <div className={className}>
          {spinner === true ? <CircularProgress /> : computedMessage}
        </div>
      ) : (
        children
      )}
    </>
  );
}
