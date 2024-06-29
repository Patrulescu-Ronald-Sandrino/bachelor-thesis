import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Container,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import agent from '../../app/api/agent.ts';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: 'onTouched',
  });

  function handleApiErrors(errors: string[]) {
    if (errors) {
      errors.forEach((error: string) => {
        if (error.includes('Password')) {
          setError('password', { message: error });
        } else if (error.includes('Email')) {
          setError('email', { message: error });
        } else if (error.includes('Username')) {
          setError('username', { message: error });
        }
      });
    }
  }

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
        Register
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit((data) =>
          agent.Account.register(data)
            .then(() => {
              toast.success('Registration successful - you can now login');
              navigate('/login');
            })
            .catch((error: unknown) => {
              console.log(error);
              handleApiErrors(error as string[]);
            }),
        )}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          fullWidth
          label="Username"
          autoFocus
          {...register('username', { required: 'Username is required' })}
          error={!!errors.username}
          helperText={errors?.username?.message as string}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
              message: 'Not a valid email address',
            },
          })}
          error={!!errors.email}
          helperText={errors?.email?.message as string}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          {...register('password', {
            required: 'Password is required',
          })}
          error={!!errors.password}
          helperText={errors?.password?.message as string}
        />
        <LoadingButton
          loading={isSubmitting}
          disabled={!isValid}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link href={'/login'} underline={'none'}>
              Already have an account? Sign In
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
