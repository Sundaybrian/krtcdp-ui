import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { useMemo } from 'react';
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

import { useSearchAdmins } from 'src/actions/user';
import { createNotification, createTicket } from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import useAuthUser from 'src/auth/hooks/use-auth-user';
// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  ownerId: zod.number().optional(),
  status: zod.string().optional(),
  source: zod.string().optional(),
  imageUrls: zod.array(zod.string()).optional(),
  description: zod.string().optional(),
  locationName: zod.string().optional(),
  farmType: zod.string().optional(),
  coopId: zod.number().optional(),
  whoPays: zod.string().optional(),
  latitude: zod.string().optional(),
  longitude: zod.string().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  selectedAdmin?: IUserItem;
};

export function NotificationForm({ selectedAdmin }: Props) {
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const { id } = useAuthUser();

  const userSearch = state.coopId
    ? {
        coopId: Number(state.coopId),
      }
    : {};
  const { userResults } = useSearchAdmins({ ...userSearch });

  const defaultValues = useMemo(
    () => ({
      ownerId: id,
      status: 'New',
      source: 'Web',
      imageUrls: [],
      description: '',
      locationName: '',
      farmType: '',
      coopId: state.coopId ? Number(state.coopId) : 0,
      whoPays: 'FARMER',
      latitude: '',
      longitude: '',
    }),
    [id, state.coopId]
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
      description: data.description || 'No description provided',
      coopId: state.coopId ? Number(state.coopId) : 0,
      status: 'New',
      source: 'Web',
      imageUrls: ['https://example.com/image.jpg'], // Placeholder image URL
      ownerId: id,
    };

    try {
      await createTicket(submitData);
      reset();
      toast.success('Ticket created successfully');
      // router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create ticket');
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
              <Field.Autocomplete
                name="onwerId"
                label="Select Owner"
                placeholder="Select owner"
                freeSolo
                disableCloseOnSelect
                options={userResults.map((user) => user)}
                getOptionLabel={(option) => option?.firstName || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option.email || option.id}>
                    {option.firstName}--{option.email}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.email}
                      label={option.email}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
              />

              <Field.Select
                name="farmType"
                size="medium"
                label="Farm Type"
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem
                  value=""
                  onClick={() => null}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  None
                </MenuItem>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {['LIVESTOCK', 'CROP'].map((service) => (
                  <MenuItem key={service} value={service} onClick={() => null}>
                    {service}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select
                name="whoPays"
                size="medium"
                label="Who Pays"
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem
                  value=""
                  onClick={() => null}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  None
                </MenuItem>
                <Divider sx={{ borderStyle: 'dashed' }} />

                {['FARMER', 'COOPERATIVE'].map((service) => (
                  <MenuItem key={service} value={service} onClick={() => null}>
                    {service}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text multiline rows={4} name="description" label="Description" />

              <Field.Text
                name="locationName"
                label="Location Name"
                placeholder="Enter location name"
                InputLabelProps={{ shrink: true }}
              />

              <Field.Text
                name="latitude"
                label="Latitude"
                placeholder="Enter latitude"
                InputLabelProps={{ shrink: true }}
              />

              <Field.Text
                name="longitude"
                label="Longitude"
                placeholder="Enter longitude"
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
