import { Attraction } from '../../../app/models/attraction.ts';
import { Box } from '@mui/material';
import ShareAttraction from './ShareAttraction.tsx';

interface Props {
  attraction: Attraction;
}

export default function AttractionCardIcons({ attraction }: Props) {
  return (
    <Box>
      <ShareAttraction attraction={attraction} />
    </Box>
  );
}
