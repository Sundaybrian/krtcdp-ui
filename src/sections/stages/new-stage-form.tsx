import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Chip, Divider, MenuItem } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

// import { paths } from 'src/routes/paths';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { TENANT_LOCAL_STORAGE } from 'src/utils/default';

import {
  createNotification,
  createRoute,
  createStage,
  createTicket,
  getCounties,
  getRoutes,
  getWards,
} from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import useAuthUser from 'src/auth/hooks/use-auth-user';
import { County, SubCounty, Ward } from 'src/api/data.inteface';
import { Route, StageItem } from 'src/types/notification';
// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  description: zod.string().optional(),
  sequence: zod.any().optional(),
  routeId: zod.any().optional(),
  estimatedDistance: zod.string().optional(),
  longitude: zod.string().optional(),
  latitude: zod.string().optional(),
  estimatedDuration: zod.string().optional(),
  areaBoundaries: zod.string().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  routeId?: number;
};

export function NewEditStageForm({ routeId }: Props) {
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const [counties, setCounties] = useState<Route[]>([]);

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      sequence: '',
      routeId: '',
      estimatedDistance: '',
      longitude: '',
      latitude: '',
      estimatedDuration: '',
      areaBoundaries: '',
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const submitData = {
      ...data,
      estimatedDistance: Number(data.estimatedDistance),
      estimatedDuration: Number(data.estimatedDuration),
      sequence: Number(data.sequence),
    };

    try {
      await createStage(submitData);
      reset();
      toast.success('Stage created successfully');
      // router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create stage');
    }
  });

  // fetch counties
  const getchRoutes = () => {
    getRoutes()
      .then((data) => {
        setCounties(data.results);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to fetch routes. Please try again later.');
      });
  };

  // use effect
  useEffect(() => {
    getchRoutes();
  }, [state.coopId]);

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
                label="Route Name"
                placeholder="Enter route name"
                InputLabelProps={{ shrink: true }}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Field.Select name="routeId" label="Route" placeholder="Select route">
                  <MenuItem
                    value=""
                    onClick={() => null}
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    None
                  </MenuItem>

                  <Divider sx={{ borderStyle: 'dashed' }} />

                  {counties.map((county) => (
                    <MenuItem key={county.id + county.name} value={county.id}>
                      {county.name}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Stack>

              <Field.Text name="sequence" label="Sequence" placeholder="Enter sequence" />

              <Field.Text multiline rows={4} name="description" label="Description" />

              <Field.Text
                name="estimatedDistance"
                label="Estimated Distance (km)"
                placeholder="Enter estimated distance"
                InputLabelProps={{ shrink: true }}
              />

              <Field.Text
                name="estimatedDuration"
                label="Estimated Duration (minutes)"
                placeholder="Enter estimated duration"
                InputLabelProps={{ shrink: true }}
              />

              <Field.Text
                name="longitude"
                label="Longitude"
                placeholder="Enter longitude"
                InputLabelProps={{ shrink: true }}
              />

              <Field.Text
                name="latitude"
                label="Latitude"
                placeholder="Enter latitude"
                InputLabelProps={{ shrink: true }}
              />
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
