import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

// import { paths } from 'src/routes/paths';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { createShift } from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  startTime: zod.string().optional(),
  endTime: zod.string().optional(),
  cooperativeId: zod.number().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  selectedAdmin?: IUserItem;
};

export function NotificationForm({ selectedAdmin }: Props) {
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const defaultValues = useMemo(
    () => ({
      name: '',
      startTime: '',
      endTime: '',
      cooperativeId: state.coopId ? Number(state.coopId) : 0,
    }),
    [state.coopId]
  );

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    // Ensure startTime and endTime are in HH:mm format
    const formatToHHmm = (dateString?: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    const submitData = {
      ...data,
      startTime: formatToHHmm(data.startTime),
      endTime: formatToHHmm(data.endTime),
      cooperativeId: state.coopId ? Number(state.coopId) : 0,
    };

    try {
      await createShift(submitData);
      reset();
      toast.success('Shift created successfully');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create Shift');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
            >
              <Field.Text
                name="name"
                label="Shift Name"
                placeholder="Enter shift name"
                InputLabelProps={{ shrink: true }}
              />

              <Field.MobileDateTimePicker name="startTime" label="Start Time" />

              <Field.MobileDateTimePicker name="endTime" label="End Time" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Submit
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
