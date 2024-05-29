import ClickableIcon from '../../app/components/ClickableIcon.tsx';
import { useState } from 'react';

const imageSize = '35em';
const imageNumberCircleSize = '1.2em';

interface Props {
  pictures: string[];
}

export default function AttractionCardPictures({ pictures }: Props) {
  const [index, setIndex] = useState<number>(0);
  const hasPrevious = index > 0;
  const hasNext = index < pictures.length - 1;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        height: imageSize,
        width: imageSize,
        backgroundColor: 'darkgrey',
      }}
      className="centered"
    >
      {pictures.length == 0 ? (
        <div>No pictures available</div>
      ) : (
        <div className="centered">
          <img
            src={pictures[index]}
            alt={pictures[index]}
            style={{ height: imageSize, width: imageSize }}
          />
          {hasPrevious && (
            <div style={{ position: 'absolute', top: '50%', left: '0%' }}>
              <ClickableIcon
                icon="/icons/previous.svg"
                onClick={() => setIndex((x) => x - 1)}
                nonHoverFill="white"
              />
            </div>
          )}
          {hasNext && (
            <div style={{ position: 'absolute', top: '50%', right: '0%' }}>
              <ClickableIcon
                icon="/icons/next.svg"
                onClick={() => setIndex((x) => x + 1)}
                nonHoverFill="white"
              />
            </div>
          )}
          <div
            style={{ position: 'absolute', bottom: '0.5em' }}
            className="centered"
          >
            {[...Array(pictures.length).keys()].map((i) => (
              <div
                key={i}
                onClick={() => setIndex(i)}
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  marginRight: '0.25em',
                  color: 'white',
                  border: '1px solid #666',
                  borderRadius: '50%',
                  width: imageNumberCircleSize,
                  lineHeight: imageNumberCircleSize,
                  backgroundColor: i === index ? '#a89d9d' : 'transparent',
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
