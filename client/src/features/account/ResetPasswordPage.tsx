import { useSearchParams } from 'react-router-dom';
import { Control, useForm } from 'react-hook-form';
import { Box, Grid, Paper, Typography } from '@mui/material';
import FormPassword from '../../app/components/form/FormPassword.tsx';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from '../../app/router/Routes.tsx';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import agent from '../../app/api/agent.ts';

const schema = yup
  .object({
    password: yup.string().required('Password is required'),
    repeatPassword: yup
      .string()
      .required('Repeat password is required')
      .oneOf([yup.ref('password')], 'Passwords must match'),
  })
  .required();

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!email || !token)
      router
        .navigate('/forgot-password')
        .then(() => toast.error('Invalid reset password link'));
  }, [email, token]);

  function resetPassword(password: string) {
    setLoading(true);
    agent.Account.resetPassword(email!, password, token!)
      .then((response) => {
        router.navigate('/login').then(() => toast.success(response));
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoading(false));
  }

  return (
    <Grid container>
      <Grid item xs={3}></Grid>

      <Grid item xs={6}>
        <Paper sx={{ m: 2, p: 3 }}>
          <Box display="flex" flexDirection="column" gap={1}>
            <form
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
              }}
              onSubmit={handleSubmit((data) => resetPassword(data.password))}
            >
              <Typography variant="h5">Reset password</Typography>

              <Typography>Email: {email}</Typography>

              <FormPassword
                label="New password"
                name="password"
                control={control as unknown as Control}
                fullWidth
              />

              <FormPassword
                label="Repeat new password"
                name="repeatPassword"
                control={control as unknown as Control}
                fullWidth
              />

              <LoadingButton
                loading={loading || isSubmitting}
                type="submit"
                variant="contained"
              >
                Reset password
              </LoadingButton>
            </form>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={3}></Grid>
    </Grid>
  );
}
