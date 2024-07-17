import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

// import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { Divider, InputAdornment, MenuItem } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import IconButton from '@mui/material/IconButton';
import { useBoolean } from 'src/hooks/use-boolean';

import { addUser, getCounties } from 'src/api/services';
import { County, SubCounty } from 'src/api/data.inteface';
import { MARITAL_STATUS_OPTIONS } from 'src/utils/default';

// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required!' }),
  lastName: zod.string().min(1, { message: 'Last name is required!' }),
  middleName: zod.string().min(1, { message: 'Middle name is required!' }),
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
  kraPin: zod.string().min(1, { message: 'KRA PIN is required!' }),
  // Not required
  acceptTerms: zod.boolean(),
  isAdministrator: zod.boolean(),
  userState: zod.string(),
  isSupport: zod.boolean(),
  userType: zod.string(),
  // avatarUrl: schemaHelper.file({ message: { required_error: 'Avatar is required!' } }),
});

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

export function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();
  const password = useBoolean();
  const [counties, setCounties] = useState<County[]>([]);
  const [subCounties, setSubCounties] = useState<SubCounty[]>([]);

  const defaultValues = useMemo(
    () => ({
      avatarUrl: currentUser?.avatarUrl || null,
      email: currentUser?.email || '',
      mobilePhone: '',
      firstName: '',
      lastName: '',
      middleName: '',
      userType: 'SYSTEM_ADMIN',
      password: '',
      birthDate: '2024-07-17T08:14:18.190Z',
      maritalStatus: 'single',
      kraPin: '',
      userState: 'A',
      residence: '',
      county: '',
      subCounty: '',
      ward: '',
      isAdministrator: true,
      isSupport: true,
      acceptTerms: true,
    }),
    [currentUser]
  );

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    console.log('DATA', data);

    try {
      await addUser(data);
      reset();
      toast.success(currentUser ? 'Update success!' : 'User created successfully!');
      // router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleCountyChange = (id: number) => {
    setSubCounties(counties.find((county) => county.id === id)?.subCounties || []);
  };

  // fetch counties

  const getchCounties = () => {
    getCounties()
      .then((data) => {
        console.log('data', data);
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

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={
                  (values.userState === 'active' && 'success') ||
                  (values.userState === 'banned' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.userState}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <Field.UploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentUser && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="userState"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{
                  mx: 0,
                  mb: 3,
                  width: 1,
                  justifyContent: 'space-between',
                }}
              />
            )}

            <Field.Switch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {currentUser && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Delete user
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Field.Text
                  name="firstName"
                  label="First name"
                  InputLabelProps={{ shrink: true }}
                />

                <Field.Text name="middleName" label="Middle name" />
              </Stack>

              <Field.Text name="lastName" label="Last name" InputLabelProps={{ shrink: true }} />

              <Field.Text name="email" label="Email address" />
              <Field.Text
                name="password"
                label="Password"
                placeholder="6+ characters"
                type={password.value ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Field.Phone name="mobilePhone" country="KE" label="Phone number" />

              <Field.DatePicker name="birthDate" label="DOB" />

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

              <Field.Text name="kraPin" label="KRA PIN" />

              <Field.Text name="residence" label="Residence" />

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
                      key={county.code}
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
                    <MenuItem key={subCounty.code} value={subCounty.name} onClick={() => null}>
                      {subCounty.name}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Stack>

              <Field.Text name="ward" label="Ward" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Create user' : 'Save changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
