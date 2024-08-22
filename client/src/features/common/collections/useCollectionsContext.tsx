import { useContext } from 'react';
import { CollectionsContext } from './CollectionsContext.tsx';

export function useCollectionsContext() {
  const context = useContext(CollectionsContext);

  if (!context) {
    throw new Error(
      'useCollectionsContext must be used within a CollectionsContextProvider',
    );
  }

  return context;
}
