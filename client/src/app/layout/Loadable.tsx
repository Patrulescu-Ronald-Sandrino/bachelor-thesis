import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  loading: boolean;
}

export default function Loadable({ loading, children }: Props) {
  return (
    <>
      {loading ? <div className={'centered-both'}>Loading...</div> : children}
    </>
  );
}
