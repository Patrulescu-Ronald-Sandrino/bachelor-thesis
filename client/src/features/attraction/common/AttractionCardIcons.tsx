import { Attraction, Reaction } from '../../../app/models/attraction.ts';
import { Box } from '@mui/material';
import ShareAttraction from './ShareAttraction.tsx';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import React, { useState } from 'react';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch } from '../../../app/store/configureStore.ts';
import { react } from '../list/attractionsSlice.ts';
import { useLocation } from 'react-router-dom';

interface Props {
  attraction: Attraction;
}

const reactions: {
  type: Reaction;
  on: React.JSX.Element;
  off: React.JSX.Element;
}[] = [
  { type: 'Like', on: <ThumbUpAltIcon />, off: <ThumbUpOffAltIcon /> },
  { type: 'Dislike', on: <ThumbDownAltIcon />, off: <ThumbDownOffAltIcon /> },
];

export default function AttractionCardIcons({ attraction }: Props) {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleReaction = async (reaction: Reaction) => {
    setLoading(true);
    dispatch(react({ attractionId: attraction.id, reaction: reaction }))
      .then(() => {
        if (pathname.includes(attraction.id)) {
          attraction.reaction =
            attraction.reaction === reaction ? null : reaction;
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box display="flex" alignItems="center">
      {reactions.map((r) => (
        <Box key={r.type}>
          <LoadingButton
            loading={loading}
            sx={{ color: 'inherit', minWidth: 'auto' }}
            onClick={() => handleReaction(r.type as Reaction)}
          >
            {attraction.reaction === r.type ? r.on : r.off}
          </LoadingButton>
        </Box>
      ))}
      <ShareAttraction attraction={attraction} />
    </Box>
  );
}
