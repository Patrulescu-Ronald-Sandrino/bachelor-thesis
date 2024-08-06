import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  loading: boolean;
  message?: string;
}

export default function Loadable({ loading, message, children }: Props) {
  return (
    <>
      {loading ? (
        <div className={'centered-both'}>{message ?? 'Loading...'}</div>
      ) : (
        children
      )}
    </>
  );
}
