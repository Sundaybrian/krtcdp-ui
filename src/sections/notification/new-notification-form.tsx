import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Chip } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

// import { paths } from 'src/routes/paths';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { useSearchAdmins } from 'src/actions/user';
import { createNotification } from 'src/api/services';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import useAuthUser from 'src/auth/hooks/use-auth-user';
// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  users: zod.array(zod.any()),
  title: zod.string(),
  message: zod.string(),
  fromUserId: zod.number().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  selectedAdmin?: IUserItem;
};

export function NotificationForm({ selectedAdmin }: Props) {
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const { id } = useAuthUser();

  const { userResults } = useSearchAdmins({ userType: 'COOPERATIVE_ADMIN' });

  const defaultValues = useMemo(
    () => ({
      users: [],
      title: '',
      message: '',
      fromUserId: id,
    }),
    [id]
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
    data.users = data.users.map((admin: any) => admin.id);
    const submitData = {
      targetUserId: data.users,
      title: data.title,
      message: data.message,
      fromUserId: data.fromUserId,
    };

    try {
      await createNotification(submitData);
      reset();
      toast.success('Notification sent successfully');
      // router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to send notification');
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
                name="users"
                label="Select User"
                placeholder="+ User"
                multiple
                freeSolo
                disableCloseOnSelect
                options={userResults.map((user) => user)}
                getOptionLabel={(option) => option.email}
                renderOption={(props, option) => (
                  <li {...props} key={option.email}>
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

              <Field.Text name="title" label="Title" />

              <Field.Text multiline rows={4} name="message" label="Message" />
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
