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
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem/MenuItem';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { createUserRole } from 'src/api/permission';
import { useSearchRoles, useSearchUsers } from 'src/actions/permission';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import useAuthUser from 'src/auth/hooks/use-auth-user';
// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  mambuUserId: zod.any(),
  roleId: zod.any(),
});
// .nonempty({ message: 'Choose at least one option!' })
// ----------------------------------------------------------------------

type Props = {
  selectedAdmin?: IUserItem;
};

export function UserRoleForm({ selectedAdmin }: Props) {
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const { id } = useAuthUser();

  const userSearch = state.coopId
    ? {
        coopId: Number(state.coopId),
      }
    : {};

  const { users } = useSearchUsers({});
  const { roles } = useSearchRoles({});

  const defaultValues = useMemo(
    () => ({
      mambuUserId: '' as any,
      roleId: [],
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
    console.log(data);

    try {
      const userRoleData = data.roleId.map((roleId: any) => ({
        mambuUserId: data.mambuUserId,
        roleId,
      }));
      await createUserRole(userRoleData);
      reset();
      toast.success('User role created successfully');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create user role');
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
              <Field.Select name="mambuUserId" label="User">
                <MenuItem
                  value=""
                  onClick={() => null}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  None
                </MenuItem>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {users.map((user) => (
                  <MenuItem key={user.id + user.username} value={user.id} onClick={() => {}}>
                    {user.username}
                  </MenuItem>
                ))}
              </Field.Select>

              {/* {list of checkboxes to select roles} */}

              <Stack spacing={1}>
                <Typography variant="subtitle2">Roles</Typography>
                <Field.MultiCheckbox
                  row
                  name="roleId"
                  slotProps={{
                    wrap: { display: 'flex', flexDirection: 'column' },
                    checkbox: { sx: { ml: 0 } },
                  }}
                  options={roles.map((role) => ({
                    label: role.name,
                    value: role.id as any,
                  }))}
                  sx={{ gap: 4 }}
                />
              </Stack>
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
