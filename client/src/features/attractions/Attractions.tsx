import { useEffect, useState } from 'react';
import { Attraction } from '../../app/models/attraction.ts';
import axios from 'axios';
import AttractionCard from './AttractionCard.tsx';
import SwiperButton from './SwiperButton.tsx';

export default function Attractions() {
  const [showComments, setShowComments] = useState(false);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [attractionIndex, setAttractionIndex] = useState<number>(0);
  const attraction =
    attractionIndex < attractions.length ? attractions[attractionIndex] : null;
  const isLast = attractionIndex == attractions.length - 1;

  useEffect(() => {
    axios.get('http://localhost:7000/api/attractions').then((response) => {
      setAttractions(response.data);
    });
  }, []);

  function next() {
    setShowComments(false);
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

  function toggleComments() {
    setShowComments((x) => !x);
    console.log('toggle comments');
  }

  return (
    <div className="centered" style={{ justifyContent: 'space-around' }}>
      <div className="centered" style={{ flexDirection: 'column' }}>
        {!attraction ? (
          <div>No more attractions! :( ...</div>
        ) : (
          <>
            <AttractionCard key={attraction.id} attraction={attraction} />

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
                disabled={isLast}
                icon="/icons/keys/space.svg"
                eventKey=" "
              />

              <SwiperButton
                text="Toggle comments"
                onClick={toggleComments}
                disabled={!attraction}
                icon="/icons/keys/c.svg"
                eventKey="c"
              />
            </div>
          </>
        )}
      </div>

      {showComments && <div>Comments</div>}
    </div>
  );
}
