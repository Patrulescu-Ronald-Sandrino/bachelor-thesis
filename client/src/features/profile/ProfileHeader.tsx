import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { UserProfile } from '../../app/models/user.ts';
import { useAppSelector } from '../../app/store/configureStore.ts';
import { LoadingButton } from '@mui/lab';
import { useSearchParams } from 'react-router-dom';
import {
  FriendshipActionAdd,
  FriendshipActionType,
  FriendshipStatusToActionName,
} from '../../app/models/friendship.ts';
import { AvatarComponent } from './ProfileHeaderAvatar.tsx';
import { useState } from 'react';
import agent from '../../app/api/agent.ts';
import { toast } from 'react-toastify';

interface Props {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export default function ProfileHeader({ profile, setProfile }: Props) {
  const user = useAppSelector((state) => state.account.user);
  const isSelf = user?.username === profile.username;

  const [searchParams] = useSearchParams();
  const showFriendshipButtons =
    !isSelf && !(searchParams.get('tab') === 'friends');

  const [loadingFriendshipAction, setLoadingFriendshipAction] = useState(false);
  const isAddAction = (actionName: FriendshipActionType) =>
    FriendshipActionAdd.some((x) => x === actionName);

  function handleFriendshipAction(actionName: FriendshipActionType) {
    setLoadingFriendshipAction(true);

    const apiCaller = isAddAction(actionName)
      ? agent.Friendships.add
      : agent.Friendships.delete;

    apiCaller(profile.username)
      .then((response) => {
        setProfile({ ...profile, friendshipStatus: response });
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoadingFriendshipAction(false));
  }

  return (
    <Paper>
      <Grid container>
        <Grid item xs={9}>
          <Box display="flex" alignItems="center" gap={2} m={2}>
            <AvatarComponent profile={profile} isSelf={isSelf} />

            <Typography variant="h5" fontWeight="bold">
              {profile.username}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={3} sx={{ pr: 1 }}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent={showFriendshipButtons ? 'space-between' : undefined}
            sx={{ height: '100%' }}
          >
            <Box display="flex" justifyContent="center" gap={2} pt={2}>
              <InfoItem
                name="Created attractions"
                value={`${profile.createdAttractions}`}
              />

              <InfoItem
                name="Written comments"
                value={`${profile.writtenComments}`}
              />
            </Box>

            <Divider />

            {showFriendshipButtons && (
              <Box className="centered" flexGrow={1} gap={1}>
                {FriendshipStatusToActionName[profile.friendshipStatus].map(
                  (actionName) => (
                    <LoadingButton
                      loading={loadingFriendshipAction}
                      variant="contained"
                      key={actionName}
                      onClick={() => handleFriendshipAction(actionName)}
                      color={isAddAction(actionName) ? 'success' : 'error'}
                      sx={{ textTransform: 'none' }}
                    >
                      {actionName}
                    </LoadingButton>
                  ),
                )}
              </Box>
            )}
          </Box>
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
