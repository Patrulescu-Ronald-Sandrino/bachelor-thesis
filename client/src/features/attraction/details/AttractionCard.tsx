import { Attraction } from '../../../app/models/attraction.ts';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import AttractionCardPictures from './AttractionCardPictures.tsx';
import AttractionCardIcons from '../common/AttractionCardIcons.tsx';
import CommentIcon from '@mui/icons-material/Comment';
import EditAttractionIcon from '../common/EditAttractionIcon.tsx';

interface Props {
  attraction: Attraction;
  toggleComments: () => void;
}

export function AttractionCard({ attraction, toggleComments }: Props) {
  return (
    <Grid item xs={6}>
      <Card>
        <AttractionCardPictures pictures={attraction.photos} />

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

        <CardActions
          disableSpacing
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box display="flex">
            <IconButton
              onClick={toggleComments}
              title="Comments"
              sx={{ color: 'inherit' }}
            >
              <CommentIcon />
            </IconButton>
            <AttractionCardIcons attraction={attraction} />
          </Box>

          <EditAttractionIcon attraction={attraction} />
        </CardActions>
      </Card>
    </Grid>
  );
}
