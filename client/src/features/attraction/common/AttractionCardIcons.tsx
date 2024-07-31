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
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const reaction = attraction.reaction;

  const handleReaction = async (newReaction: Reaction) => {
    setLoading(true);
    dispatch(
      react({ attractionId: attraction.id, reaction: newReaction }),
    ).finally(() => setLoading(false));
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
            {reaction === r.type ? r.on : r.off}
          </LoadingButton>
        </Box>
      ))}
      <ShareAttraction attraction={attraction} />
    </Box>
  );
}
