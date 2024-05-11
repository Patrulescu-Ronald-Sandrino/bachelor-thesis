import { CSSProperties, useEffect, useState } from 'react';
import { Attraction } from '../../app/models/attraction.ts';
import axios from 'axios';
import AttractionCard from './AttractionCard.tsx';

const footerStyle: CSSProperties = {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  marginBottom: '1em',
};

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
      <div className="centered-div">
        {attraction ? (
          <AttractionCard key={attraction.id} attraction={attraction} />
        ) : (
          <div>No more attractions! :( ...</div>
        )}
      </div>
      <footer style={footerStyle}>
        <div className="centered-div">
          <button
            onClick={() => setAttractionIndex((x) => x + 1)}
            disabled={attractionIndex >= attractions.length}
            className="app-button"
          >
            Next
          </button>
        </div>
      </footer>
    </>
  );
}
