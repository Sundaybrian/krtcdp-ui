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

import { addUser, createCooperative, getCounties } from 'src/api/services';
import { County, SubCounty } from 'src/api/data.inteface';
import { INSURANCE_TYPE_OPTIONS } from 'src/utils/default';

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
  krapin: zod.string().min(1, { message: 'KRA PIN is required!' }),
  enterpriseCovered: zod.string(),
  hasInsurance: zod.boolean(),
});

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

export function CooperativeNewEditForm({ currentUser }: Props) {
  const router = useRouter();
  const [counties, setCounties] = useState<County[]>([]);
  const [subCounties, setSubCounties] = useState<SubCounty[]>([]);

  const defaultValues = useMemo(
    () => ({
      groupName: '',
      mobilePhone: '',
      yearOfCreation: '',
      residence: '',
      county: '',
      subCounty: '',
      insuranceProvider: '',
      incorporationNumber: '',
      krapin: '',
      enterpriseCovered: '',
      insuranceType: '',
      hasInsurance: true,
    }),
    []
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
      await createCooperative(data);
      reset();
      toast.success(currentUser ? 'Update success!' : 'Cooperative created successfully!');
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
              <Field.Text name="insuranceProvider" label="Insurance provider" />
              <Field.Text name="incorporationNumber" label="Incorporation number" />
              <Field.Text name="krapin" label="KRA PIN" />
              <Field.Text name="enterpriseCovered" label="Enterprise covered" />
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

              <Field.Checkbox name="hasInsurance" label="Insured" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Submit' : 'Save changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
