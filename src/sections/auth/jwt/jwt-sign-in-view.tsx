'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useLocalStorage } from 'src/hooks/use-local-storage';

import { signInWithMobilePhone } from 'src/api/services';

import { Form, Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify/iconify';

import { useAuthContext } from 'src/auth/hooks';
import { signInWithPassword, signInWithEmailPassword } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  mobilePhone: zod.string().min(1, { message: 'Phone number is required!' }),
  email: zod.string(),
  password: zod.string(),
});

export type EmailSignInSchemaType = zod.infer<typeof EmailSignInSchema>;

export const EmailSignInSchema = zod.object({
  email: zod.string().email({ message: 'Invalid email address' }),
  password: zod.string().min(1, { message: 'Required' }),

  mobilePhone: zod.string(),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();

  const { checkUserSession } = useAuthContext();
  const store = useLocalStorage('otp', { otp: { userId: 0 } });

  const [errorMsg, setErrorMsg] = useState('');
  const [signinType, setSigninType] = useState<'phone' | 'email'>('phone');

  const password = useBoolean();

  const defaultValues = {
    mobilePhone: '',
    email: '',
    password: '',
  };

  const methods = (
    signinType === 'phone' ? useForm<SignInSchemaType> : useForm<EmailSignInSchemaType>
  )({
    resolver: zodResolver(signinType === 'phone' ? SignInSchema : EmailSignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (signinType === 'email') {
        const auth = await signInWithEmailPassword({ email: data.email, password: data.password });
        signInWithPassword(auth);
        await checkUserSession?.();
        router.push('/dashboard');
        router.refresh();
      } else {
        const response = await signInWithMobilePhone({ mobilePhone: data.mobilePhone });
        // save to loca storage
        store.setField('otp', { userId: response.userId } as any);
        store.setState({ otp: { userId: response.userId } });
        // await checkUserSession?.();

        router.push('/auth/jwt/otp');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  });

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Sign in to your account</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`Don't have an account?`}
        </Typography>

        <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
          Get started
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      {signinType === 'phone' && (
        <Field.Phone
          name="mobilePhone"
          country="KE"
          label="Phone Number"
          InputLabelProps={{ shrink: true }}
        />
      )}

      {signinType === 'email' && (
        <>
          <Field.Text
            name="email"
            label="Email address"
            placeholder="Your email address"
            InputLabelProps={{ shrink: true }}
          />
          <Stack spacing={1.5}>
            <Link
              component={RouterLink}
              href="#"
              variant="body2"
              color="inherit"
              sx={{ alignSelf: 'flex-end' }}
            >
              Forgot password?
            </Link>

            <Field.Text
              name="password"
              label="Password"
              placeholder="8+ characters"
              type={password.value ? 'text' : 'password'}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </>
      )}
      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sign in..."
      >
        Sign in
      </LoadingButton>

      {/* or sign in with email and password */}

      <Stack spacing={2}>
        <Divider>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            OR
          </Typography>
        </Divider>

        <Button
          fullWidth
          size="large"
          variant="outlined"
          type="button"
          onClick={() => setSigninType(signinType === 'email' ? 'phone' : 'email')}
          sx={{ color: 'text.primary' }}
        >
          Sign in with {signinType === 'email' ? 'Phone' : 'Email'}
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <>
      {renderHead}
      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
