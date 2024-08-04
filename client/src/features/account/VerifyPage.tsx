import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Paper, Typography } from '@mui/material';
import agent from '../../app/api/agent.ts';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import Loadable from '../../app/layout/Loadable.tsx';
import { useAppSelector } from '../../app/store/configureStore.ts';

export default function VerifyPage() {
  const { user } = useAppSelector((state) => state.account);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFromRegister = location.state?.from.pathname === '/register';
  const email = searchParams.get('email') as string;
  const token = isFromRegister ? null : (searchParams.get('token') as string);

  useEffect(() => {
    if (!token) return;

    setPageLoading(true);
    agent.Account.verifyEmail(email, token)
      .then(() => {
        toast.success('Email verified successfully');
        navigate('/login');
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => setPageLoading(false));
  }, [email, token, navigate]);

  function handleResendEmailVerification() {
    setLoading(true);
    agent.Account.resendEmailVerification(email)
      .then((response: string) => {
        toast.success(response);
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => setLoading(false));
  }

  if (!pageLoading && user) return <Navigate to={'/attractions'} />;

  return (
    <Loadable loading={pageLoading}>
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        {isFromRegister ? (
          <div>
            <Typography variant="h5" sx={{ pb: 2 }}>
              Successfully registered
            </Typography>
            <Typography>
              Please check your email (including junk email) for the
              verification email.
            </Typography>
            <br />
            <Typography>
              Didn't receive the email? Click the bellow button to resend
            </Typography>
          </div>
        ) : (
          <div>
            <Typography variant="h5" sx={{ pb: 2 }}>
              Email verification
            </Typography>
            <Typography>
              Verification failed. You can try resending the verify link to your
              email
            </Typography>
          </div>
        )}

        <LoadingButton
          loading={loading}
          variant="contained"
          onClick={handleResendEmailVerification}
          sx={{ mt: 2 }}
          size="large"
        >
          Resend email verification
        </LoadingButton>
      </Paper>
    </Loadable>
  );
}
