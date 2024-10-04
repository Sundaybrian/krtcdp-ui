import type { IUserItem } from 'src/types/user';
import type { ValueChain } from 'src/types/value-chain';
import type { Ward, County, SubCounty } from 'src/api/data.inteface';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { Divider, MenuItem, InputAdornment } from '@mui/material';

// import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useLocalStorage } from 'src/hooks/use-local-storage';

import {
  GENDER_OPTIONS,
  RELATIONSHIP_OPTIONS,
  TENANT_LOCAL_STORAGE,
  MARITAL_STATUS_OPTIONS,
} from 'src/utils/default';

import { useSearchCooperative } from 'src/actions/cooperative';
import { getWards, getCounties, addCoopFarmer, searchFarmValueChain } from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { Stepper } from '../_examples/extra/form-wizard-view/form-steps';

// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  coopId: zod.any(),
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
  hasInsurance: zod.boolean(),
  insuranceProvider: zod.string(),
  insuranceType: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

export function CoopFarmerNewEditForm({ currentUser }: Props) {
  const router = useRouter();
  const { searchResults } = useSearchCooperative();
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const password = useBoolean();
  const [counties, setCounties] = useState<County[]>([]);
  const [subCounties, setSubCounties] = useState<SubCounty[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [valueChains, setValueChains] = useState<ValueChain[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const defaultValues = useMemo(
    () => ({
      email: currentUser?.email || '',
      mobilePhone: '',
      firstName: '',
      lastName: '',
      middleName: '',
      userType: 'FARMER',
      password: '',
      birthDate: '',
      maritalStatus: 'single',
      kraPin: Math.random().toString(36).substring(7),
      userState: 'A',
      residence: '',
      county: '',
      subCounty: '',
      ward: '',
      isAdministrator: true,
      isSupport: true,
      acceptTerms: true,
      hasInsurance: false,
      insuranceProvider: '',
      insuranceType: '',
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
    const submitData = {
      user: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        mobilePhone: data.mobilePhone,
        birthDate: data.birthDate,
        kraPin: data.kraPin,
        residence: data.residence,
        county: data.county,
        subCounty: data.subCounty,
        ward: data.ward,
        userType: data.userType,
        isAdministrator: data.isAdministrator,
        isSupport: data.isSupport,
        acceptTerms: data.acceptTerms,
        userState: data.userState,
        maritalStatus: data.maritalStatus,
      },
      farmer: {
        maritalStatus: data.maritalStatus,
        hasInsurance: data.hasInsurance,
        insuranceProvider: data.insuranceProvider,
        insuranceType: data.insuranceType,
      },
    };

    try {
      if (!state.coopId && !data.coopId) {
        toast.error('Failed to create coop farmer');
      }
      await addCoopFarmer(state.coopId || data.coopId, submitData);

      reset();
      toast.success(currentUser ? 'Update success!' : 'User created successfully!');
      // router.push(paths.dashboard.user.list);
      console.info('DATA', data);
      setActiveStep(0);
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Failed to coop farmer');
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

  const fetchWards = (id: number) => {
    getWards(id)
      .then((data) => {
        setWards(data);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to fetch wards');
      });
  };

  const fetchValueChains = () => {
    searchFarmValueChain()
      .then((data) => {
        setValueChains(data.results);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to fetch wards');
      });
  };

  // use effect
  useEffect(() => {
    getchCounties();
    fetchValueChains();
  }, []);

  // methods
  const handleSubCountyChange = (id: number) => {
    fetchWards(id);
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stepper steps={['Farmer', 'Next of kin']} activeStep={activeStep} />

          {!state.coopId && (
            <Card sx={{ p: 3 }}>
              <Field.Select name="coopId" label="Cooperative">
                <MenuItem
                  value=""
                  onClick={() => null}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  None
                </MenuItem>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {searchResults.map((coop) => (
                  <MenuItem key={coop.krapin} value={coop.id} onClick={() => null}>
                    {coop.groupName}
                  </MenuItem>
                ))}
              </Field.Select>
            </Card>
          )}

          {activeStep === 0 && (
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

                <Field.Text name="coopMembershipNumber" label="Coop Membership Number" />

                <Field.DatePicker name="birthDate" label="DOB" />

                <Field.Select name="gender" label="Gender">
                  <MenuItem
                    value=""
                    onClick={() => null}
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    None
                  </MenuItem>

                  <Divider sx={{ borderStyle: 'dashed' }} />

                  {GENDER_OPTIONS.map((status) => (
                    <MenuItem key={status} value={status} onClick={() => null}>
                      {status}
                    </MenuItem>
                  ))}
                </Field.Select>

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
                        key={county.code + county.name}
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
                      <MenuItem
                        key={subCounty.code + subCounty.name}
                        value={subCounty.name}
                        onClick={() => {
                          handleSubCountyChange(subCounty.id);
                        }}
                      >
                        {subCounty.name}
                      </MenuItem>
                    ))}
                  </Field.Select>
                </Stack>

                {/* <Field.Text name="ward" label="Ward" /> */}
                <Field.Select name="ward" label="Ward">
                  <MenuItem value="" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    None
                  </MenuItem>

                  <Divider sx={{ borderStyle: 'dashed' }} />

                  {wards.map((ward) => (
                    <MenuItem key={ward.id + ward.name} value={ward.name}>
                      {ward.name}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Checkbox name="hasInhasInsurancesurance" label="Insured" />
                <Field.Text name="insuranceProvider" label="Insurance provider" />
                <Field.Text name="insuranceType" label="Insurance Type" />

                <Field.Select name="valueChain" label="Value chain">
                  <MenuItem
                    value=""
                    onClick={() => null}
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    None
                  </MenuItem>

                  <Divider sx={{ borderStyle: 'dashed' }} />

                  {valueChains.map((chain) => (
                    <MenuItem key={chain.id + chain.valueChainName} value={chain.valueChainName}>
                      {chain.valueChainName}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setActiveStep(1);
                  }}
                >
                  Next
                </Button>
                {/* <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!currentUser ? 'Submit' : 'Save changes'}
                </LoadingButton> */}
              </Stack>
            </Card>
          )}

          {activeStep === 1 && (
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

                <Field.Phone name="mobilePhone" country="KE" label="Phone number" />

                <Field.Select name="maritalStatus" label="Relationship">
                  <MenuItem
                    value=""
                    onClick={() => null}
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    None
                  </MenuItem>

                  <Divider sx={{ borderStyle: 'dashed' }} />

                  {RELATIONSHIP_OPTIONS.map((status) => (
                    <MenuItem key={status} value={status} onClick={() => null}>
                      {status}
                    </MenuItem>
                  ))}
                </Field.Select>

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
                        key={county.code + county.name}
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
                      <MenuItem
                        key={subCounty.code + subCounty.name}
                        value={subCounty.name}
                        onClick={() => {
                          handleSubCountyChange(subCounty.id);
                        }}
                      >
                        {subCounty.name}
                      </MenuItem>
                    ))}
                  </Field.Select>
                </Stack>

                {/* <Field.Text name="ward" label="Ward" /> */}
                <Field.Select name="ward" label="Ward">
                  <MenuItem value="" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    None
                  </MenuItem>

                  <Divider sx={{ borderStyle: 'dashed' }} />

                  {wards.map((ward) => (
                    <MenuItem key={ward.id + ward.name} value={ward.name}>
                      {ward.name}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Box>

              <Stack
                spacing={2}
                sx={{ mt: 3, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    setActiveStep(0);
                  }}
                >
                  Prev
                </Button>

                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!currentUser ? 'Submit' : 'Save changes'}
                </LoadingButton>
              </Stack>
            </Card>
          )}
        </Grid>
      </Grid>
    </Form>
  );
}
