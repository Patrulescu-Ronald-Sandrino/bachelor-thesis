import { Attraction, Reaction } from '../../../app/models/attraction.ts';
import { Box } from '@mui/material';
import ShareAttractionIcon from './ShareAttractionIcon.tsx';
import ReactToAttractionIcons from './ReactToAttractionIcons.tsx';
import AddToCollectionIcon from './AddToCollectionIcon.tsx';

interface Props {
  attraction: Attraction;
  onUpdateReaction?: (reaction: Reaction | null) => void;
}

export default function AttractionCardIcons({
  attraction,
  onUpdateReaction,
}: Props) {
  return (
    <Box display="flex" alignItems="center">
      <ReactToAttractionIcons
        attraction={attraction}
        onUpdateReaction={onUpdateReaction}
      />

      <ShareAttractionIcon attraction={attraction} />

      <AddToCollectionIcon attraction={attraction} />
    </Box>
  );
}
