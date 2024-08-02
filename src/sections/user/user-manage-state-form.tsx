import type { Stakeholder } from 'src/types/user';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'src/components/snackbar';
import { chnageUserState } from 'src/api/services';
import { Form, Field } from 'src/components/hook-form';
import { USER_STATUS_OPTIONS } from 'src/_mock/_user';

// ----------------------------------------------------------------------

export type UserQuickEditUserStateSchemaType = zod.infer<typeof UserQuickEditUserStateSchema>;

export const UserQuickEditUserStateSchema = zod.object({
  accountState: zod.string().min(1, { message: 'Status is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentUser: Stakeholder | any;
};

export function UserManageStateForm({ currentUser, open, onClose }: Props) {
  const defaultValues = useMemo(
    () => ({
      accountState: '',
    }),
    []
  );

  const methods = useForm<UserQuickEditUserStateSchemaType>({
    mode: 'all',
    resolver: zodResolver(UserQuickEditUserStateSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    // validate that account state is not same as previous state
    if (currentUser.accountState === data.accountState) {
      toast.error('Account state is already the same');
      return;
    }
    const promise = chnageUserState(currentUser.id, {
      accountState: data.accountState,
    });
    try {
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Profile created successfully',
        error: 'Profile could not be created!',
      });

      await promise;

      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Manage User State</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Updates user account state
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Select name="accountState" label="Status">
              {USER_STATUS_OPTIONS.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Field.Select>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
