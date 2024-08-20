import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Attraction, Reaction } from '../../../app/models/attraction.ts';
import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/store/configureStore.ts';
import { react } from '../list/attractionsSlice.ts';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';

interface Props {
  attraction: Attraction;
  onUpdateReaction?: (reaction: Reaction | null) => void;
}

const reactions: {
  type: Reaction;
  on: React.JSX.Element;
  off: React.JSX.Element;
}[] = [
  { type: 'Like', on: <ThumbUpAltIcon />, off: <ThumbUpOffAltIcon /> },
  { type: 'Dislike', on: <ThumbDownAltIcon />, off: <ThumbDownOffAltIcon /> },
];

export default function ReactToAttractionIcons({
  attraction,
  onUpdateReaction = () => void 0,
}: Props) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleClickReaction = async (reaction: Reaction) => {
    setLoading(true);
    dispatch(react({ attractionId: attraction.id, reaction: reaction }))
      .then(() => {
        const newReaction = attraction.reaction === reaction ? null : reaction;
        onUpdateReaction(newReaction);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      {reactions.map((r) => (
        <Box key={r.type}>
          <LoadingButton
            loading={loading}
            sx={{ color: 'inherit', minWidth: 'auto' }}
            onClick={() => handleClickReaction(r.type as Reaction)}
          >
            {attraction.reaction === r.type ? r.on : r.off}
          </LoadingButton>
        </Box>
      ))}
    </>
  );
}
