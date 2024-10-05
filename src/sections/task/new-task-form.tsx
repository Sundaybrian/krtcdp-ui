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
import { Chip, Divider, MenuItem } from '@mui/material';

// import { paths } from 'src/routes/paths';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { TASKTYPES, TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { createTask } from 'src/api/services';
import { useSearchAdmins } from 'src/actions/user';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  farmerId: zod.array(zod.any()),
  title: zod.string(),
  description: zod.string(),
  assignedToId: zod.any(),
  taskType: zod.any(),
  cooperativeId: zod.any(),
  dueDate: zod.string().optional(),
  status: zod.any(),
  priority: zod.any(),
});

// ----------------------------------------------------------------------

type Props = {
  selectedAdmin?: IUserItem;
};

export function TaskForm({ selectedAdmin }: Props) {
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const { userResults } = useSearchAdmins({ userType: 'COOPERATIVE_ADMIN', coopId: state.coopId });
  const farmers = useSearchAdmins({ userType: 'FARMER' });

  const defaultValues = useMemo(
    () => ({
      farmerId: [],
      title: '',
      description: '',
      assignedToId: '',
      taskType: '',
      cooperativeId: state.coopId,
      dueDate: '',
      status: 'PENDING',
      priority: 'MEDIUM',
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
    data.farmerId = data.farmerId.map((admin: any) => admin.id);
    data.assignedToId = data.assignedToId.id;
    data.cooperativeId = state.coopId;
    if (data.dueDate) {
      data.dueDate = new Date(data.dueDate).toISOString();
    }

    console.log('DATA', data);

    try {
      await createTask(data);
      reset();
      toast.success('Task created successfully');
      // router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create task');
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
              <Field.Text name="title" label="Title" />

              <Field.Select name="taskType" label="Type">
                <MenuItem
                  value=""
                  onClick={() => null}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  None
                </MenuItem>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {TASKTYPES.map((taskType) => (
                  <MenuItem key={taskType} value={taskType} onClick={() => {}}>
                    {taskType}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text multiline rows={4} name="description" label="Description" />

              <Field.Autocomplete
                name="farmerId"
                label="Select Farmers"
                placeholder="+ User"
                multiple
                freeSolo
                disableCloseOnSelect
                options={farmers.userResults.map((user) => user)}
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

              <Field.Autocomplete
                name="assignedToId"
                label="Assign To User"
                placeholder="+ User"
                multiple={false}
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

              <Field.DatePicker name="dueDate" label="Due Date" />
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
