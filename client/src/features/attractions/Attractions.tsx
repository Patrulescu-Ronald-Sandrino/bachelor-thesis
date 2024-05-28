import { CSSProperties, useEffect, useState } from 'react';
import { Attraction } from '../../app/models/attraction.ts';
import axios from 'axios';
import AttractionCard from './AttractionCard.tsx';
import SwiperButton from './SwiperButton.tsx';

const footerStyle: CSSProperties = {
  bottom: 0,
  width: '100%',
  marginBottom: '1em',
  marginTop: '1em',
};

export default function Attractions() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [attractionIndex, setAttractionIndex] = useState<number>(0);
  const attraction =
    attractionIndex < attractions.length ? attractions[attractionIndex] : null;

  useEffect(() => {
    axios.get('http://localhost:7000/api/attractions').then((response) => {
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
          <SwiperButton
            text="Dislike"
            onClick={() => {
              setAttractionIndex((x) => x + 1);
              console.log('disliked');
            }}
            icon="/icons/keys/left.svg"
            eventKey="ArrowLeft"
          />

          <SwiperButton
            text="Like"
            onClick={() => {
              setAttractionIndex((x) => x + 1);
              console.log('liked');
            }}
            icon="/icons/keys/right.svg"
            eventKey="ArrowRight"
          />

          <SwiperButton
            text="Next"
            onClick={() => {
              setAttractionIndex((x) => x + 1);
              console.log('next');
            }}
            disabled={attractionIndex >= attractions.length}
            icon="/icons/keys/space.svg"
            eventKey=" "
          />
        </div>
      </footer>
    </>
  );
}
