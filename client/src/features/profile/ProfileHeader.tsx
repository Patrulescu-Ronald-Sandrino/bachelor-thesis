import { Avatar, Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { UserProfile } from '../../app/models/user.ts';

interface Props {
  user: UserProfile;
}

export default function ProfileHeader({ user }: Props) {
  return (
    <Paper>
      <Grid container>
        <Grid item xs={9}>
          <Box display="flex" alignItems="center" gap={2} m={2}>
            <Avatar src={user.photo} sx={{ width: 150, height: 150 }} />

            <Typography variant="h5" fontWeight="bold">
              {user.username}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={3} sx={{ pr: 1 }}>
          <Box display="flex" justifyContent="center" gap={2} pt={2}>
            <InfoItem
              name="Created attractions"
              value={`${user.createdAttractions}`}
            />

            <InfoItem
              name="Written comments"
              value={`${user.writtenComments}`}
            />
          </Box>

          <Divider />
        </Grid>
      </Grid>
    </Paper>
  );
}

function InfoItem({ name, value }: { name: string; value: string }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4">{value}</Typography>
      <Typography variant="subtitle1" sx={{ fontSize: 15 }}>
        {name}
      </Typography>
    </Box>
  );
}
