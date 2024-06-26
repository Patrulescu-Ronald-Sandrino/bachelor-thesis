import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AttractionPicturesContextValue {
  index: number;
  setIndex: (index: number) => void;
  hasManyPictures: boolean;
  previous: () => void;
  next: () => void;
  pictures: string[];
}

export const AttractionPicturesContext = createContext<
  AttractionPicturesContextValue | undefined
>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAttractionPicturesContext() {
  const context = useContext(AttractionPicturesContext);

  if (typeof context === 'undefined') {
    throw Error('Oops - we do not seem to be inside the provider');
  }

  return context;
}

interface Props {
  pictures: string[];
  attractionIndexInitial: number;
}

export function AttractionPicturesContextProvider({
  pictures,
  attractionIndexInitial,
  children,
}: PropsWithChildren<Props>) {
  const [index, setIndex] = useState(0);
  const [attractionIndex, setAttractionIndex] = useState(
    attractionIndexInitial,
  );

  const hasManyPictures = pictures.length > 1;

  function previous() {
    setIndex((x) => (x - 1 + pictures.length) % pictures.length);
  }

  function next() {
    setIndex((x) => (x + 1) % pictures.length);
  }

  useEffect(() => {
    if (attractionIndex !== attractionIndexInitial) {
      setIndex(0);
      setAttractionIndex(attractionIndexInitial);
    }
  }, [attractionIndex, attractionIndexInitial]);

  return (
    <AttractionPicturesContext.Provider
      value={{
        index,
        setIndex,
        hasManyPictures,
        previous,
        next,
        pictures,
      }}
    >
      {children}
    </AttractionPicturesContext.Provider>
  );
}
