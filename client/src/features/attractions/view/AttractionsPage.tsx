import { useEffect, useState } from 'react';
import { Attraction } from '../../../app/models/attraction.ts';
import AttractionCard from './AttractionCard.tsx';
import SwiperButton from './SwiperButton.tsx';
import { AttractionPicturesContextProvider } from '../../../app/context/AttractionPicturesContext.tsx';
import PicturesNavigationButtons from './PicturesNavigationButtons.tsx';
import agent from '../../../app/api/agent.ts';

export default function AttractionsPage() {
  const [showComments, setShowComments] = useState(false);
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
          <AttractionPicturesContextProvider
            pictures={[
              /* TODO: replace with actual pictures */
              attraction.mainPictureUrl,
              'https://picsum.photos/id/237/200/300',
              'https://picsum.photos/seed/picsum/200/300',
            ]}
            attractionIndexInitial={attractionIndex}
          >
            <AttractionCard key={attraction.id} attraction={attraction} />

            <div
              className="centered"
              style={{
                marginTop: '1em',
                marginBottom: '1em',
                flexDirection: 'column',
              }}
            >
              <div className="centered" style={{ marginBottom: '0.5em' }}>
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

              <PicturesNavigationButtons />
            </div>
          </AttractionPicturesContextProvider>
        )}
      </div>

      {showComments && <div>Comments</div>}
    </div>
  );
}
