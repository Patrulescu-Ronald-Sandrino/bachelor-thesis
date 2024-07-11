import {
  AppBar,
  Box,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';
import HeaderMenu from './HeaderMenu.tsx';
import AddIcon from '@mui/icons-material/Add';
import AttractionsIcon from '@mui/icons-material/Attractions';

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box display="flex" alignItems="center">
          <IconButton component={Link} href="/" edge="start">
            <AttractionsIcon fontSize="large" />
          </IconButton>
          <Link href={'/attractions'}>
            <Typography variant="h6" style={{ color: 'white' }}>
              Attractions
            </Typography>
          </Link>
        </Box>
        <Box></Box>
        <Box display="flex" alignItems="center">
          <IconButton
            component={Link}
            href="/attractions/add"
            size="small"
            color="inherit"
            title={'Add Attraction'}
          >
            <AddIcon fontSize="large" />
          </IconButton>
          <HeaderMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
