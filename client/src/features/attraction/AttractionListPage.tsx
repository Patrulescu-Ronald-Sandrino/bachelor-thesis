import { useEffect, useState } from 'react';
import { Attraction } from '../../app/models/attraction.ts';
import agent from '../../app/api/agent.ts';
import AttractionCardContainer from './shared/AttractionCardContainer.tsx';

export default function AttractionListPage() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [attractionIndex, setAttractionIndex] = useState<number>(0);
  const attraction =
    attractionIndex < attractions.length ? attractions[attractionIndex] : null;
  const isLast = attractionIndex == attractions.length - 1;

  useEffect(() => {
    agent.Attractions.list()
      .then((response) => setAttractions(response))
      .catch((error) => console.log(error));
  }, []);

  function next() {
    setAttractionIndex((x) => x + 1);
  }

  function dislike() {
    // NOTE that this is not lifted down because dislike endpoint would return the list
    console.log('disliked');
  }

  function like() {
    console.log('liked');
  }

  return (
    <>
      {attraction ? (
        <AttractionCardContainer
          attraction={attraction}
          swiperData={{ attractionIndex, dislike, like, next, isLast }}
        />
      ) : (
        <div>No more attractions</div>
      )}
    </>
  );
}
