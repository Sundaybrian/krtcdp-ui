'use client';

import { z as zod } from 'zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { MenuItem, Divider } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { signUp } from 'src/auth/context/jwt';
import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';
import { useAuthContext } from 'src/auth/hooks';
import { MARITAL_STATUS_OPTIONS, USER_TYPES } from 'src/utils/default';
import { getCounties } from 'src/api/services';
import { toast } from 'src/components/snackbar';
import { County, SubCounty } from 'src/api/data.inteface';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

// ----------------------------------------------------------------------

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

export const SignUpSchema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required!' }),
  lastName: zod.string().min(1, { message: 'Last name is required!' }),
  middleName: zod.string(),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(8, { message: 'Password must be at least 6 characters!' }),
  mobilePhone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  // country: schemaHelper.objectOrNull<string | null>({
  //   message: { required_error: 'Country is required!' },
  // }),
  birthDate: zod.string().min(1, { message: 'DOB is required!' }),
  ward: zod.string().min(1, { message: 'Ward is required!' }),
  residence: zod.string().min(1, { message: 'Residence is required!' }),
  county: zod.string().min(1, { message: 'County is required!' }),
  maritalStatus: zod.string().min(1, { message: 'Marital Status is required!' }),
  subCounty: zod.string().min(1, { message: 'Sub county is required!' }),
  // kraPin: zod.string().min(1, { message: 'KRA PIN is required!' }),
  // Not required
  acceptTerms: zod.boolean(),
  isAdministrator: zod.boolean(),
  userState: zod.string(),
  isSupport: zod.boolean(),
  userType: zod.string(),
  kraPin: zod.string(),
});

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const { checkUserSession } = useAuthContext();
  const [counties, setCounties] = useState<County[]>([]);
  const [subCounties, setSubCounties] = useState<SubCounty[]>([]);

  const router = useRouter();

  const password = useBoolean();

  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues = {
    email: '',
    mobilePhone: '',
    firstName: '',
    lastName: '',
    middleName: '',
    userType: '',
    password: '',
    birthDate: '',
    maritalStatus: '',
    kraPin: '',
    userState: 'A',
    residence: '',
    county: '',
    subCounty: '',
    ward: '',
    isAdministrator: false,
    isSupport: false,
    acceptTerms: true,
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);

    try {
      await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        mobilePhone: data.mobilePhone,
        userType: data.userType,
        birthDate: data.birthDate,
        maritalStatus: data.maritalStatus,
        kraPin: data.kraPin,
        userState: data.userState,
        residence: data.residence,
        county: data.county,
        subCounty: data.subCounty,
        ward: data.ward,
        isAdministrator: data.isAdministrator,
        isSupport: data.isSupport,
        acceptTerms: data.acceptTerms,
      });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  });

  const handleCountyChange = (id: number) => {
    setSubCounties(counties.find((county) => county.id === id)?.subCounties || []);
  };

  // fetch counties

  const getchCounties = () => {
    getCounties()
      .then((data) => {
        setCounties(data);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to fetch counties');
      });
  };

  // use effect
  useEffect(() => {
    getchCounties();
  }, []);

  const test = () => {
    console.log('test');
    console.log('values', methods.getValues());
  };

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Get started</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Already have an account?
        </Typography>

        <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
          Sign in
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Field.Text name="firstName" label="First name" InputLabelProps={{ shrink: true }} />
        <Field.Text name="lastName" label="Last name" InputLabelProps={{ shrink: true }} />
      </Stack>

      <Field.Select
        name="userType"
        size="medium"
        label="Register as"
        InputLabelProps={{ shrink: true }}
        // sx={{ maxWidth: { md: 160 } }}
      >
        <MenuItem
          value=""
          onClick={() => null}
          sx={{ fontStyle: 'italic', color: 'text.secondary' }}
        >
          None
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {USER_TYPES.map((service) => (
          <MenuItem key={service.value} value={service.value} onClick={() => null}>
            {service.label}
          </MenuItem>
        ))}
      </Field.Select>

      <Field.Text name="email" label="Email address" InputLabelProps={{ shrink: true }} />
      <Field.Phone name="mobilePhone" country="KE" label="Phone number" />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Field.Select name="maritalStatus" label="Marital status">
          <MenuItem
            value=""
            onClick={() => null}
            sx={{ fontStyle: 'italic', color: 'text.secondary' }}
          >
            None
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {MARITAL_STATUS_OPTIONS.map((status) => (
            <MenuItem key={status} value={status} onClick={() => null}>
              {status}
            </MenuItem>
          ))}
        </Field.Select>
        <Field.DatePicker name="birthDate" label="DOB" />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Field.Text name="kraPin" label="KRA PIN" />

        <Field.Text name="residence" label="Residence" />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Field.Select name="county" label="County">
          <MenuItem
            value=""
            onClick={() => null}
            sx={{ fontStyle: 'italic', color: 'text.secondary' }}
          >
            None
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {counties.map((county) => (
            <MenuItem
              key={county.id}
              value={county.name}
              onClick={() => {
                handleCountyChange(county.id);
              }}
            >
              {county.name}
            </MenuItem>
          ))}
        </Field.Select>

        <Field.Select name="subCounty" label="Sub county">
          <MenuItem
            value=""
            onClick={() => null}
            sx={{ fontStyle: 'italic', color: 'text.secondary' }}
          >
            None
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {subCounties.map((subCounty) => (
            <MenuItem key={subCounty.id} value={subCounty.name} onClick={() => null}>
              {subCounty.name}
            </MenuItem>
          ))}
        </Field.Select>
      </Stack>

      <Field.Text name="ward" label="Ward" />

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

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        onClick={test}
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Create account..."
      >
        Create account
      </LoadingButton>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 3,
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
      }}
    >
      {'By signing up, I agree to '}
      <Link underline="always" color="text.primary">
        Terms of service
      </Link>
      {' and '}
      <Link underline="always" color="text.primary">
        Privacy policy
      </Link>
      .
    </Typography>
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

      {renderTerms}
    </>
  );
}
