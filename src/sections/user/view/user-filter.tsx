import type { ITicket } from 'src/types/notification';

import { z as zod } from 'zod';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { List, ListItem } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { approveMilkAggregation, approveTicket, getUsers } from 'src/api/services';
import { useSearchAdmins } from 'src/actions/user';
import { useSearchShifts } from 'src/actions/collections';
import { useSearchRoutes } from 'src/actions/route';
import { useLocalStorage, getStorage } from 'src/hooks/use-local-storage';
import { useDebounce } from 'src/hooks/use-debounce';
import { TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { toast } from 'src/components/snackbar';
import { Label } from 'src/components/label/label';
import { Form, Field } from 'src/components/hook-form';
import { UseSetStateReturn } from 'src/hooks/use-set-state';
import { Ifilter } from 'src/sections/collection-report/collection-table-toolbar';

// ----------------------------------------------------------------------

export type UserQuickEditSchemaType = zod.infer<typeof UserQuickEditSchema>;

export const UserQuickEditSchema = zod.object({
  accountState: zod.string(),
  mobilePhone: zod.string().optional(),
  email: zod.string().optional(),
  firstName: zod.any(),
  lastName: zod.any(),
  userType: zod.string().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  filters: UseSetStateReturn<any>;
  userTypes: any[];
};

export function UserFilterDialog({ filters, open, onClose, userTypes = [] }: Props) {
  const defaultValues = useMemo(
    () => ({
      accountState: '',
      mobilePhone: '',
      email: '',
      firstName: '',
      lastName: '',
      userType: '',
    }),
    []
  );

  const methods = useForm<UserQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Apply filters
      filters.setState({
        accountState: data.accountState || undefined,
        mobilePhone: data.mobilePhone || undefined,
        email: data.email || undefined,
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        userType: [data.userType],
      });

      toast.success('Filters applied successfully');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to apply filters');
    }
  });

  const handleClearFilters = () => {
    filters.setState({
      accountState: undefined,
      shift: undefined,
      route: undefined,
      startDate: undefined,
      endDate: undefined,
      farmer: undefined,
      collector: undefined,
    });
    reset();
    toast.success('Filters cleared');
    onClose();
  };

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Filter</DialogTitle>

        <DialogContent>
          <Box gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
            <Card>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Field.Select name="accountState" label="Account State">
                  <MenuItem value="">
                    <em>All Account State</em>
                  </MenuItem>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  {[
                    'partialApplication',
                    'pendingApproval',
                    'active',
                    'inactive',
                    'rejected',
                    'exited',
                    'blacklisted',
                  ].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Select name="userType" label="User Type">
                  <MenuItem value="">
                    <em>All User Types</em>
                  </MenuItem>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  {userTypes.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Text name="mobilePhone" label="Mobile Number" />

                <Field.Text name="email" label="Email" />

                <Field.Text name="firstName" label="First Name" />
                <Field.Text name="lastName" label="Last Name" />
              </Stack>
            </Card>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClearFilters}>
            Clear Filters
          </Button>

          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Apply Filters
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
