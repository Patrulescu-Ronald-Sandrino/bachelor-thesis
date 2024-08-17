import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  Link,
  Typography,
} from '@mui/material';

interface Props {
  username: string;
  photo: string;
}

export default function ProfileCard({ username, photo }: Props) {
  return (
    <Card
      component={Link}
      href={`/user/${username}`}
      sx={{ textDecoration: 'none' }}
    >
      <Box margin={1} marginBottom={0}>
        <CardMedia image={photo} sx={{ height: 100, width: 100 }} />

        <CardHeader title={<Typography variant="h6">{username}</Typography>} />
      </Box>
    </Card>
  );
}
