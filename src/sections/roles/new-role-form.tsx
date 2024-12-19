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

import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem/MenuItem';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { createRole } from 'src/api/permission';
import { useSearchApps } from 'src/actions/permission';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import useAuthUser from 'src/auth/hooks/use-auth-user';
// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  name: zod.string().min(3),
  isSuperAdmin: zod.boolean(),
  applicationId: zod.number().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  selectedAdmin?: IUserItem;
};

export function RoleForm({ selectedAdmin }: Props) {
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const { id } = useAuthUser();

  const userSearch = state.coopId
    ? {
        coopId: Number(state.coopId),
      }
    : {};
  const { applications } = useSearchApps({});

  const defaultValues = useMemo(
    () => ({
      name: '',
      isSuperAdmin: false,
      applicationId: 0,
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
    try {
      await createRole(data);
      reset();
      toast.success('Role created successfully');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create role');
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
              <Field.Select name="unionId" label="Cooperative Union">
                <MenuItem
                  value=""
                  onClick={() => null}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  None
                </MenuItem>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {applications.map((app) => (
                  <MenuItem key={app.id + app.name} value={app.id} onClick={() => {}}>
                    {app.name}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text name="name" label="Role" />

              <Field.Checkbox name="isSuperAdmin" label="Super Admin" />
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
