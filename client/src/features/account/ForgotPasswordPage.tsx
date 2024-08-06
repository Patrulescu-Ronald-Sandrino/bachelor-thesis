import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Control, useForm } from 'react-hook-form';
import { Grid, Paper, Typography } from '@mui/material';
import FormTextInput from '../../app/components/form/FormTextInput.tsx';
import agent from '../../app/api/agent.ts';
import { toast } from 'react-toastify';
import Loadable from '../../app/layout/Loadable.tsx';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';

const schema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
});

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();
  const [loadingEffect, setLoadingEffect] = useState(false);
  const [calledEffect, setCalledEffect] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{
    email: string;
  }>({
    resolver: yupResolver(schema),
  });
  const email = getValues('email');

  function forgotPassword(email: string) {
    setLoading(true);
    agent.Account.forgotPassword(email)
      .then((response) => {
        toast.success(response);
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const searchParamsEmail = searchParams.get('email');
    if (searchParamsEmail && email !== searchParamsEmail && !calledEffect) {
      setValue('email', searchParamsEmail);
    }
  }, [calledEffect, email, searchParams, setValue]);

  const searchParamsEmail = searchParams.get('email');
  const shouldCallEffect =
    !calledEffect && !!searchParamsEmail && searchParamsEmail !== '';

  useEffect(() => {
    if (shouldCallEffect) {
      setLoadingEffect(true);
      agent.Account.forgotPassword(searchParamsEmail)
        .then((response) => {
          toast.success(response);
        })
        .catch((error) => toast.error(error))
        .finally(() => {
          setLoadingEffect(false);
          setCalledEffect(true);
        });
    }
  }, [shouldCallEffect, searchParamsEmail]);

  return (
    <Loadable
      loading={loadingEffect || shouldCallEffect}
      message="Sending email..."
    >
      <Grid container>
        <Grid item xs={3}></Grid>

        <Grid item xs={6}>
          <Paper sx={{ m: 2, p: 3 }}>
            <form
              onSubmit={handleSubmit((data) => forgotPassword(data.email))}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Typography variant="h5">Forgot password</Typography>

              <FormTextInput
                control={control as unknown as Control}
                label="Email"
                name="email"
                fullWidth
              />

              <LoadingButton
                loading={loading || isSubmitting}
                type="submit"
                variant="contained"
              >
                Send reset password email
              </LoadingButton>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={3}></Grid>
      </Grid>
    </Loadable>
  );
}
