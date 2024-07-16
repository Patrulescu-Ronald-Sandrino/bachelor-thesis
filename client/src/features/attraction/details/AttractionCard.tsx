import { Attraction } from '../../../app/models/attraction.ts';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import ShareAttraction from '../ShareAttraction.tsx';
import AttractionCardPictures from './AttractionCardPictures.tsx';

interface Props {
  attraction: Attraction;
  toggleComments: () => void;
}

export function AttractionCard({ attraction, toggleComments }: Props) {
  return (
    <Grid item xs={6}>
      <Card>
        {/*TODO: replace with actual pictures*/}
        <AttractionCardPictures
          pictures={[
            'https://i.imgur.com/6LlO6sO.png',
            'https://i.imgur.com/JZmHnyR.png',
            'https://i.imgur.com/4bd9A68.jpeg',
          ]}
        />

        <CardHeader
          title={attraction.name}
          titleTypographyProps={{ variant: 'h6' }}
          sx={{ padding: 1.5, paddingLeft: 2, paddingBottom: 0 }}
        />

        <CardContent>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>{attraction.attractionType}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>{`${attraction.city}, ${attraction.country}`}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell>{attraction.address}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Website</TableCell>
                  <TableCell>
                    <Link
                      href={attraction.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {attraction.website}
                    </Link>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography
                      fontSize="small"
                      sx={{
                        overflowY: 'auto',
                        height: 100,
                      }}
                    >
                      {attraction.description}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>

        <CardActions disableSpacing>
          <Button onClick={toggleComments}>Toggle comments</Button>
          <ShareAttraction attraction={attraction} />
        </CardActions>
      </Card>
    </Grid>
  );
}
