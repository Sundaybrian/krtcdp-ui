import type { ITicket } from 'src/types/notification';

import { z as zod } from 'zod';
import { useEffect, useMemo, useState } from 'react';
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
import { List, ListItem } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { approveMilkAggregation, approveTicket } from 'src/api/services';
import { useSearchAdmins } from 'src/actions/user';
import { useSearchShifts } from 'src/actions/collections';
import { useSearchRoutes } from 'src/actions/route';
import { useLocalStorage, getStorage } from 'src/hooks/use-local-storage';
import { TENANT_LOCAL_STORAGE } from 'src/utils/default';

import { toast } from 'src/components/snackbar';
import { Label } from 'src/components/label/label';
import { Form, Field } from 'src/components/hook-form';
import { UseSetStateReturn } from 'src/hooks/use-set-state';
import { type Ifilter } from '../collection-table-toolbar';

// ----------------------------------------------------------------------

export type UserQuickEditSchemaType = zod.infer<typeof UserQuickEditSchema>;

export const UserQuickEditSchema = zod.object({
  status: zod.string(),
  shift: zod.number().optional(),
  route: zod.number().optional(),
  startDate: zod.any(),
  endDate: zod.any(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  filters: UseSetStateReturn<Ifilter>;
};

export function FilterDialog({ filters, open, onClose }: Props) {
  const { state } = useLocalStorage(TENANT_LOCAL_STORAGE, { coopId: 0 });

  const { searchResults: shifts } = useSearchShifts({
    cooperativeId: state.coopId,
  });

  const { searchResults: routes } = useSearchRoutes({
    cooperativeId: state.coopId,
  });

  const defaultValues = useMemo(
    () => ({
      status: '',
      startDate: '',
      endDate: '',
      shift: 0,
      route: 0,
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Apply filters
      filters.setState({
        status: data.status || undefined,
        shift: data.shift || undefined,
        route: data.route || undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
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
      status: undefined,
      shift: undefined,
      route: undefined,
      startDate: undefined,
      endDate: undefined,
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
        <DialogTitle>Filter Collections</DialogTitle>

        <DialogContent>
          <Box gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
            <Card>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Field.Select name="shift" label="Shift">
                  <MenuItem value={0}>
                    <em>All Shifts</em>
                  </MenuItem>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  {shifts.map((shift) => (
                    <MenuItem key={shift.id} value={shift.id}>
                      {shift.name}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Select name="route" label="Route">
                  <MenuItem value={0}>
                    <em>All Routes</em>
                  </MenuItem>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  {routes.map((route) => (
                    <MenuItem key={route.id} value={route.id}>
                      {route.name}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Select name="status" label="Status">
                  <MenuItem value="">
                    <em>All Status</em>
                  </MenuItem>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  {['COLLECTED', 'VERIFIED', 'REJECTED', 'SPILLAGE_REPORTED'].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.DatePicker name="startDate" label="Start Date" />

                <Field.DatePicker name="endDate" label="End Date" />
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
