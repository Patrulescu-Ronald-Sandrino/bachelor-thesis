import {
  AppBar,
  Box,
  Button,
  IconButton,
  Link,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material';
import HeaderMenu from './HeaderMenu.tsx';
import AddIcon from '@mui/icons-material/Add';
import AttractionsIcon from '@mui/icons-material/Attractions';
import { useAppSelector } from '../store/configureStore.ts';

interface Props {
  darkMode: boolean;
  handleThemeChange: () => void;
}

export default function Header({ darkMode, handleThemeChange }: Props) {
  const { user } = useAppSelector((state) => state.account);

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
          {user && (
            <Link href={'/attractions'} sx={{ textDecoration: 'none' }}>
              <Typography variant="h6" style={{ color: 'white' }}>
                Attractions
              </Typography>
            </Link>
          )}
          <Switch checked={darkMode} onChange={handleThemeChange} />
        </Box>

        <Box></Box>

        <Box display="flex" alignItems="center">
          {user ? (
            <>
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
            </>
          ) : (
            <Box>
              {['Login', 'Register'].map((item) => (
                <Button
                  component={Link}
                  href={`/${item.toLowerCase()}`}
                  color="inherit"
                  sx={{ typography: 'h6' }}
                  key={item}
                >
                  {item}
                </Button>
              ))}
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
