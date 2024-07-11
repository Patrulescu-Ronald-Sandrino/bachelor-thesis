import { useAppSelector } from '../../app/store/configureStore.ts';
import { Box, Button, Grid, IconButton, Link, Typography } from '@mui/material';
import AttractionsIcon from '@mui/icons-material/Attractions';

export default function HomePage() {
  const { user } = useAppSelector((state) => state.account);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs="auto">
        <Box display="flex" alignItems="center" flexDirection="column" gap={2}>
          <Box display="flex" alignItems="center">
            <IconButton component={Link} href="/" edge="start" color="inherit">
              <AttractionsIcon fontSize="large" />
            </IconButton>
            <Link href={'/attractions'} sx={{ textDecoration: 'none' }}>
              <Typography variant="h4" style={{ color: 'black' }}>
                Attractions
              </Typography>
            </Link>
          </Box>
          <Box>
            <Typography>Welcome to Attractions</Typography>
          </Box>
          {user ? (
            <Box>
              Go to{' '}
              <Link href={'/attractions'} style={{ textDecoration: 'none' }}>
                Attractions
              </Link>
            </Box>
          ) : (
            <Box display="flex" gap={2}>
              <Button component={Link} href={'/login'}>
                Login
              </Button>
              <Button component={Link} href={'/register'}>
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
