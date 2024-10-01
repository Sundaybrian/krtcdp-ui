import type { CreateUnion } from 'src/types/user';
import type { County } from 'src/api/data.inteface';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

// import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getCounties, updateUnion, createUnion } from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  name: zod.string().min(1, { message: 'Union name is required!' }),
  location: zod.string().min(1, { message: 'Location is required!' }),
  registrationDate: zod.string().min(1, { message: 'Year of registration is required!' }),
  totalCooperatives: zod.string().min(1, { message: 'NUmber of cooperatives required' }),
  contactEmail: zod.string().email().min(1, { message: 'Contact email is required!' }),
  phoneNumber: zod.string().refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
  address: zod.string().min(1, { message: 'Address is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  union?: CreateUnion;
};

export function UnionNewEditForm({ union }: Props) {
  const router = useRouter();
  const [counties, setCounties] = useState<County[]>([]);

  const defaultValues = useMemo(
    () => ({
      name: union?.name || '',
      location: union?.location || '',
      registrationDate: union?.registrationDate || '',
      totalCooperatives: union?.totalCooperatives || '',
      contactEmail: union?.contactEmail || '',
      phoneNumber: union?.phoneNumber || '',
      address: union?.address || '',
    }),
    [union]
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
    data.registrationDate = new Date(data.registrationDate).toISOString();
    data.totalCooperatives = Number(data.totalCooperatives) as any;
    try {
      if (union?.id) {
        await updateUnion(union.id!, data);
      } else {
        await createUnion(data);
        reset();
      }
      toast.success(union ? 'Update success!' : 'Cooperative created successfully!');
      // router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

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

  useEffect(() => {
    if (union) {
      reset(defaultValues);
    }
  }, [union, defaultValues, reset]);

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
              <Field.Text name="name" label="Uion name" InputLabelProps={{ shrink: true }} />

              <Field.Text name="location" label="Location" />

              <Field.DatePicker name="registrationDate" label="Year of registration" />

              <Field.Text name="totalCooperatives" label="Number of cooperatives" />

              <Field.Text name="contactEmail" label="Contact Email" />

              <Field.Phone name="phoneNumber" country="KE" label="Phone number" />

              <Field.Text name="address" label="Address" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!union ? 'Submit' : 'Save changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
