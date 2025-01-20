import type { Cooperative } from 'src/types/user';
import type { County, SubCounty } from 'src/api/data.inteface';
import type { InsuranceProvider } from 'src/types/transaction';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { Divider, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { INSURANCE_TYPE_OPTIONS } from 'src/utils/default';

import {
  getCounties,
  createCooperative,
  updateCooperative,
  searchInsuranceProviders,
} from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  groupName: zod.string().min(1, { message: 'Group name is required!' }),
  mobilePhone: zod.string().refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
  yearOfCreation: zod.string().min(1, { message: 'Year of creation is required!' }),
  incorporationNumber: zod.string().min(1, { message: 'Incorporation number is required!' }),
  residence: zod.string().min(1, { message: 'Residence is required!' }),
  county: zod.string().min(1, { message: 'County is required!' }),
  subCounty: zod.string().min(1, { message: 'Sub county is required!' }),
  // Not required
  insuranceProvider: zod.string(),
  insuranceType: zod.string(),
  krapin: zod.string(),
  enterpriseCovered: zod.string(),
  hasInsurance: zod.boolean(),
});

// ----------------------------------------------------------------------

type Props = {
  cooperative?: Cooperative;
};

export function CooperativeNewEditForm({ cooperative }: Props) {
  const router = useRouter();
  const [counties, setCounties] = useState<County[]>([]);
  const [subCounties, setSubCounties] = useState<SubCounty[]>([]);
  const [insuranceProviders, setInsuranceProviders] = useState<InsuranceProvider[]>([]);

  const defaultValues = useMemo(
    () => ({
      groupName: cooperative?.groupName || '',
      mobilePhone: cooperative?.mobilePhone || '',
      yearOfCreation: cooperative?.yearOfCreation || '',
      residence: cooperative?.residence || '',
      county: cooperative?.county || '',
      subCounty: cooperative?.subCounty || '',
      insuranceProvider: cooperative?.insuranceProvider || '',
      incorporationNumber: cooperative?.incorporationNumber || '',
      krapin: cooperative?.krapin || '',
      enterpriseCovered: cooperative?.enterpriseCovered || '',
      insuranceType: cooperative?.insuranceType || '',
      hasInsurance: cooperative?.hasInsurance || false,
    }),
    [cooperative]
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
    data.yearOfCreation = new Date(data.yearOfCreation).getFullYear() as any;
    try {
      if (cooperative?.id) {
        await updateCooperative(cooperative.id, data);
      } else {
        await createCooperative(data);
        reset();
      }
      toast.success(cooperative ? 'Update success!' : 'Cooperative created successfully!');
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
  // get insurance providers
  const getInsuranceProviders = () => {
    searchInsuranceProviders()
      .then((data) => {
        setInsuranceProviders(data.results);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to fetch insurance providers');
      });
  };

  // use effect
  useEffect(() => {
    getchCounties();
    getInsuranceProviders();
  }, []);

  useEffect(() => {
    if (cooperative) {
      reset(defaultValues);
    }
  }, [cooperative, defaultValues, reset]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="groupName" label="Group name" InputLabelProps={{ shrink: true }} />

              <Field.Phone name="mobilePhone" country="KE" label="Phone number" />

              <Field.DatePicker name="yearOfCreation" label="Year of registration" />

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
                      key={county.code + county.id}
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
                      onClick={() => null}
                    >
                      {subCounty.name}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Stack>
              <Field.Text name="incorporationNumber" label="Incorporation number" />
              <Field.Text name="krapin" label="KRA PIN" />
              <Field.Checkbox name="hasInsurance" label="Insured" />

              {values.hasInsurance && (
                <>
                  <Field.Select name="insuranceProvider" label="Insurance provider">
                    <MenuItem
                      value=""
                      onClick={() => null}
                      sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                    >
                      None
                    </MenuItem>

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    {insuranceProviders.map((provider) => (
                      <MenuItem
                        key={provider.id + provider.name}
                        value={provider.name}
                        onClick={() => null}
                      >
                        {provider.name}
                      </MenuItem>
                    ))}
                  </Field.Select>

                  <Field.Select name="insuranceType" label="Insurance Type">
                    <MenuItem
                      value=""
                      onClick={() => null}
                      sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                    >
                      None
                    </MenuItem>

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    {INSURANCE_TYPE_OPTIONS.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Field.Select>
                  <Field.Text name="enterpriseCovered" label="Enterprise covered" />
                </>
              )}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!cooperative ? 'Submit' : 'Save changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
