import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { Divider, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSearchAdmins } from 'src/actions/user';
import { createValueChain } from 'src/api/services';
import { useSearchCooperative } from 'src/actions/cooperative';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
// ----------------------------------------------------------------------
export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  name: zod.string(),
  valueChainType: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  selectedAdmin?: IUserItem;
};

export function ValuechainNewEditForm({ selectedAdmin }: Props) {
  const router = useRouter();
  const { searchResults } = useSearchCooperative();
  const { userResults } = useSearchAdmins({ userType: 'SYSTEM_ADMIN' });

  const defaultValues = useMemo(
    () => ({
      name: '',
      valueChainType: '',
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
      await createValueChain(data);
      reset();
      toast.success(selectedAdmin ? 'Update success!' : 'Value chain added successfully!');
      // router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to add value chain');
    }
  });

  const handleChange = (id: number) => {
    console.log('id', id);
  };

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
              <Field.Text name="name" label="Value chain name" />
              <Field.Select name="valueChainType" label="Value chain type">
                <MenuItem
                  value=""
                  onClick={() => null}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  None
                </MenuItem>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {['CROP', 'LIVESTOCK'].map((option) => (
                  <MenuItem key={option} value={option} onClick={() => {}}>
                    {option}
                  </MenuItem>
                ))}
              </Field.Select>

              {/* <Field.MultiSelect checkbox={true} name="id" label="Admin" options={usersOptions} /> */}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!selectedAdmin ? 'Submit' : 'Save changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
