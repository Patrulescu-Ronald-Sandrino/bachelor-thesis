import { Avatar, Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { UserProfile } from '../../app/models/user.ts';
import {
  useAppDispatch,
  useAppSelector,
} from '../../app/store/configureStore.ts';
import { LoadingButton } from '@mui/lab';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { useRef, useState } from 'react';
import agent from '../../app/api/agent.ts';
import { toast } from 'react-toastify';
import { setUserPhoto } from '../account/accountSlice.ts';

interface Props {
  user: UserProfile;
}

export default function ProfileHeader({ user }: Props) {
  const dispatch = useAppDispatch();
  const loggedInUsername = useAppSelector(
    (state) => state.account.user?.username,
  );
  const isSelf = loggedInUsername === user.username;

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function uploadPhoto(file: File) {
    setLoading(true);
    agent.User.changePhoto(file)
      .then((response) => {
        dispatch(setUserPhoto(response));
        user.photo = response;
        toast.success('Photo changed');
      })
      .catch((e) => {
        console.log(e);
        toast.error(e);
      })
      .finally(() => setLoading(false));
  }

  function deletePhoto() {
    setLoading(true);
    agent.User.deletePhoto()
      .then(() => {
        dispatch(setUserPhoto(null));
        user.photo = null;
        toast.success('Photo deleted');
      })
      .catch((e) => {
        console.log(e);
        toast.error(e);
      })
      .finally(() => setLoading(false));
  }

  return (
    <Paper>
      <Grid container>
        <Grid item xs={9}>
          <Box display="flex" alignItems="center" gap={2} m={2}>
            <Box position="relative">
              <Avatar
                src={user.photo as string | undefined}
                sx={{ width: 150, height: 150, opacity: 0.8 }}
              />

              {isSelf && (
                <Box
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  margin="auto"
                >
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                  >
                    <LoadingButton
                      color="inherit"
                      loading={loading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <AddAPhotoIcon />
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          uploadPhoto(e.target.files?.[0])
                        }
                      />
                    </LoadingButton>

                    {user.photo && (
                      <LoadingButton
                        color="inherit"
                        onClick={deletePhoto}
                        loading={loading}
                      >
                        <NoPhotographyIcon />
                      </LoadingButton>
                    )}
                  </Box>
                </Box>
              )}
            </Box>

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
