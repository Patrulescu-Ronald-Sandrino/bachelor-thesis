import { useAppDispatch } from '../../app/store/configureStore.ts';
import { useRef, useState } from 'react';
import agent from '../../app/api/agent.ts';
import { setUserPhoto } from '../account/accountSlice.ts';
import { toast } from 'react-toastify';
import { Avatar, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { UserProfile } from '../../app/models/user.ts';

interface Props {
  profile: UserProfile;
  isSelf: boolean;
}

export function AvatarComponent({ profile, isSelf }: Props) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function uploadPhoto(file: File) {
    setLoading(true);
    agent.User.changePhoto(file)
      .then((response) => {
        dispatch(setUserPhoto(response));
        profile.photo = response;
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
        profile.photo = null;
        toast.success('Photo deleted');
      })
      .catch((e) => {
        console.log(e);
        toast.error(e);
      })
      .finally(() => setLoading(false));
  }

  return (
    <Box position="relative">
      <Avatar
        src={profile.photo as string | undefined}
        style={{ border: '0.1px solid lightgray' }}
        sx={{ width: 150, height: 150 }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.opacity = isSelf ? `${0.5}` : `${1}`)
        }
        onMouseLeave={(e) => (e.currentTarget.style.opacity = `${1}`)}
      />

      {isSelf && (
        <Box position="absolute" bottom={0} left={0} right={0} margin="auto">
          <Box display="flex" flexDirection="row" justifyContent="center">
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
                  e.target.files?.[0] && uploadPhoto(e.target.files?.[0])
                }
              />
            </LoadingButton>

            {profile.photo && (
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
  );
}
