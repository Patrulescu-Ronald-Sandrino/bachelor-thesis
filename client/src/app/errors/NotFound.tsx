import {
  Button,
  Container,
  Divider,
  Link,
  Paper,
  Typography,
} from '@mui/material';
import { useAppSelector } from '../store/configureStore.ts';

export default function NotFound() {
  const { user } = useAppSelector((state) => state.account);

  return (
    <Container component={Paper} sx={{ height: 400 }}>
      <Typography gutterBottom variant="h3">
        Oops - we could not find what are you looking for
      </Typography>
      <Divider />
      {user ? (
        <Button fullWidth component={Link} href="/attractions">
          Go to attractions
        </Button>
      ) : (
        <Button fullWidth component={Link} href="/">
          Go to home
        </Button>
      )}
    </Container>
  );
}
