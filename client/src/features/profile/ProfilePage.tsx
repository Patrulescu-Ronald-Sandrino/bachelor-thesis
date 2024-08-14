import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import ProfileHeader from './ProfileHeader.tsx';
import ProfileContent from './ProfileContent.tsx';
import { useEffect, useState } from 'react';
import agent from '../../app/api/agent.ts';
import NotFound from '../../app/errors/NotFound.tsx';
import { router } from '../../app/router/Routes.tsx';
import { UserProfile } from '../../app/models/user.ts';
import { toast } from 'react-toastify';
import Loadable from '../../app/layout/Loadable.tsx';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (username === undefined) void router.navigate('/not-found');
    else
      agent.User.profile(username)
        .then((profile) => setProfile(profile))
        .catch((e) => toast.error(e))
        .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <Loadable loading={loading} target="profile" />;
  if (!profile) return <NotFound />;

  return (
    <Grid container rowGap={2}>
      <Grid item xs={12}>
        <ProfileHeader profile={profile} />
      </Grid>

      <Grid item xs={12}>
        <ProfileContent profile={profile} />
      </Grid>
    </Grid>
  );
}
