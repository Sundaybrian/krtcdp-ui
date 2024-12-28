import type { InsuranceProvider } from 'src/types/transaction';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

// import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { createInsuranceProvider } from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  coverageTypes: zod.array(zod.string()),
  specialFeatures: zod.array(zod.string()),
  targetMarket: zod.array(zod.string()),
  contactPhone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  contactEmail: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  website: zod.string().url({ message: 'Website must be a valid URL!' }),
  status: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentUser?: InsuranceProvider;
};

export function ProviderNewEditForm({ currentUser }: Props) {
  const router = useRouter();
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      description: currentUser?.description || '',
      coverageTypes: currentUser?.coverageTypes || [],
      specialFeatures: currentUser?.specialFeatures || [],
      targetMarket: currentUser?.targetMarket || [],
      contactPhone: currentUser?.contactPhone || '',
      contactEmail: currentUser?.contactEmail || '',
      website: currentUser?.website || '',
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
    try {
      const user = await createInsuranceProvider(data);
      reset();
      toast.success(currentUser ? 'Update success!' : 'Provider created successfully!');
      // assignAdminToCoop
    } catch (error) {
      toast.error(currentUser ? 'Update error!' : 'Failed to create provider');
      console.error(error);
    }
  });

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
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Field.Text name="name" label="Name" InputLabelProps={{ shrink: true }} />

                <Field.Phone country="KE" name="contactPhone" label="Phone Number" />
              </Stack>

              <Field.Text name="contactEmail" label="Email" InputLabelProps={{ shrink: true }} />

              <Field.Text name="webiste" label="Website Url" />

              <Field.Text rows={4} name="desscription" label="Description" />
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
