import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  loading: boolean;
  message?: string;
  target?: string;
}

export default function Loadable({
  loading,
  message,
  target,
  children,
}: Props) {
  const computedMessage = target
    ? `Loading ${target}...`
    : message ?? 'Loading...';

  return (
    <>
      {loading ? (
        <div className={'centered-both'}>{computedMessage}</div>
      ) : (
        children
      )}
    </>
  );
}
