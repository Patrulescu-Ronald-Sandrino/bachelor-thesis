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
import ShareAttraction from '../ShareAttraction.tsx';

const detailsFields = [
  { icon: <AttractionsIcon />, getter: (a: Attraction) => a.attractionType },
  {
    icon: <LocationCityIcon />,
    getter: (a: Attraction) => a.city + ', ' + a.country,
  },
  { icon: <PlaceIcon />, getter: (a: Attraction) => a.address },
];

interface Props {
  attraction: Attraction;
}

export default function AttractionCard({ attraction }: Props) {
  // TODO: replace with actual picture
  const mainPictureUrl = 'https://i.imgur.com/6LlO6sO.png';

  return (
    <Card>
      <CardHeader
        title={attraction.name}
        titleTypographyProps={{
          sx: { fontWeight: 'bold', color: 'primary.main' },
        }}
      />

      {mainPictureUrl ? (
        <CardMedia
          sx={{ height: 140 }}
          image={mainPictureUrl}
          title={attraction.name}
        />
      ) : (
        <Box
          sx={{ height: 140 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          no picture
        </Box>
      )}

      <CardContent>
        {detailsFields.map((detailsField, index) => (
          <Box key={index} display="flex" alignItems="center" gap={0.75}>
            {detailsField.icon}
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

      <CardActions disableSpacing>
        <Button
          component={Link}
          href={`/attractions/${attraction.id}`}
          size="small"
        >
          View
        </Button>

        <ShareAttraction attraction={attraction} />
      </CardActions>
    </Card>
  );
}
