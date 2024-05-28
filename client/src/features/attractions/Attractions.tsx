import { useEffect, useState } from 'react';
import { Attraction } from '../../app/models/attraction.ts';
import axios from 'axios';
import AttractionCard from './AttractionCard.tsx';
import SwiperButton from './SwiperButton.tsx';

export default function Attractions() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [attractionIndex, setAttractionIndex] = useState<number>(0);
  const attraction =
    attractionIndex < attractions.length ? attractions[attractionIndex] : null;
  const hasMore = attractionIndex >= attractions.length;

  useEffect(() => {
    axios.get('http://localhost:7000/api/attractions').then((response) => {
      setAttractions(response.data);
    });
  }, []);

  function next() {
    setAttractionIndex((x) => x + 1);
  }

  function dislike() {
    console.log('disliked');
    next();
  }

  function like() {
    console.log('liked');
    next();
  }

  return (
    <>
      <div className="centered" style={{ flexDirection: 'column' }}>
        {attraction ? (
          <AttractionCard key={attraction.id} attraction={attraction} />
        ) : (
          <div>No more attractions! :( ...</div>
        )}

        <div className="centered" style={{ marginTop: '1em' }}>
          <SwiperButton
            text="Dislike"
            onClick={dislike}
            disabled={!attraction}
            icon="/icons/keys/left.svg"
            eventKey="ArrowLeft"
          />

          <SwiperButton
            text="Like"
            onClick={like}
            disabled={!attraction}
            icon="/icons/keys/right.svg"
            eventKey="ArrowRight"
          />

          <SwiperButton
            text="Next"
            onClick={next}
            disabled={hasMore}
            icon="/icons/keys/space.svg"
            eventKey=" "
          />
        </div>
      </div>
    </>
  );
}
