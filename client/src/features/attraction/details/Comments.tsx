import { Box, Grid } from '@mui/material';

export default function Comments() {
  return (
    <Grid item xs={6}>
      <Box sx={{ backgroundColor: 'pink' }}>
        <h3>Comments</h3>
        <p>Comment 1</p>
        <p>Comment 2</p>
      </Box>
    </Grid>
  );
}
