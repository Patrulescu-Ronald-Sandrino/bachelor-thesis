import { useEffect, useState } from 'react';
import { Attraction } from '../../app/models/attraction.ts';
import axios from 'axios';
import AttractionCard from './AttractionCard.tsx';

export default function Attractions() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [attractionIndex, setAttractionIndex] = useState<number>(0);
  const attraction =
    attractionIndex < attractions.length ? attractions[attractionIndex] : null;

  useEffect(() => {
    axios.get('http://localhost:7000/api/attractions').then((response) => {
      console.log(response);
      setAttractions(response.data);
    });
  }, []);

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {attraction ? (
          <AttractionCard key={attraction.id} attraction={attraction} />
        ) : (
          <div>No more attractions! :( ...</div>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '50vw',
          marginBottom: '10px',
        }}
      >
        <button
          onClick={() => setAttractionIndex((x) => x + 1)}
          disabled={attractionIndex >= attractions.length}
        >
          Next
        </button>
      </div>
    </>
  );
}
