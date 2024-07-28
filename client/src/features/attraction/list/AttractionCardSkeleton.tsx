import {
  Box,
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
        title={<Skeleton animation="wave" height={32} width="80%" />}
      />
      <Skeleton sx={{ height: 130 }} animation="wave" variant="rectangular" />
      <CardContent sx={{ paddingBottom: 0.5 }}>
        <Box display="flex" flexDirection="column" gap={0.5}>
          <Skeleton animation="wave" height={24} width="60%" />
          <Skeleton animation="wave" height={24} width="60%" />
          <Skeleton animation="wave" height={24} width="60%" />
        </Box>
      </CardContent>
      <CardActions>
        <>
          <Skeleton animation="wave" height={32} width="20%" />
          <Skeleton animation="wave" height={32} width="10%" />
        </>
      </CardActions>
    </Grid>
  );
}
