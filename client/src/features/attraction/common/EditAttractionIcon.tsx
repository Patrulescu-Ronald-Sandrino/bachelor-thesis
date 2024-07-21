import { IconButton, Link } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Attraction } from '../../../app/models/attraction.ts';
import { useAppSelector } from '../../../app/store/configureStore.ts';

interface Props {
  attraction: Attraction;
}

export default function EditAttractionIcon({ attraction }: Props) {
  const user = useAppSelector((state) => state.account).user!;

  if (user.id !== attraction.creatorId) return null;

  return (
    <IconButton
      component={Link}
      href={`/attractions/${attraction.id}/edit`}
      color="inherit"
      title="Edit"
    >
      <EditIcon />
    </IconButton>
  );
}
