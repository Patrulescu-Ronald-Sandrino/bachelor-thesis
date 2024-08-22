import { AttractionCollection } from '../../../app/models/attractionCollection.ts';
import { createContext, PropsWithChildren } from 'react';
import { useAppSelector } from '../../../app/store/configureStore.ts';
import useCollections from './useCollections.tsx';

interface CollectionsContextValue {
  collections: AttractionCollection[];
  setCollections: (collections: AttractionCollection[]) => void;
  loading: boolean;
  username: string;
}

export const CollectionsContext = createContext<CollectionsContextValue>({
  collections: [],
  setCollections: () => void 0,
  loading: false,
  username: '',
});

export function CollectionsContextProvider({ children }: PropsWithChildren) {
  const username = useAppSelector((state) => state.account.user)!.username;

  const { collections, setCollections, loading } = useCollections(username);

  return (
    <CollectionsContext.Provider
      value={{ collections, setCollections, loading, username }}
    >
      {children}
    </CollectionsContext.Provider>
  );
}
