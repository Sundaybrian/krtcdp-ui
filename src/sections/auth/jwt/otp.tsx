'use client';

import { z as zod } from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useCountdownSeconds } from 'src/hooks/use-countdown';
import { useLocalStorage } from 'src/hooks/use-local-storage';

import { validateOtp } from 'src/api/services';
import { EmailInboxIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { resendSignUpCode } from 'src/auth/context/amplify';
import { signInWithPassword } from 'src/auth/context/jwt/action';

// ----------------------------------------------------------------------

export type VerifySchemaType = zod.infer<typeof VerifySchema>;

export const VerifySchema = zod.object({
  otp: zod
    .string()
    .min(1, { message: 'Code is required!' })
    .min(4, { message: 'Code must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function OtpVerify() {
  const router = useRouter();
  const { checkUserSession } = useAuthContext();

  const searchParams = useSearchParams();
  const { state } = useLocalStorage('otp', { otp: { userId: 0 } });

  const email = searchParams.get('email');

  const { countdown, counting, startCountdown } = useCountdownSeconds(60);

  const defaultValues = { otp: '' };

  const methods = useForm<VerifySchemaType>({
    resolver: zodResolver(VerifySchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await validateOtp({ userId: state.otp.userId, otp: data.otp });
      signInWithPassword(response);
      await checkUserSession?.();
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  });

  const handleResendCode = useCallback(async () => {
    try {
      startCountdown();
      await resendSignUpCode?.({ username: values.otp });
    } catch (error) {
      console.error(error);
    }
  }, [startCountdown, values.otp]);

  const renderHead = (
    <>
      <EmailInboxIcon sx={{ mx: 'auto' }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5, textAlign: 'center', whiteSpace: 'pre-line' }}>
        <Typography variant="h5">OTP signin</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`We've sent a 6-digit confirmation code. \nPlease enter the code to verify your signin.`}
        </Typography>
      </Stack>
    </>
  );

  const renderForm = (
    <Stack spacing={3}>
      {/* <Field.Text
        name="email"
        label="Email address"
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
        disabled
      /> */}

      <Field.Code name="otp" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Verify..."
      >
        Verify
      </LoadingButton>

      <Typography variant="body2" sx={{ mx: 'auto' }}>
        {`Don’t have a code? `}
        <Link
          variant="subtitle2"
          onClick={handleResendCode}
          sx={{
            cursor: 'pointer',
            ...(counting && { color: 'text.disabled', pointerEvents: 'none' }),
          }}
        >
          Resend code {counting && `(${countdown}s)`}
        </Link>
      </Typography>

      <Link
        component={RouterLink}
        href={paths.auth.amplify.signIn}
        color="inherit"
        variant="subtitle2"
        sx={{ gap: 0.5, alignSelf: 'center', alignItems: 'center', display: 'inline-flex' }}
      >
        <Iconify width={16} icon="eva:arrow-ios-back-fill" />
        Return to sign in
      </Link>
    </Stack>
  );

  return (
    <>
      {renderHead}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
