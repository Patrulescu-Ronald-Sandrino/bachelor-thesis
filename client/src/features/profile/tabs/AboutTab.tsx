import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAppSelector } from '../../../app/store/configureStore.ts';
import { UserProfile } from '../../../app/models/user.ts';
import agent from '../../../app/api/agent.ts';
import { toast } from 'react-toastify';

interface Props {
  profile: UserProfile;
}

export function AboutTab({ profile }: Props) {
  const user = useAppSelector((state) => state.account.user);
  const isSelf = user?.username === profile.username;

  const [isEdit, setIsEdit] = useState(false);
  const [bio, setBio] = useState(profile.bio || '');
  const [loading, setLoading] = useState(false);

  function handleSave() {
    setLoading(true);
    agent.User.updateBio(bio)
      .then(() => {
        toast.success('Bio updated');
        profile.bio = bio;
        setIsEdit(false);
      })
      .catch((e) => {
        toast.error(e);
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      {!isEdit ? (
        <>
          <Typography whiteSpace="pre-wrap">{bio}</Typography>

          {isSelf && (
            <Box display="flex" justifyContent="flex-end">
              <Button onClick={() => setIsEdit(true)} variant="contained">
                Update bio
              </Button>
            </Box>
          )}
        </>
      ) : (
        <>
          <TextField
            value={bio}
            placeholder="Bio"
            fullWidth
            variant="outlined"
            onChange={(event) => setBio(event.target.value)}
            multiline
          />

          <Box display="flex" gap={2} mt={2}>
            <Button
              variant="contained"
              color="inherit"
              onClick={() => {
                setIsEdit(false);
                setBio(profile.bio);
              }}
              disabled={loading}
            >
              Cancel
            </Button>

            <LoadingButton
              variant="contained"
              color="success"
              onClick={handleSave}
              loading={loading}
            >
              Save
            </LoadingButton>
          </Box>
        </>
      )}
    </>
  );
}
