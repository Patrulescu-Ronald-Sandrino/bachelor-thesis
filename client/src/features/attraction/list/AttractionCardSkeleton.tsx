import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Skeleton,
} from '@mui/material';

export default function AttractionCardSkeleton() {
  return (
    <Grid item xs component={Card}>
      <CardHeader
        title={
          <Skeleton
            animation="wave"
            height={26}
            width="80%"
            style={{ marginBottom: 6 }}
          />
        }
      />
      <Skeleton sx={{ height: 140 }} animation="wave" variant="rectangular" />
      <CardContent>
        <>
          <Skeleton animation="wave" height={24} width="60%" />
          <Skeleton animation="wave" height={24} width="60%" />
          <Skeleton animation="wave" height={24} width="60%" />
        </>
      </CardContent>
      <CardActions>
        <>
          <Skeleton animation="wave" height={30} width="20%" />
          <Skeleton animation="wave" height={30} width="10%" />
        </>
      </CardActions>
    </Grid>
  );
}
