import {
  Box,
  Container,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FieldValues, useForm } from 'react-hook-form';
import { signInUser } from './accountSlice.ts';
import {
  useAppDispatch,
  useAppSelector,
} from '../../app/store/configureStore.ts';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: 'onTouched',
    defaultValues: { email: searchParams.get('email') || '', password: '' },
  });
  const { user } = useAppSelector((state) => state.account);

  async function submitForm(data: FieldValues) {
    try {
      await dispatch(signInUser(data));
      navigate(location.state?.from || '/attractions');
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (user) {
      navigate('/attractions');
    }
  }, [navigate, user]);

  return (
    <Container
      component={Paper}
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 4,
      }}
      className={'centered-both'}
    >
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(submitForm)}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          fullWidth
          label="Email"
          autoFocus
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
              message: 'Not a valid email address',
            },
          })}
          error={!!errors.email}
          helperText={errors?.email?.message as string}
          autoComplete="username"
        />
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          {...register('password', { required: 'Password is required' })}
          error={!!errors.password}
          helperText={errors?.password?.message as string}
          autoComplete="current-password"
        />
        <LoadingButton
          loading={isSubmitting}
          disabled={!isValid}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link href={'/register'} underline={'none'}>
              Don't have an account? Register
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
