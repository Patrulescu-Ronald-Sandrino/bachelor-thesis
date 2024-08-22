import { useEffect, useState } from 'react';
import {
  FriendshipsDto,
  FriendshipStatus,
  FriendshipStatusList,
} from '../../../app/models/friendship.ts';
import agent from '../../../app/api/agent.ts';
import { toast } from 'react-toastify';
import Loadable from '../../../app/layout/Loadable.tsx';
import {
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useAppSelector } from '../../../app/store/configureStore.ts';
import { dateDiff, formatDateDetailed } from '../../../app/util/date.ts';

const getKeys = <T extends object>(x: T) =>
  (Object.keys(x) as (keyof T)[]) ?? [];

interface Props {
  username: string;
}

export function FriendsTab({ username }: Props) {
  const user = useAppSelector((state) => state.account.user)!;
  const isSelf = user.username === username;

  const [loading, setLoading] = useState(true);
  const [friendships, setFriendships] = useState<FriendshipsDto>(
    {} as FriendshipsDto,
  );
  const [status, setStatus] = useState<FriendshipStatus>('Accepted');

  const filteredFriendships =
    (isSelf
      ? friendships[status]
      : getKeys(friendships)
          .map((key) => friendships[key])
          .flat()
          .sort((a, b) => dateDiff(a.modifiedAt, b.modifiedAt))) ?? [];

  useEffect(() => {
    agent.Friendships.list(username)
      .then((response) => {
        setFriendships(response);
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoading(false));
  }, [username]);

  return (
    <Stack spacing={2}>
      {isSelf && (
        <Box className="centered-flex" gap={1}>
          {FriendshipStatusList.filter((x) => x !== 'None').map((s) => (
            <Button
              onClick={() => setStatus(s)}
              key={s}
              variant={s === status ? 'contained' : 'outlined'}
            >
              {s}
            </Button>
          ))}
        </Box>
      )}

      <Loadable loading={loading} className="centered" spinner>
        {filteredFriendships.length === 0 ? (
          <Box className="centered-flex">No people</Box>
        ) : (
          <Box>
            <Grid container rowSpacing={3} columnSpacing={3}>
              {filteredFriendships.map((item) => (
                <Grid item xs={2.4} key={item.username}>
                  <Paper
                    component={Link}
                    href={`/user/${item.username}`}
                    className="centered-flex"
                    gap={2}
                    flexDirection="column"
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      paddingY: 1.5,
                    }}
                  >
                    <Avatar
                      src={item.userPhoto}
                      style={{ border: '0.1px solid lightgray' }}
                      sx={{ width: 90, height: 90 }}
                    />

                    <Typography
                      title={
                        isSelf
                          ? `Since ${formatDateDetailed(item.modifiedAt + 'Z')}`
                          : undefined
                      }
                    >
                      {item.username}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Loadable>
    </Stack>
  );
}
