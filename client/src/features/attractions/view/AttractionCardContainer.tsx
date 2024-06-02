import { AttractionPicturesContextProvider } from '../../../app/context/AttractionPicturesContext.tsx';
import AttractionCard from './AttractionCard.tsx';
import SwiperButton from './SwiperButton.tsx';
import PicturesNavigationButtons from './PicturesNavigationButtons.tsx';
import { Attraction } from '../../../app/models/attraction.ts';
import { useState } from 'react';

interface Props {
  attraction: Attraction;
  swiperData?: {
    attractionIndex: number;
    dislike: () => void;
    like: () => void;
    next: () => void;
    isLast: boolean;
  };
}

export default function AttractionCardContainer({
  attraction,
  swiperData,
}: Props) {
  const [showComments, setShowComments] = useState(false);

  function next() {
    swiperData?.next();
    setShowComments(false);
  }

  function dislike() {
    swiperData?.dislike();
    next();
  }

  function like() {
    swiperData?.like();
    next();
  }

  return (
    <div className="centered" style={{ justifyContent: 'space-around' }}>
      <div className="centered" style={{ flexDirection: 'column' }}>
        <AttractionPicturesContextProvider
          pictures={[
            /* TODO: replace with actual pictures */
            attraction.mainPictureUrl,
            'https://picsum.photos/id/237/200/300',
            'https://picsum.photos/seed/picsum/200/300',
          ]}
          attractionIndexInitial={swiperData?.attractionIndex ?? 0}
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
              {swiperData && (
                <div className="centered">
                  <SwiperButton
                    text="Dislike"
                    onClick={dislike}
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
                    disabled={swiperData.isLast}
                    icon="/icons/keys/space.svg"
                    eventKey=" "
                  />
                </div>
              )}

              <SwiperButton
                text="Toggle comments"
                onClick={() => setShowComments((x) => !x)}
                icon="/icons/keys/c.svg"
                eventKey="c"
              />
            </div>

            <PicturesNavigationButtons />
          </div>
        </AttractionPicturesContextProvider>
      </div>

      {showComments && <div>Comments</div>}
    </div>
  );
}
