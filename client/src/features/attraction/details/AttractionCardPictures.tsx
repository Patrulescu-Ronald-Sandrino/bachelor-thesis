import { Box, CardMedia, IconButton } from '@mui/material';
import { useState } from 'react';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';

interface Props {
  pictures: string[];
}

export default function AttractionCardPictures({ pictures }: Props) {
  const height = 300;
  const imageNumberCircleSize = '1.2em';
  const hasMultipleImages = () => pictures.length > 1;
  const [index, setIndex] = useState(0);

  function previous() {
    setIndex((x) => (x - 1 + pictures.length) % pictures.length);
  }

  function next() {
    setIndex((x) => (x + 1) % pictures.length);
  }

  const actions = [
    { icon: <SkipPreviousIcon />, side: 'left', handler: previous },
    { icon: <SkipNextIcon />, side: 'right', handler: next },
  ].filter(hasMultipleImages);

  if (pictures.length === 0) {
    return (
      <Box
        sx={{ height: height }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        No pictures
      </Box>
    );
  }

  return (
    <Box position="relative">
      <CardMedia sx={{ height: height }} image={pictures[index]} />

      {actions.map((item) => (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            [item.side]: '0%',
            transform: 'translate(0, -50%)',
          }}
          key={item.side}
        >
          <IconButton onClick={item.handler} sx={{ color: 'black' }}>
            {item.icon}
          </IconButton>
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          bottom: '0.5em',
          left: '50%',
          transform: 'translate(-50%, 0)',
        }}
        className="centered"
      >
        {[...Array(pictures.length).keys()]
          .filter(hasMultipleImages)
          .map((i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              style={{
                cursor: i === index ? 'default' : 'pointer',
                textAlign: 'center',
                marginRight: '0.25em',
                color: 'black',
                border: '1px solid black',
                borderRadius: '50%',
                width: imageNumberCircleSize,
                lineHeight: imageNumberCircleSize,
                backgroundColor:
                  i === index ? 'rgba(188,190,196,0.8)' : 'transparent',
              }}
            >
              {i + 1}
            </div>
          ))}
      </div>
    </Box>
  );
}
