import { Attraction } from '../../../app/models/attraction.ts';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Link,
  Typography,
} from '@mui/material';
import AttractionsIcon from '@mui/icons-material/Attractions';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PlaceIcon from '@mui/icons-material/Place';
import AttractionEditAndShareIcons from '../common/AttractionEditAndShareIcons.tsx';

const detailsFields = [
  { icon: AttractionsIcon, getter: (a: Attraction) => a.attractionType },
  {
    icon: LocationCityIcon,
    getter: (a: Attraction) => a.city + ', ' + a.country,
  },
  { icon: PlaceIcon, getter: (a: Attraction) => a.address },
];

interface Props {
  attraction: Attraction;
}

export default function AttractionCard({ attraction }: Props) {
  return (
    <Card>
      <CardHeader
        title={
          <Typography
            title={attraction.name}
            noWrap
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              overflowY: 'clip',
            }}
          >
            {attraction.name}
          </Typography>
        }
      />

      {attraction.photos.length > 0 ? (
        <CardMedia
          sx={{ height: 130 }}
          image={attraction.photos[0]}
          title={attraction.name}
        />
      ) : (
        <Box
          sx={{ height: 130 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          no picture
        </Box>
      )}

      <CardContent
        sx={{
          paddingBottom: 0.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        {detailsFields.map((detailsField, index) => (
          <Box key={index} display="flex" alignItems="center" gap={0.75}>
            <detailsField.icon sx={{ color: 'gray' }} />
            <Typography
              variant="body2"
              noWrap
              title={detailsField.getter(attraction)}
            >
              {detailsField.getter(attraction)}
            </Typography>
          </Box>
        ))}
      </CardContent>

      <CardActions
        disableSpacing
        sx={{
          p: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button
          component={Link}
          href={`/attractions/${attraction.id}`}
          size="small"
        >
          View
        </Button>

        <AttractionEditAndShareIcons attraction={attraction} />
      </CardActions>
    </Card>
  );
}
