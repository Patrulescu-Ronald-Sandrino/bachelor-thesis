import { Attraction } from '../../../app/models/attraction.ts';
import { Box } from '@mui/material';
import EditAttractionIcon from './EditAttractionIcon.tsx';
import ShareAttraction from './ShareAttraction.tsx';

export default function AttractionEditAndShareIcons(props: {
  attraction: Attraction;
}) {
  return (
    <Box>
      <EditAttractionIcon attraction={props.attraction} />
      <ShareAttraction attraction={props.attraction} />
    </Box>
  );
}
